import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsername } from '../store/user';
import RoomSelection from '../components/RoomSelection';

const RoomsPage = () => {
  const username = useSelector(getUsername);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  if (!username) {
    return null; // Will redirect
  }

  return <RoomSelection />;
};

export default RoomsPage;