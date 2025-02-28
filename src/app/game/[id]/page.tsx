"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas";
import ChatBox from "@/app/components/ChatBox";
import PlayerList from "@/app/components/PlayerList";
import GameControls from "@/app/components/GameControls";
import WordSelection from "@/app/components/WordSelection";
import WordDisplay from "@/app/components/WordDisplay";
import Timer from "@/app/components/Timer";

// Mock data for initial development
const MOCK_PLAYERS = [
  { id: '1', username: 'Player 1', score: 400, isDrawing: true },
  { id: '2', username: 'Player 2', score: 250, isDrawing: false },
  { id: '3', username: 'Player 3', score: 100, isDrawing: false },
];

type GameState = 'lobby' | 'selecting' | 'drawing' | 'roundEnd' | 'gameEnd';

export default function GameRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;
  const isHost = searchParams.get('host') === 'true';
  
  const [gameState, setGameState] = useState<GameState>('lobby');
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [currentDrawer, setCurrentDrawer] = useState<string | null>(null);
  const [isUserDrawing, setIsUserDrawing] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [wordChoices, setWordChoices] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  
  // This would be connected to Socket.io in a real implementation
  useEffect(() => {
    // Mock game start after 5 seconds in the lobby
    if (isHost) {
      const timer = setTimeout(() => {
        startGame();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isHost]);
  
  const startGame = () => {
    setGameState('selecting');
    setWordChoices(['apple', 'house', 'cat']);
    setCurrentDrawer(players[0].id);
    setIsUserDrawing(true); // For demo purposes, user is always drawing first
    setRoundNumber(1);
  };
  
  const selectWord = (word: string) => {
    setCurrentWord(word);
    setGameState('drawing');
    setTimeLeft(60);
    
    // Mock round end after time is up
    const timer = setTimeout(() => {
      endRound();
    }, 60000);
    
    return () => clearTimeout(timer);
  };
  
  const endRound = () => {
    setGameState('roundEnd');
    
    // Mock next round or game end
    setTimeout(() => {
      if (roundNumber < totalRounds) {
        setRoundNumber(prev => prev + 1);
        setGameState('selecting');
        setWordChoices(['elephant', 'mountain', 'sunset']);
      } else {
        setGameState('gameEnd');
      }
    }, 5000);
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Game ID: {gameId}</h1>
          <div className="flex items-center gap-4">
            <Timer timeLeft={timeLeft} gameState={gameState} />
            <div>Round: {roundNumber}/{totalRounds}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 bg-gray-50 dark:bg-gray-800 overflow-auto">
          <PlayerList players={players} />
        </div>
        
        <div className="flex-1 flex flex-col">
          {gameState === 'selecting' && isUserDrawing && (
            <WordSelection words={wordChoices} onSelect={selectWord} />
          )}
          
          {gameState === 'drawing' && (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <WordDisplay 
                word={currentWord || ''} 
                isRevealed={isUserDrawing} 
              />
              <div className="flex-1 w-full flex items-center justify-center">
                <DrawingCanvas 
                  isDrawing={isUserDrawing} 
                  gameState={gameState} 
                />
              </div>
              {isUserDrawing && <GameControls />}
            </div>
          )}
          
          {gameState === 'lobby' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Waiting for players to join...</h2>
                <p className="text-lg">Share this game ID with your friends: <span className="font-bold">{gameId}</span></p>
                {isHost && (
                  <button
                    onClick={startGame}
                    className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                  >
                    Start Game
                  </button>
                )}
              </div>
            </div>
          )}
          
          {gameState === 'roundEnd' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Round ended!</h2>
                <p className="text-lg">The word was: <span className="font-bold">{currentWord}</span></p>
                <div className="mt-4">
                  {/* Show scores and who guessed correctly */}
                  <p>Waiting for next round...</p>
                </div>
              </div>
            </div>
          )}
          
          {gameState === 'gameEnd' && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                <div className="mb-6">
                  <h3 className="text-xl mb-2">Final Scores:</h3>
                  {players.sort((a, b) => b.score - a.score).map(player => (
                    <div key={player.id} className="text-lg">
                      {player.username}: {player.score} points
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-1/4 bg-gray-50 dark:bg-gray-800 overflow-hidden flex flex-col">
          <ChatBox />
        </div>
      </div>
    </div>
  );
} 