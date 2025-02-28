# Skribbl Clone

A real-time multiplayer drawing and guessing game inspired by Skribbl.io. Players take turns drawing while others try to guess the word. Features include real-time drawing, chat functionality, and a points system.

## Getting Started

These instructions will help you get a copy of the game running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone the repository
```bash
git clone [your-repository-url]
```

2. Install dependencies for the client
```bash
cd client
npm install
```

3. Start the client development server
```bash
npm start
```
The game will run on http://localhost:3001

## How to Play

1. Create a room or join an existing one
2. Wait for other players to join
3. When it's your turn:
   - Choose a word from three options
   - Draw the word using the provided tools
   - Other players will try to guess your word
4. When others are drawing:
   - Watch the drawing in real-time
   - Type your guesses in the chat
   - Score points by guessing correctly

## Features

- Real-time multiplayer drawing
- Chat system with word guessing
- Points system
- Multiple drawing tools:
  - Different colors
  - Adjustable brush sizes
  - Clear canvas option
- Room-based gameplay
- Player scoreboard

## Project Structure 