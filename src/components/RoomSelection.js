import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getRooms, createRoom, joinRoom, getRoomsList } from '../store/rooms';
import { getConnectionStatus } from '../store/chat';
import { getUsername } from '../store/user';

const RoomSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rooms = useSelector(getRoomsList);
  const connectionStatus = useSelector(getConnectionStatus);
  const username = useSelector(getUsername);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');

  useEffect(() => {
    if (connectionStatus === 'connected') {
      dispatch(getRooms());
    }
  }, [connectionStatus, dispatch]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      dispatch(createRoom(newRoomName.trim(), newRoomDescription.trim() || undefined));
      setNewRoomName('');
      setNewRoomDescription('');
    }
  };

  const handleJoinRoom = (room) => {
    dispatch(joinRoom(room.id, username));
    navigate(`/chat/${room.id}`);
  };

  if (connectionStatus !== 'connected') {
    return (
      <div className="room-selection">
        <div className="connection-message">
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Not connected to server'}
        </div>
      </div>
    );
  }

  return (
    <div className="room-selection">
      <h2>Select a Room</h2>
      <div className="rooms-scroll-container">
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card" onClick={() => handleJoinRoom(room)}>
              <div className="room-name">{room.name}</div>
              {room.description && <div className="room-description">{room.description}</div>}
              <div className="room-users">
                {room.clientCount} {room.clientCount === 1 ? 'user' : 'users'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleCreateRoom} className="create-room-form">
        <input
          type="text"
          placeholder="Room name..."
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          maxLength={30}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)..."
          value={newRoomDescription}
          onChange={(e) => setNewRoomDescription(e.target.value)}
          maxLength={100}
        />
        <button type="submit" disabled={!newRoomName.trim()}>
          Create Room
        </button>
      </form>
    </div>
  );
};

export default RoomSelection;
