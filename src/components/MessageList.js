import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Message from './Message';
import { getMessages } from '../store/chat';

const MessageList = () => {
  const filteredMessages = useSelector(getMessages);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  return (
    <div className="messages-container">
      {filteredMessages.length === 0 ? (
        <div className="no-messages">
          <div className="no-messages-container">
            <div className="no-messages-text">No messages</div>
            <div className="no-messages-subtext">Start the conversation!</div>
          </div>
        </div>
      ) : (
        <div className="messages-list">
          {filteredMessages.map((message) => <Message key={message.id} message={message} />)}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
