import React from 'react';

const Message = ({ message }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (message.isSystem) {
    return (
      <div className="message message-system" data-message-id={message.id}>
        <div className="message-text">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="message" data-message-id={message.id}>
      <div className="message-content">
        <strong className="message-username">{message.username}:</strong>
        <span className="message-text"> {message.text}</span>
      </div>
      <div className="message-time">{formatTime(message.timestamp)}</div>
    </div>
  );
};

export default Message;
