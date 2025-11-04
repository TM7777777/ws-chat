import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUsername } from '../store/user';

const SetUsernamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUsername = usernameInput.trim();

    setError('');

    if (!trimmedUsername) {
      setError('Username cannot be empty');
      return;
    }

    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      setError('Username must be between 2-20 characters');
      return;
    }

    dispatch(setUsername(trimmedUsername));
    navigate('/rooms');
  };

  return (
    <div className="set-username-page">
      <div className="username-setup-container">
        <p>Please enter your username to get started</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="username-setup-form">
          <input
            type="text"
            placeholder="Enter your username..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            maxLength={20}
            required
          />
          <button type="submit" disabled={!usernameInput.trim()}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetUsernamePage;
