import { take, call } from 'redux-saga/effects';
import * as types from './actionTypes';
import { sendWebSocketMessage } from '../chat/sagas';

function* handleGetRooms() {
  try {
    sendWebSocketMessage({ type: 'get_rooms' });
  } catch (error) {
    console.error('Error getting rooms:', error);
  }
}

function* handleCreateRoom(action) {
  try {
    const { name, description } = action.payload;
    sendWebSocketMessage({
      type: 'create_room',
      payload: { name, description },
    });
  } catch (error) {
    console.error('Error creating room:', error);
  }
}

function* handleJoinRoom(action) {
  try {
    const { roomId, username } = action.payload;
    sendWebSocketMessage({
      type: 'join_room',
      payload: { roomId, username },
    });
  } catch (error) {
    console.error('Error joining room:', error);
  }
}

function* handleLeaveRoom() {
  try {
    sendWebSocketMessage({ type: 'leave_room' });
  } catch (error) {
    console.error('Error leaving room:', error);
  }
}

export function* watchRoomActions() {
  while (true) {
    const action = yield take([
      types.GET_ROOMS,
      types.CREATE_ROOM,
      types.JOIN_ROOM,
      types.LEAVE_ROOM,
    ]);

    switch (action.type) {
      case types.GET_ROOMS:
        yield call(handleGetRooms);
        break;
      case types.CREATE_ROOM:
        yield call(handleCreateRoom, action);
        break;
      case types.JOIN_ROOM:
        yield call(handleJoinRoom, action);
        break;
      case types.LEAVE_ROOM:
        yield call(handleLeaveRoom);
        break;
    }
  }
}
