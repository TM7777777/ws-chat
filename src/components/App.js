import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { connectWebSocket, getConnectionStatus } from '../store/chat';
import ErrorBoundary from './ErrorBoundary';
import ChatHeader from './ChatHeader';
import BackgroundAnimation from './BackgroundAnimation';
import ConnectionStatus from './ConnectionStatus';
import SetUsernamePage from '../pages/SetUsernamePage';
import RoomsPage from '../pages/RoomsPage';
import ChatPage from '../pages/ChatPage';

const App = () => {
  const dispatch = useDispatch();
  const connectionStatus = useSelector(getConnectionStatus);

  useEffect(() => {
    dispatch(connectWebSocket());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="app">
        <Router>
          <div className="chat-container">
            <ChatHeader />
            <ConnectionStatus status={connectionStatus} />
            <div className="chat-content">
              <BackgroundAnimation />
              <Routes>
                <Route path="/" element={<SetUsernamePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/chat/:roomId" element={<ChatPage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </div>
    </ErrorBoundary>
  );
};

export default App;
