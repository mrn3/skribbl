import { create } from 'zustand';

export type Player = {
  id: string;
  username: string;
  score: number;
  isDrawing: boolean;
  isReady?: boolean;
};

export type GameState = 'lobby' | 'selecting' | 'drawing' | 'roundEnd' | 'gameEnd';

interface DrawingData {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  brushSize: number;
}

interface GameStore {
  // Game settings
  gameId: string | null;
  isHost: boolean;
  rounds: number;
  drawTime: number;
  currentRound: number;

  // Player info
  players: Player[];
  currentPlayer: Player | null;
  currentDrawer: string | null;

  // Game state
  gameState: GameState;
  timeLeft: number;
  currentWord: string | null;
  wordChoices: string[];
  drawingHistory: DrawingData[];
  messages: any[];

  // Actions
  setGameId: (gameId: string) => void;
  setIsHost: (isHost: boolean) => void;
  setRounds: (rounds: number) => void;
  setDrawTime: (drawTime: number) => void;
  setCurrentRound: (currentRound: number) => void;
  setPlayers: (players: Player[]) => void;
  setCurrentPlayer: (player: Player) => void;
  setCurrentDrawer: (playerId: string) => void;
  setGameState: (state: GameState) => void;
  setTimeLeft: (time: number) => void;
  setCurrentWord: (word: string | null) => void;
  setWordChoices: (words: string[]) => void;
  addDrawingData: (data: DrawingData) => void;
  clearDrawingHistory: () => void;
  addMessage: (message: any) => void;
  
  // Game actions
  startGame: () => void;
  selectWord: (word: string) => void;
  endRound: () => void;
  endGame: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Game settings
  gameId: null,
  isHost: false,
  rounds: 3,
  drawTime: 60,
  currentRound: 0,

  // Player info
  players: [],
  currentPlayer: null,
  currentDrawer: null,

  // Game state
  gameState: 'lobby',
  timeLeft: 0,
  currentWord: null,
  wordChoices: [],
  drawingHistory: [],
  messages: [],

  // Actions
  setGameId: (gameId) => set({ gameId }),
  setIsHost: (isHost) => set({ isHost }),
  setRounds: (rounds) => set({ rounds }),
  setDrawTime: (drawTime) => set({ drawTime }),
  setCurrentRound: (currentRound) => set({ currentRound }),
  setPlayers: (players) => set({ players }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setCurrentDrawer: (playerId) => set({ currentDrawer: playerId }),
  setGameState: (state) => set({ gameState: state }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  setCurrentWord: (word) => set({ currentWord: word }),
  setWordChoices: (words) => set({ wordChoices: words }),
  addDrawingData: (data) => set(state => ({ 
    drawingHistory: [...state.drawingHistory, data] 
  })),
  clearDrawingHistory: () => set({ drawingHistory: [] }),
  addMessage: (message) => set(state => ({ 
    messages: [...state.messages, message] 
  })),
  
  // Game actions
  startGame: () => {
    const { isHost } = get();
    if (isHost) {
      set({
        gameState: 'selecting',
        currentRound: 1,
        // In a real app, we would emit a socket event to start the game
      });
    }
  },
  
  selectWord: (word) => {
    set({
      currentWord: word,
      gameState: 'drawing',
      timeLeft: get().drawTime,
      // In a real app, we would emit a socket event with the selected word
    });
  },
  
  endRound: () => {
    const { currentRound, rounds } = get();
    set({ gameState: 'roundEnd' });
    
    // In a real app, this would be handled by the server
    setTimeout(() => {
      if (currentRound < rounds) {
        set({
          currentRound: currentRound + 1,
          gameState: 'selecting',
          currentWord: null,
        });
      } else {
        set({ gameState: 'gameEnd' });
      }
    }, 5000);
  },
  
  endGame: () => {
    set({ gameState: 'gameEnd' });
    // In a real app, we would emit a socket event to end the game
  },
  
  resetGame: () => {
    set({
      gameState: 'lobby',
      currentRound: 0,
      currentWord: null,
      wordChoices: [],
      drawingHistory: [],
      timeLeft: 0,
      // In a real app, we would reset more state
    });
  },
})); 