import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Canvas from './Canvas';
import ChatBox from './ChatBox';
import PlayersList from './PlayersList';
import './Game.css';

const ENDPOINT = 'http://localhost:5001';

function Game({ username }) {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentDrawer, setCurrentDrawer] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [word, setWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [maxRounds, setMaxRounds] = useState(3);
  
  // Connect to socket
  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [username, navigate]);
  
  // Join room when socket is ready
  useEffect(() => {
    if (socket && username && roomId) {
      socket.emit('join-room', { roomId, username });
      
      // Socket event listeners
      socket.on('player-joined', ({ players, message }) => {
        setPlayers(players);
        setMessages(prev => [...prev, { type: 'system', content: message }]);
      });
      
      socket.on('player-left', ({ players, message }) => {
        setPlayers(players);
        setMessages(prev => [...prev, { type: 'system', content: message }]);
      });
      
      socket.on('chat-message', ({ username, message, id }) => {
        setMessages(prev => [...prev, { type: 'chat', username, content: message, id }]);
      });
      
      socket.on('correct-guess', ({ username, scores, players }) => {
        setPlayers(players);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `${username} guessed the word correctly!` 
        }]);
      });
      
      socket.on('new-turn', ({ drawer, drawerId, timeLeft }) => {
        setCurrentDrawer(drawerId);
        setIsDrawing(socket.id === drawerId);
        setTimeLeft(timeLeft);
        setWord('');
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `${drawer} is now drawing!` 
        }]);
      });
      
      socket.on('your-turn', ({ word }) => {
        setWord(word);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `Your turn to draw: ${word}` 
        }]);
      });
      
      socket.on('time-update', ({ timeLeft }) => {
        setTimeLeft(timeLeft);
      });
      
      socket.on('time-up', ({ word }) => {
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `Time's up! The word was: ${word}` 
        }]);
      });
      
      socket.on('new-round', ({ round, maxRounds }) => {
        setRound(round);
        setMaxRounds(maxRounds);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `Round ${round} of ${maxRounds}` 
        }]);
      });
      
      socket.on('game-over', ({ players }) => {
        setGameStarted(false);
        // Sort players by score
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        setMessages(prev => [...prev, { 
          type: 'system', 
          content: `Game over! Winner: ${sortedPlayers[0].username}` 
        }]);
      });
    }
    
    return () => {
      if (socket) {
        socket.off('player-joined');
        socket.off('player-left');
        socket.off('chat-message');
        socket.off('correct-guess');
        socket.off('new-turn');
        socket.off('your-turn');
        socket.off('time-update');
        socket.off('time-up');
        socket.off('new-round');
        socket.off('game-over');
      }
    };
  }, [socket, username, roomId]);
  
  const startGame = () => {
    if (socket && players.length > 1) {
      socket.emit('start-game');
      setGameStarted(true);
    } else {
      alert('Need at least 2 players to start the game');
    }
  };
  
  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('message', { message });
    }
  };
  
  const sendDrawData = (data) => {
    if (socket && isDrawing) {
      socket.emit('draw', data);
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>Room: {roomId}</h2>
        <div className="game-info">
          {gameStarted ? (
            <>
              <div className="round-info">Round: {round}/{maxRounds}</div>
              <div className="time-info">Time: {timeLeft}s</div>
              {word && <div className="word-info">Word: {word}</div>}
            </>
          ) : (
            <button onClick={startGame} disabled={players.length < 2}>
              Start Game
            </button>
          )}
        </div>
      </div>
      
      <div className="game-content">
        <PlayersList players={players} currentDrawer={currentDrawer} />
        
        <div className="canvas-container">
          <Canvas 
            isDrawing={isDrawing} 
            sendDrawData={sendDrawData} 
            socket={socket}
          />
        </div>
        
        <ChatBox 
          messages={messages} 
          sendMessage={sendMessage} 
        />
      </div>
    </div>
  );
}

export default Game; 