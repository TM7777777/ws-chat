import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, getConnectionStatus } from '../store/chat';
import { getCurrentRoom } from '../store/rooms';
import { getUsername } from '../store/user';

const MessageInput = () => {
  const dispatch = useDispatch();
  const connectionStatus = useSelector(getConnectionStatus);
  const currentRoom = useSelector(getCurrentRoom);
  const username = useSelector(getUsername);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateAndSendMessage = () => {
    const trimmedMessage = message.trim();

    setError('');

    if (!username) {
      setError('Username is not set');
      return;
    }

    if (!trimmedMessage) {
      setError('Message cannot be empty');
      return;
    }

    if (trimmedMessage.length > 255) {
      setError('Message cannot exceed 255 characters');
      return;
    }

    if (connectionStatus !== 'connected') {
      setError('Not connected to server');
      return;
    }

    if (!currentRoom) {
      setError('Please select a room first');
      return;
    }

    dispatch(sendMessage(trimmedMessage, username));
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateAndSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      validateAndSendMessage();
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isDisabled = connectionStatus !== 'connected' || !currentRoom;

  return (
    <div className="input-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder={
            connectionStatus !== 'connected' ? 'Connecting...' : 'Message (Press Enter to send)'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          className="message-input"
        />
        <button type="submit" disabled={isDisabled || !message.trim()}>
          Send
        </button>
      </form>
      <div className={`character-counter ${message.length > 255 ? 'error' : ''}`}>
        Message: {message.length}/255 characters
        {message.length > 255 && ' - Too long!'}
      </div>
    </div>
  );
};

export default MessageInput;
