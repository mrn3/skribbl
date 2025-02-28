import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Home.css';

function Home({ username, setUsername }) {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    if (!username) {
      alert('Please enter a username');
      return;
    }
    
    const newRoomId = uuidv4().substring(0, 8);
    navigate(`/game/${newRoomId}`);
  };

  const joinRoom = () => {
    if (!username) {
      alert('Please enter a username');
      return;
    }
    
    if (!roomId) {
      alert('Please enter a room ID');
      return;
    }
    
    navigate(`/game/${roomId}`);
  };

  return (
    <div className="home-container">
      <h1>Scribbl Clone</h1>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      
      <div className="buttons">
        <button onClick={createRoom}>Create Room</button>
        
        <div className="join-room">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    </div>
  );
}

export default Home; 