# Skribbl.io Clone - Server

This is the server component of the Skribbl.io clone. It handles game logic, real-time communication, and integration with Supabase.

## Technologies Used

- Node.js
- Express
- Socket.io for real-time communication
- TypeScript
- Supabase for database and authentication

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Copy the `.env.example` file to `.env` and fill in your Supabase credentials:
   ```
   cp .env.example .env
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Supabase Setup

This server is designed to work with Supabase. You'll need to set up the following tables in your Supabase project:

### 1. `rooms` Table

```sql
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  player_count INTEGER NOT NULL DEFAULT 0,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `game_history` Table

```sql
CREATE TABLE game_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id TEXT NOT NULL,
  players JSONB NOT NULL,
  winner TEXT NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `words` Table (Optional)

```sql
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL UNIQUE,
  category TEXT,
  difficulty INTEGER DEFAULT 1
);
```

## Deployment

This server can be deployed to any Node.js hosting service. For Supabase integration, you'll need to:

1. Set up the required tables in your Supabase project
2. Configure environment variables on your hosting platform
3. Deploy the server code

## Environment Variables

- `PORT`: The port the server will run on (default: 3001)
- `CLIENT_URL`: The URL of the client application (for CORS)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key 