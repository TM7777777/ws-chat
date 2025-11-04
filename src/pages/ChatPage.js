import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsername } from '../store/user';
import { getRoomById } from '../store/rooms';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ConfettiCanvas from '../components/ConfettiCanvas';

const ChatPage = () => {
  const { roomId } = useParams();
  const username = useSelector(getUsername);
  const room = useSelector((state) => getRoomById(state, roomId));
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }

    if (!room) {
      navigate('/rooms');
      return;
    }
  }, [username, room, navigate]);

  return (
    <div className="chat-page">
      <MessageList />
      <MessageInput />
      <ConfettiCanvas />
    </div>
  );
};

export default ChatPage;
