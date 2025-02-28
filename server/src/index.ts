import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { setupGameHandlers } from './controllers/gameController';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.');
}

// Check if we're using placeholder values for development
const isDevelopmentWithPlaceholders = 
  supabaseUrl.includes('your-project') || 
  supabaseKey.includes('placeholder');

// For development with placeholder values, provide a mock client
export const supabase = isDevelopmentWithPlaceholders
  ? {
      // Mock Supabase methods needed for the game
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
            data: []
          })
        }),
        insert: async () => ({ data: { id: 'mock-id' }, error: null }),
        update: async () => ({ data: null, error: null }),
      })
    }
  : createClient(supabaseUrl, supabaseKey);

// Basic route
app.get('/', (req, res) => {
  res.send('Skribbl.io Clone API is running');
});

// Set up Socket.io game handlers
setupGameHandlers(io, supabase);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (isDevelopmentWithPlaceholders) {
    console.log('Running in development mode with mock Supabase client');
  }
}); 