import { all, fork } from 'redux-saga/effects';
import { watchWebSocketConnection, watchSendMessage } from './chat';
import { watchRoomActions } from './rooms';

export default function* rootSaga() {
  yield all([
    fork(watchWebSocketConnection),
    fork(watchSendMessage),
    fork(watchRoomActions)
  ]);
}