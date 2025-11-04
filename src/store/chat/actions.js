import * as types from './actionTypes';

export const connectWebSocket = () => ({
  type: types.CONNECT_WEBSOCKET,
});

export const webSocketConnected = () => ({
  type: types.WEBSOCKET_CONNECTED,
});

export const webSocketDisconnected = () => ({
  type: types.WEBSOCKET_DISCONNECTED,
});

export const webSocketConnectionError = (error) => ({
  type: types.WEBSOCKET_CONNECTION_ERROR,
  payload: error,
});

export const setConnectionStatus = (status) => ({
  type: types.SET_CONNECTION_STATUS,
  payload: status,
});

export const sendMessage = (text, username) => ({
  type: types.SEND_MESSAGE,
  payload: { text, username },
});

export const messageReceived = (message) => ({
  type: types.MESSAGE_RECEIVED,
  payload: message,
});

export const messageHistoryReceived = (messages) => ({
  type: types.MESSAGE_HISTORY_RECEIVED,
  payload: messages,
});

export const messageError = (error) => ({
  type: types.MESSAGE_ERROR,
  payload: error,
});
