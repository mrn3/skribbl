// Game state enum
export enum GameState {
  WAITING = 'waiting',
  STARTING = 'starting',
  SELECTING_WORD = 'selecting_word',
  DRAWING = 'drawing',
  ROUND_ENDED = 'round_ended',
  ENDED = 'ended',
}

// Player interface
export interface Player {
  id: string;
  userId: string;
  username: string;
  score: number;
  hasGuessedCorrectly: boolean;
}

// Chat message interface
export interface ChatMessage {
  sender: string;
  message: string;
  isSystem: boolean;
  isCorrectGuess: boolean;
}

// Room interface
export interface Room {
  id: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  currentDrawer: string | null;
  currentWord: string;
  wordOptions: string[];
  gameState: GameState;
  timer: NodeJS.Timeout | null;
  scores: Record<string, number>;
  chat: ChatMessage[];
  wordList: string[];
  roundStartTime?: number;
} 