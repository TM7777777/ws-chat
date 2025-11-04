import { take, select } from 'redux-saga/effects';
import { SEND_MESSAGE } from './actionTypes';
import { sendWebSocketMessage } from './sagas';

function* handleSendMessage(action) {
  try {
    const { text, username } = action.payload;
    const state = yield select();
    const currentRoomId = state.rooms.currentRoomId;

    if (!currentRoomId) {
      console.error('No room selected');
      return;
    }

    sendWebSocketMessage({
      type: 'send_message',
      payload: {
        text,
        username,
        roomId: currentRoomId,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

export function* watchSendMessage() {
  while (true) {
    const action = yield take(SEND_MESSAGE);
    yield handleSendMessage(action);
  }
}
