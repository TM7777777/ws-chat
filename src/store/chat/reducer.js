import * as types from './actionTypes';

const initialState = {
  messages: [],
  connectionStatus: 'disconnected',
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.WEBSOCKET_CONNECTED:
      return {
        ...state,
        connectionStatus: 'connected',
      };

    case types.WEBSOCKET_DISCONNECTED:
      return {
        ...state,
        connectionStatus: 'disconnected',
      };

    case types.WEBSOCKET_CONNECTION_ERROR:
      return {
        ...state,
        connectionStatus: 'error',
      };

    case types.SET_CONNECTION_STATUS:
      return {
        ...state,
        connectionStatus: action.payload,
      };

    case types.MESSAGE_RECEIVED:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case types.MESSAGE_HISTORY_RECEIVED:
      return {
        ...state,
        messages: action.payload,
      };

    case types.MESSAGE_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default chatReducer;