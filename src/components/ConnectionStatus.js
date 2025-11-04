import React from 'react';

const ConnectionStatus = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'connected':
        return 'connected';
      case 'connecting':
        return 'connecting';
      case 'disconnected':
      case 'error':
        return 'disconnected';
      default:
        return 'disconnected';
    }
  };

  return (
    <div className={`connection-status ${getStatusClass()}`}>
      {getStatusText()}
    </div>
  );
};

export default ConnectionStatus;