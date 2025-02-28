import { Server, Socket } from 'socket.io';
import { SupabaseClient } from '@supabase/supabase-js';
import { generateWordList } from '../utils/wordGenerator.js';
import { Room, Player, GameState } from '../models/gameModels.js';

// Store active game rooms
const rooms: Map<string, Room> = new Map();

// Time settings (in milliseconds)
const ROUND_TIME = 80000; // 80 seconds per round
const INTERMISSION_TIME = 10000; // 10 seconds between rounds

export const setupGameHandlers = (io: Server, supabase: SupabaseClient) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle player joining a room
    socket.on('join-room', async ({ roomId, username, userId }) => {
      let room = rooms.get(roomId);

      // Create room if it doesn't exist
      if (!room) {
        room = {
          id: roomId,
          players: [],
          currentRound: 0,
          totalRounds: 3,
          currentDrawer: null,
          currentWord: '',
          wordOptions: [],
          gameState: GameState.WAITING,
          timer: null,
          scores: {},
          chat: [],
          wordList: await generateWordList(),
        };
        rooms.set(roomId, room);
      }

      // Add player to room
      const player: Player = {
        id: socket.id,
        username,
        userId,
        score: 0,
        hasGuessedCorrectly: false,
      };

      room.players.push(player);
      room.scores[socket.id] = 0;
      
      // Join the Socket.io room
      socket.join(roomId);
      
      // Notify everyone about the new player
      io.to(roomId).emit('player-joined', {
        players: room.players,
        gameState: room.gameState,
      });

      // If we have at least 2 players and game is in WAITING state, start the game
      if (room.players.length >= 2 && room.gameState === GameState.WAITING) {
        startGame(roomId, io);
      }

      // Save room activity to Supabase
      try {
        await supabase.from('rooms').upsert({
          id: roomId,
          player_count: room.players.length,
          last_active: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error saving room to Supabase:', error);
      }
    });

    // Handle player leaving
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      // Find which room the player was in
      for (const [roomId, room] of rooms.entries()) {
        const playerIndex = room.players.findIndex(p => p.id === socket.id);
        
        if (playerIndex !== -1) {
          // Remove player from room
          room.players.splice(playerIndex, 1);
          delete room.scores[socket.id];
          
          // Notify others
          io.to(roomId).emit('player-left', {
            players: room.players,
            playerId: socket.id,
          });
          
          // If room is empty, remove it
          if (room.players.length === 0) {
            if (room.timer) clearTimeout(room.timer);
            rooms.delete(roomId);
          } 
          // If current drawer left, move to next round
          else if (room.currentDrawer === socket.id && room.gameState === GameState.DRAWING) {
            clearTimeout(room.timer);
            io.to(roomId).emit('drawer-left');
            startNextRound(roomId, io);
          }
          
          break;
        }
      }
    });

    // Handle drawing data
    socket.on('draw', ({ roomId, drawData }) => {
      const room = rooms.get(roomId);
      
      // Only allow current drawer to send drawing data
      if (room && room.currentDrawer === socket.id) {
        // Broadcast drawing data to all other players in the room
        socket.to(roomId).emit('draw-data', drawData);
      }
    });

    // Handle clear canvas
    socket.on('clear-canvas', ({ roomId }) => {
      const room = rooms.get(roomId);
      
      if (room && room.currentDrawer === socket.id) {
        io.to(roomId).emit('canvas-cleared');
      }
    });

    // Handle chat messages and word guessing
    socket.on('send-message', ({ roomId, message }) => {
      const room = rooms.get(roomId);
      
      if (!room) return;
      
      const player = room.players.find(p => p.id === socket.id);
      
      if (!player) return;
      
      // If player is the drawer, they can't guess
      if (socket.id === room.currentDrawer) {
        const chatMessage = {
          sender: player.username,
          message,
          isSystem: false,
          isCorrectGuess: false,
        };
        
        room.chat.push(chatMessage);
        io.to(roomId).emit('chat-message', chatMessage);
        return;
      }
      
      // Check if message is the correct word
      if (
        room.gameState === GameState.DRAWING &&
        message.toLowerCase().trim() === room.currentWord.toLowerCase() &&
        !player.hasGuessedCorrectly
      ) {
        // Player guessed correctly
        player.hasGuessedCorrectly = true;
        
        // Calculate score based on time left
        const timeLeft = ROUND_TIME - (Date.now() - room.roundStartTime!);
        const scoreGain = Math.floor(timeLeft / 1000) + 50;
        
        player.score += scoreGain;
        room.scores[socket.id] += scoreGain;
        
        // Send system message about correct guess
        const correctGuessMessage = {
          sender: 'System',
          message: `${player.username} guessed the word!`,
          isSystem: true,
          isCorrectGuess: true,
        };
        
        room.chat.push(correctGuessMessage);
        io.to(roomId).emit('chat-message', correctGuessMessage);
        
        // Update scores
        io.to(roomId).emit('update-scores', room.scores);
        
        // Check if all players have guessed correctly
        const allGuessedCorrectly = room.players.every(
          p => p.id === room.currentDrawer || p.hasGuessedCorrectly
        );
        
        if (allGuessedCorrectly) {
          clearTimeout(room.timer);
          startNextRound(roomId, io);
        }
      } else {
        // Regular chat message
        const chatMessage = {
          sender: player.username,
          message,
          isSystem: false,
          isCorrectGuess: false,
        };
        
        room.chat.push(chatMessage);
        io.to(roomId).emit('chat-message', chatMessage);
      }
    });

    // Handle word selection by drawer
    socket.on('select-word', ({ roomId, word }) => {
      const room = rooms.get(roomId);
      
      if (room && room.currentDrawer === socket.id && room.gameState === GameState.SELECTING_WORD) {
        room.currentWord = word;
        room.gameState = GameState.DRAWING;
        room.roundStartTime = Date.now();
        
        // Send word to drawer
        socket.emit('current-word', { word: room.currentWord });
        
        // Send word length to other players
        socket.to(roomId).emit('word-hint', { hint: '_ '.repeat(room.currentWord.length).trim() });
        
        // Notify all players that drawing has started
        io.to(roomId).emit('drawing-started');
        
        // Set timer for round
        room.timer = setTimeout(() => {
          endRound(roomId, io);
        }, ROUND_TIME);
      }
    });
  });
};

// Start the game
const startGame = (roomId: string, io: Server) => {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  room.gameState = GameState.STARTING;
  room.currentRound = 1;
  
  // Reset scores
  room.players.forEach(player => {
    player.score = 0;
    room.scores[player.id] = 0;
  });
  
  // Notify players that game is starting
  io.to(roomId).emit('game-starting', {
    message: 'Game is starting...',
    countdown: 3,
  });
  
  // Start first round after countdown
  setTimeout(() => {
    startRound(roomId, io);
  }, 3000);
};

// Start a new round
const startRound = (roomId: string, io: Server) => {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  // Reset player guessing status
  room.players.forEach(player => {
    player.hasGuessedCorrectly = false;
  });
  
  // Select next drawer (round-robin)
  const drawerIndex = (room.currentRound - 1) % room.players.length;
  room.currentDrawer = room.players[drawerIndex].id;
  
  // Select 3 random words for the drawer to choose from
  room.wordOptions = getRandomWords(room.wordList, 3);
  room.gameState = GameState.SELECTING_WORD;
  
  // Notify all players about the new round
  io.to(roomId).emit('round-started', {
    round: room.currentRound,
    totalRounds: room.totalRounds,
    drawer: room.players[drawerIndex].username,
    drawerId: room.currentDrawer,
  });
  
  // Send word options to the drawer
  io.to(room.currentDrawer).emit('choose-word', {
    options: room.wordOptions,
  });
  
  // Set a timer for word selection (15 seconds)
  room.timer = setTimeout(() => {
    // If drawer doesn't select a word, choose one randomly
    if (room.gameState === GameState.SELECTING_WORD) {
      const randomIndex = Math.floor(Math.random() * room.wordOptions.length);
      const selectedWord = room.wordOptions[randomIndex];
      
      room.currentWord = selectedWord;
      room.gameState = GameState.DRAWING;
      room.roundStartTime = Date.now();
      
      // Send word to drawer
      io.to(room.currentDrawer).emit('current-word', { word: room.currentWord });
      
      // Send word length to other players
      io.to(roomId).emit('word-hint', { hint: '_ '.repeat(room.currentWord.length).trim() });
      
      // Notify all players that drawing has started
      io.to(roomId).emit('drawing-started');
      
      // Set timer for round
      clearTimeout(room.timer);
      room.timer = setTimeout(() => {
        endRound(roomId, io);
      }, ROUND_TIME);
    }
  }, 15000);
};

// End the current round
const endRound = (roomId: string, io: Server) => {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  room.gameState = GameState.ROUND_ENDED;
  
  // Reveal the word to all players
  io.to(roomId).emit('round-ended', {
    word: room.currentWord,
    scores: room.scores,
  });
  
  // Award points to the drawer based on how many players guessed correctly
  const drawer = room.players.find(p => p.id === room.currentDrawer);
  
  if (drawer) {
    const correctGuesses = room.players.filter(
      p => p.id !== room.currentDrawer && p.hasGuessedCorrectly
    ).length;
    
    const drawerPoints = correctGuesses * 25;
    drawer.score += drawerPoints;
    room.scores[drawer.id] += drawerPoints;
    
    // Update scores
    io.to(roomId).emit('update-scores', room.scores);
  }
  
  // Start next round or end game after intermission
  room.timer = setTimeout(() => {
    startNextRound(roomId, io);
  }, INTERMISSION_TIME);
};

// Start the next round or end the game
const startNextRound = (roomId: string, io: Server) => {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  room.currentRound++;
  
  // Check if game should end
  if (room.currentRound > room.totalRounds) {
    endGame(roomId, io);
  } else {
    startRound(roomId, io);
  }
};

// End the game
const endGame = (roomId: string, io: Server) => {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  room.gameState = GameState.ENDED;
  
  // Sort players by score
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  
  // Notify players about game end and final scores
  io.to(roomId).emit('game-ended', {
    winner: sortedPlayers[0],
    leaderboard: sortedPlayers,
  });
  
  // Save game results to Supabase
  try {
    const gameData = {
      room_id: roomId,
      players: room.players.map(p => ({
        id: p.userId,
        username: p.username,
        score: p.score,
      })),
      winner: sortedPlayers[0].userId,
      played_at: new Date().toISOString(),
    };
    
    supabase.from('game_history').insert([gameData]);
  } catch (error) {
    console.error('Error saving game history to Supabase:', error);
  }
  
  // Reset room to waiting state after 10 seconds
  setTimeout(() => {
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId)!;
      room.gameState = GameState.WAITING;
      room.currentRound = 0;
      room.currentDrawer = null;
      room.currentWord = '';
      room.wordOptions = [];
      room.chat = [];
      
      // Reset player scores
      room.players.forEach(player => {
        player.score = 0;
        player.hasGuessedCorrectly = false;
        room.scores[player.id] = 0;
      });
      
      // Notify players that room is reset
      io.to(roomId).emit('room-reset', {
        players: room.players,
        gameState: room.gameState,
      });
      
      // If we have at least 2 players, start a new game
      if (room.players.length >= 2) {
        startGame(roomId, io);
      }
    }
  }, 10000);
};

// Helper function to get random words
const getRandomWords = (wordList: string[], count: number): string[] => {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 