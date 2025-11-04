export const getMessages = (state) => state.chat.messages;
export const getConnectionStatus = (state) => state.chat.connectionStatus;
export const getChatError = (state) => state.chat.error;

export const isConnected = (state) => state.chat.connectionStatus === 'connected';
export const isConnecting = (state) => state.chat.connectionStatus === 'connecting';
export const hasConnectionError = (state) => state.chat.connectionStatus === 'error';
