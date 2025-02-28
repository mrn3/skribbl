const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/scribbl-clone')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define MongoDB schemas and models
const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [{ 
    id: String, 
    name: String, 
    score: { type: Number, default: 0 } 
  }],
  currentWord: { type: String, default: '' },
  currentDrawer: { type: String, default: '' },
  gameState: { type: String, default: 'waiting' }
});

const Room = mongoose.model('Room', RoomSchema);

// Game state
const rooms = {};

// Word list (you can expand this)
const words = [
  'apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 
  'house', 'island', 'jacket', 'kite', 'lemon', 'mountain', 'notebook',
  'ocean', 'pizza', 'queen', 'robot', 'sun', 'tree', 'umbrella', 'violin',
  'watermelon', 'xylophone', 'yacht', 'zebra'
];

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-room', async ({ roomId, playerName }) => {
    // Find or create room in MongoDB
    try {
      let room = await Room.findOne({ roomId });
      if (!room) {
        room = new Room({ 
          roomId,
          players: [{ id: socket.id, name: playerName, score: 0 }]
        });
        await room.save();
      } else {
        // Add player to existing room
        room.players.push({ id: socket.id, name: playerName, score: 0 });
        await room.save();
      }
      
      // Join socket room
      socket.join(roomId);
      
      // Emit updated player list
      io.to(roomId).emit('players-update', room.players);
    } catch (err) {
      console.error('Error joining room:', err);
    }
  });

  // Start game
  socket.on('start-game', () => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    
    const room = rooms[roomId];
    room.gameStarted = true;
    room.round = 1;
    
    // Start first round
    startNewRound(roomId);
  });

  // Drawing data
  socket.on('draw', (data) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    
    // Only allow current drawer to send drawing data
    if (rooms[roomId].currentDrawer === socket.id) {
      socket.to(roomId).emit('draw-data', data);
    }
  });

  // Chat message / guess
  socket.on('message', ({ message }) => {
    const roomId = socket.roomId;
    if (!roomId || !rooms[roomId]) return;
    
    const room = rooms[roomId];
    const isCorrectGuess = room.currentWord && 
                          message.toLowerCase() === room.currentWord.toLowerCase() && 
                          room.currentDrawer !== socket.id;
    
    if (isCorrectGuess) {
      // Calculate score based on time left
      const score = Math.ceil(room.timeLeft / 2);
      room.scores[socket.id] += score;
      
      // Update player scores in the players array
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players[playerIndex].score += score;
      }
      
      // Notify room of correct guess
      io.to(roomId).emit('correct-guess', {
        username: socket.username,
        scores: room.scores,
        players: room.players
      });
      
      // Check if all players have guessed correctly
      const nonDrawingPlayers = room.players.filter(p => p.id !== room.currentDrawer);
      const allGuessedCorrectly = nonDrawingPlayers.every(p => {
        return room.scores[p.id] > 0; // This is a simplification
      });
      
      if (allGuessedCorrectly) {
        clearTimeout(room.timer);
        setTimeout(() => nextTurn(roomId), 3000);
      }
    } else {
      // Regular message
      io.to(roomId).emit('chat-message', {
        username: socket.username,
        message,
        id: socket.id
      });
    }
  });

  // Disconnect
  socket.on('disconnect', async () => {
    // Find rooms where this player exists
    try {
      const rooms = await Room.find({ 'players.id': socket.id });
      
      for (const room of rooms) {
        // Remove player from room
        room.players = room.players.filter(player => player.id !== socket.id);
        
        if (room.players.length === 0) {
          // Delete empty room
          await Room.deleteOne({ _id: room._id });
        } else {
          // Update room with player removed
          await room.save();
          io.to(room.roomId).emit('players-update', room.players);
        }
      }
    } catch (err) {
      console.error('Error handling disconnect:', err);
    }
    
    console.log('Client disconnected');
  });
});

// Helper functions
function startNewRound(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  room.round++;
  
  if (room.round > room.maxRounds) {
    // Game over
    io.to(roomId).emit('game-over', {
      players: room.players,
      scores: room.scores
    });
    room.gameStarted = false;
    return;
  }
  
  io.to(roomId).emit('new-round', {
    round: room.round,
    maxRounds: room.maxRounds
  });
  
  // Reset for new round
  room.currentDrawer = null;
  nextTurn(roomId);
}

function nextTurn(roomId) {
  const room = rooms[roomId];
  if (!room || !room.gameStarted) return;
  
  // Clear previous timer
  clearTimeout(room.timer);
  
  // Select next drawer
  let nextDrawerIndex = 0;
  if (room.currentDrawer) {
    const currentIndex = room.players.findIndex(p => p.id === room.currentDrawer);
    nextDrawerIndex = (currentIndex + 1) % room.players.length;
  }
  
  room.currentDrawer = room.players[nextDrawerIndex].id;
  
  // Select random word
  room.currentWord = words[Math.floor(Math.random() * words.length)];
  
  // Reset timer
  room.timeLeft = 60;
  
  // Notify room of new turn
  io.to(roomId).emit('new-turn', {
    drawer: room.players[nextDrawerIndex].username,
    drawerId: room.currentDrawer,
    timeLeft: room.timeLeft
  });
  
  // Send word to drawer
  io.to(room.currentDrawer).emit('your-turn', {
    word: room.currentWord
  });
  
  // Start timer
  startTimer(roomId);
}

function startTimer(roomId) {
  const room = rooms[roomId];
  if (!room) return;
  
  room.timer = setInterval(() => {
    room.timeLeft--;
    
    io.to(roomId).emit('time-update', {
      timeLeft: room.timeLeft
    });
    
    if (room.timeLeft <= 0) {
      clearInterval(room.timer);
      io.to(roomId).emit('time-up', {
        word: room.currentWord
      });
      
      // Wait a bit before next turn
      setTimeout(() => nextTurn(roomId), 3000);
    }
  }, 1000);
}

// Try different ports if the default one is in use
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error(e);
  }
}); 