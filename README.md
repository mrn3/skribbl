# Skribbl Clone

A real-time multiplayer drawing and guessing game inspired by skribbl.io, built with Next.js, Socket.io, and TypeScript.

![Skribbl Clone](https://example.com/screenshot.png)

## Features

- Real-time drawing canvas with different brush sizes and colors
- Multiplayer game rooms with unique game IDs
- Chat functionality for guessing words
- Score tracking system
- Round-based gameplay with customizable settings
- Word selection from predefined categories
- Custom word lists support
- Mobile-responsive design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Real-time Communication**: Socket.io
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/skribbl-clone.git
cd skribbl-clone
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Play

1. **Create a Game**:
   - Click on "Create Game" on the homepage
   - Enter your nickname
   - Configure game settings (rounds, drawing time, custom words)
   - Share the generated game ID with friends

2. **Join a Game**:
   - Click on "Join Game" on the homepage
   - Enter your nickname
   - Enter the game ID shared by the host
   - Click "Join Game"

3. **Gameplay**:
   - Players take turns drawing a word
   - Other players guess the word in the chat
   - Points are awarded based on how quickly players guess correctly
   - The drawer gets points when others guess correctly
   - The player with the highest score at the end wins!

## Current Implementation Status

This is a prototype implementation. Some features are simulated for demonstration purposes:

- Socket.io server implementation is minimal and would need to be expanded in a production environment
- Word checking and scoring logic is currently mocked
- Game persistence is not implemented

## Future Improvements

- Complete Socket.io server implementation
- User authentication with persistent profiles
- Enhanced scoring system
- More drawing tools (fill tool, shapes, etc.)
- Custom game modes
- Spectator mode
- Public game lobby

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [skribbl.io](https://skribbl.io/)
- Built with [Next.js](https://nextjs.org/)
