import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import './App.css';

function App() {
  const [username, setUsername] = useState('');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home username={username} setUsername={setUsername} />} />
          <Route path="/game/:roomId" element={<Game username={username} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 