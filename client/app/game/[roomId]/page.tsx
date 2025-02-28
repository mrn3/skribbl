'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import DrawingCanvas from '@/components/DrawingCanvas';
import ChatBox from '@/components/ChatBox';
import PlayersList from '@/components/PlayersList';
import WordSelection from '@/components/WordSelection';
import GameInfo from '@/components/GameInfo';
import { supabase } from '@/lib/supabase';
import confetti from 'canvas-confetti';

// Game states
enum GameState {
  WAITING = 'waiting',
  STARTING = 'starting',
  SELECTING_WORD = 'selecting_word',
  DRAWING = 'drawing',
  ROUND_ENDED = 'round_ended',
  ENDED = 'ended',
}

// Player interface
interface Player {
  id: string;
  username: string;
  score: number;
}

export default function GamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = params.roomId as string;
  const username = searchParams.get('username') || 'Anonymous';
  
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [wordHint, setWordHint] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [round, setRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winner, setWinner] = useState<Player | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [userId, setUserId] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  // Initialize socket connection
  useEffect(() => {
    const initializeUser = async () => {
      // Check if user is already authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
      } else {
        // Sign in anonymously
        const { data, error } = await supabase.auth.signInAnonymously();
        
        if (error) {
          console.error('Error signing in:', error);
          return;
        }
        
        if (data.user) {
          setUserId(data.user.id);
        }
      }
    };
    
    initializeUser();
    
    // Initialize socket connection with error handling
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
      const newSocket = io(serverUrl, { 
        reconnectionAttempts: 3,
        timeout: 5000,
        // Use transports that work even if the server is not available
        transports: ['websocket', 'polling']
      });
      
      setSocket(newSocket);
      socketRef.current = newSocket;
      
      // Handle connection error
      newSocket.on('connect_error', (err) => {
        console.warn('Socket connection error:', err.message);
        // We'll still set the socket so the UI can render, but the game won't be functional
      });
      
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } catch (error) {
      console.error('Failed to initialize socket connection:', error);
      // Continue without socket for UI development/testing
    }
  }, []);
  
  // Join room when socket and userId are ready
  useEffect(() => {
    if (!socket || !userId) return;
    
    // Join the room
    socket.emit('join-room', { roomId, username, userId });
    
    // Socket event listeners
    socket.on('player-joined', ({ players, gameState }) => {
      setPlayers(players);
      setGameState(gameState);
    });
    
    socket.on('player-left', ({ players }) => {
      setPlayers(players);
    });
    
    socket.on('game-starting', ({ countdown }) => {
      setGameState(GameState.STARTING);
      // Could add countdown display here
    });
    
    socket.on('round-started', ({ round, totalRounds, drawer, drawerId }) => {
      setRound(round);
      setTotalRounds(totalRounds);
      setCurrentDrawer(drawerId);
      setGameState(GameState.SELECTING_WORD);
      
      // Clear canvas for new round
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    });
    
    socket.on('choose-word', ({ options }) => {
      setWordOptions(options);
    });
    
    socket.on('current-word', ({ word }) => {
      setCurrentWord(word);
    });
    
    socket.on('word-hint', ({ hint }) => {
      setWordHint(hint);
    });
    
    socket.on('drawing-started', () => {
      setGameState(GameState.DRAWING);
      setTimeLeft(80); // 80 seconds for drawing
      
      // Start timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    });
    
    socket.on('draw-data', (drawData) => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          // Apply drawing data to canvas
          if (drawData.type === 'line') {
            context.strokeStyle = drawData.color;
            context.lineWidth = drawData.size;
            context.beginPath();
            context.moveTo(drawData.x0, drawData.y0);
            context.lineTo(drawData.x1, drawData.y1);
            context.stroke();
          }
        }
      }
    });
    
    socket.on('canvas-cleared', () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    });
    
    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
      
      // If it's a correct guess, show confetti
      if (message.isCorrectGuess) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
    
    socket.on('update-scores', (newScores) => {
      setScores(newScores);
    });
    
    socket.on('round-ended', ({ word, scores }) => {
      setGameState(GameState.ROUND_ENDED);
      setCurrentWord(word);
      setScores(scores);
    });
    
    socket.on('game-ended', ({ winner, leaderboard }) => {
      setGameState(GameState.ENDED);
      setWinner(winner);
      setLeaderboard(leaderboard);
      
      // Show confetti for the winner
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.3 }
      });
    });
    
    socket.on('room-reset', ({ players, gameState }) => {
      setPlayers(players);
      setGameState(gameState);
      setCurrentWord('');
      setWordHint('');
      setRound(0);
      setMessages([]);
      
      // Clear canvas
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    });
    
    return () => {
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('game-starting');
      socket.off('round-started');
      socket.off('choose-word');
      socket.off('current-word');
      socket.off('word-hint');
      socket.off('drawing-started');
      socket.off('draw-data');
      socket.off('canvas-cleared');
      socket.off('chat-message');
      socket.off('update-scores');
      socket.off('round-ended');
      socket.off('game-ended');
      socket.off('room-reset');
    };
  }, [socket, roomId, username, userId]);
  
  // Handle drawing
  const handleDraw = (drawData: any) => {
    if (socket && isDrawing) {
      socket.emit('draw', { roomId, drawData });
    }
  };
  
  // Handle clear canvas
  const handleClearCanvas = () => {
    if (socket && isDrawing) {
      socket.emit('clear-canvas', { roomId });
    }
  };
  
  // Handle sending chat messages
  const handleSendMessage = (message: string) => {
    if (socket && message.trim()) {
      socket.emit('send-message', { roomId, message });
    }
  };
  
  // Handle word selection
  const handleSelectWord = (word: string) => {
    if (socket) {
      socket.emit('select-word', { roomId, word });
    }
  };
  
  // Check if current user is the drawer
  useEffect(() => {
    if (socket) {
      setIsDrawing(socket.id === currentDrawer);
    }
  }, [socket, currentDrawer]);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Game header */}
      <header className="game-header">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Skribbl.io Clone</h1>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-700 px-3 py-1 rounded">
              Room: <span className="font-bold">{roomId}</span>
            </div>
            <div className="bg-blue-700 px-3 py-1 rounded">
              Players: <span className="font-bold">{players.length}</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Game content */}
      <div className="game-container">
        {/* Left sidebar - Players */}
        <div className="player-list">
          <PlayersList 
            players={players} 
            scores={scores} 
            currentDrawer={currentDrawer} 
          />
        </div>
        
        {/* Main game area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Game info */}
          <GameInfo 
            gameState={gameState} 
            round={round} 
            totalRounds={totalRounds} 
            timeLeft={timeLeft} 
            currentWord={currentWord} 
            wordHint={wordHint} 
            isDrawing={isDrawing} 
          />
          
          {/* Word selection */}
          {gameState === GameState.SELECTING_WORD && isDrawing && (
            <WordSelection 
              words={wordOptions} 
              onSelectWord={handleSelectWord} 
            />
          )}
          
          {/* Drawing canvas */}
          <div className="canvas-container">
            <DrawingCanvas 
              canvasRef={canvasRef} 
              isDrawing={isDrawing} 
              onDraw={handleDraw} 
              onClearCanvas={handleClearCanvas} 
            />
          </div>
          
          {/* Game ended view */}
          {gameState === GameState.ENDED && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold text-center mb-4">Game Over!</h2>
                {winner && (
                  <div className="text-center mb-6">
                    <p className="text-lg">Winner: <span className="font-bold text-green-600">{winner.username}</span></p>
                    <p className="text-xl font-bold">Score: {winner.score}</p>
                  </div>
                )}
                
                <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
                <ul className="space-y-2">
                  {leaderboard.map((player, index) => (
                    <li key={player.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                      <span>
                        {index + 1}. {player.username}
                      </span>
                      <span className="font-bold">{player.score}</span>
                    </li>
                  ))}
                </ul>
                
                <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                  A new game will start soon...
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right sidebar - Chat */}
        <div className="chat-container">
          <ChatBox 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            currentWord={currentWord}
            isDrawing={isDrawing}
          />
        </div>
      </div>
    </div>
  );
} 