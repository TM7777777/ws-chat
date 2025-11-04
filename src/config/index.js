const config = {
  websocketUrl: 'ws://localhost:8080',
  reconnection: {
    maxAttempts: 5,
    baseDelay: 2000, // 2 seconds
  }
};

export default config;