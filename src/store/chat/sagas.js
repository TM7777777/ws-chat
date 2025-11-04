import { take, call, put, fork, cancelled, delay, select, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {
  webSocketConnected,
  webSocketDisconnected,
  webSocketConnectionError,
  setConnectionStatus,
  messageReceived,
  messageHistoryReceived,
  messageError,
} from './actions';
import { roomsListReceived, roomJoined, userJoinedRoom, userLeftRoom } from '../rooms/actions';
import { CONNECT_WEBSOCKET } from './actionTypes';
import config from '../../config';

let websocket = null;
let reconnectionTask = null;

function createWebSocketConnection() {
  return eventChannel((emitter) => {
    websocket = new WebSocket(config.websocketUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      emitter(webSocketConnected());
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data, emitter);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    websocket.onclose = (event) => {
      console.log('WebSocket disconnected', event.code, event.reason);
      emitter(webSocketDisconnected());

      // Only attempt reconnection if it wasn't a clean close (code 1000)
      if (event.code !== 1000) {
        emitter({ type: 'START_RECONNECTION' });
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      emitter(webSocketConnectionError('Connection error'));
    };

    return () => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
      websocket = null;
    };
  });
}

function handleServerMessage(data, emitter) {
  switch (data.type) {
    case 'message':
    case 'message_received':
      emitter(messageReceived(data.payload));
      break;

    case 'message_history':
      emitter(messageHistoryReceived(data.payload));
      break;

    case 'rooms_list':
      emitter(roomsListReceived(data.payload));
      break;

    case 'room_joined':
      emitter(roomJoined(data.payload));
      break;

    case 'user_joined':
      emitter(userJoinedRoom(data.payload.username));
      emitter(
        messageReceived({
          id: `system-${Date.now()}-${Math.random()}`,
          text: `${data.payload.username} joined the room`,
          username: 'System',
          timestamp: new Date().toISOString(),
          roomId: data.payload.roomId,
          isSystem: true,
        }),
      );
      break;

    case 'user_left':
      emitter(userLeftRoom(data.payload.username));
      emitter(
        messageReceived({
          id: `system-${Date.now()}-${Math.random()}`,
          text: `${data.payload.username} left the room`,
          username: 'System',
          timestamp: new Date().toISOString(),
          roomId: data.payload.roomId,
          isSystem: true,
        }),
      );
      break;

    case 'error':
      console.error('Server error:', data.payload?.message || data.payload);
      emitter(messageError(data.payload?.message || data.payload));
      break;

    default:
      console.log('Received message:', data);
  }
}

export function sendWebSocketMessage(message) {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
}

function* handleWebSocketConnection() {
  try {
    yield put(setConnectionStatus('connecting'));

    const socketChannel = yield call(createWebSocketConnection);

    while (true) {
      const action = yield take(socketChannel);

      if (action.type === 'START_RECONNECTION') {
        if (reconnectionTask) {
          yield cancel(reconnectionTask);
        }
        reconnectionTask = yield fork(attemptReconnection);
      } else {
        yield put(action);
      }
    }
  } catch (error) {
    console.error('WebSocket connection error:', error);
    yield put(webSocketConnectionError('Connection failed'));

    yield fork(attemptReconnection);
  } finally {
    if (yield cancelled()) {
      if (websocket) {
        websocket.close();
        websocket = null;
      }
    }
  }
}

function* attemptReconnection() {
  let attempts = 0;
  const { maxAttempts, baseDelay } = config.reconnection;

  while (attempts < maxAttempts) {
    try {
      const connectionStatus = yield select((state) => state.chat.connectionStatus);

      if (connectionStatus === 'connected') {
        return;
      }

      attempts++;
      const delayTime = baseDelay * Math.pow(2, attempts - 1);
      console.log(`Reconnection attempt ${attempts}/${maxAttempts} in ${delayTime}ms...`);

      yield delay(delayTime);

      yield fork(handleWebSocketConnection);

      yield delay(3000);

      const newStatus = yield select((state) => state.chat.connectionStatus);
      if (newStatus === 'connected') {
        console.log('Reconnection successful!');
        reconnectionTask = null;
        return;
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error);
    }
  }

  console.error('Max reconnection attempts reached');
  yield put(setConnectionStatus('disconnected'));
  reconnectionTask = null;
}

export function* watchWebSocketConnection() {
  while (true) {
    yield take(CONNECT_WEBSOCKET);
    yield fork(handleWebSocketConnection);
  }
}
