'use client';

enum GameState {
  WAITING = 'waiting',
  STARTING = 'starting',
  SELECTING_WORD = 'selecting_word',
  DRAWING = 'drawing',
  ROUND_ENDED = 'round_ended',
  ENDED = 'ended',
}

interface GameInfoProps {
  gameState: GameState;
  round: number;
  totalRounds: number;
  timeLeft: number;
  currentWord: string;
  wordHint: string;
  isDrawing: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({
  gameState,
  round,
  totalRounds,
  timeLeft,
  currentWord,
  wordHint,
  isDrawing,
}) => {
  // Get status message based on game state
  const getStatusMessage = () => {
    switch (gameState) {
      case GameState.WAITING:
        return 'Waiting for players...';
      case GameState.STARTING:
        return 'Game is starting...';
      case GameState.SELECTING_WORD:
        return isDrawing ? 'Choose a word to draw' : 'Drawer is choosing a word...';
      case GameState.DRAWING:
        return isDrawing ? 'You are drawing!' : 'Guess the word!';
      case GameState.ROUND_ENDED:
        return `Round ended! The word was: ${currentWord}`;
      case GameState.ENDED:
        return 'Game over!';
      default:
        return '';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap justify-between items-center">
        {/* Game status */}
        <div className="mb-2 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {getStatusMessage()}
          </h2>
          
          {/* Word hint for guessers */}
          {gameState === GameState.DRAWING && !isDrawing && wordHint && (
            <div className="mt-2 text-lg font-mono tracking-wider">
              {wordHint.split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block w-6 text-center border-b-2 border-gray-400 mx-1"
                >
                  {char !== '_' ? char : ''}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Round info and timer */}
        <div className="flex items-center space-x-4">
          {round > 0 && (
            <div className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                Round {round}/{totalRounds}
              </span>
            </div>
          )}
          
          {timeLeft > 0 && gameState === GameState.DRAWING && (
            <div className={`px-3 py-1 rounded-full font-bold ${
              timeLeft <= 10
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {timeLeft}s
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameInfo; 