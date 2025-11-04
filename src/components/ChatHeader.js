import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { leaveRoom, getCurrentRoom } from '../store/rooms';
import { getUsername } from '../store/user';
import ThemeToggle from './ThemeToggle';

const ChatHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentRoom = useSelector(getCurrentRoom);
  const username = useSelector(getUsername);

  const handleLeaveRoom = () => {
    if (currentRoom) {
      dispatch(leaveRoom());
      navigate('/rooms');
    }
  };

  return (
    <div className="chat-header">
      <div className="chat-header-title">
        <h1>WebSocket Chat</h1>
        {currentRoom ? (
          <div className="chat-header-info">
            - Room: <strong>{currentRoom}</strong>
            <button onClick={handleLeaveRoom} className="leave-room-btn">
              Leave Room
            </button>
          </div>
        ) : (
          username && (
            <div className="chat-header-info">
              - Username: <strong>{username}</strong>
            </div>
          )
        )}
      </div>
      <ThemeToggle />
    </div>
  );
};

export default ChatHeader;
