"use client";

interface TimerProps {
  timeLeft: number;
  gameState: string;
}

export default function Timer({ timeLeft, gameState }: TimerProps) {
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate color based on time left
  const getTimerColor = () => {
    if (timeLeft <= 10) return 'text-red-500';
    if (timeLeft <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  // If we're in the lobby or game has ended, don't show timer
  if (gameState === 'lobby' || gameState === 'gameEnd') {
    return null;
  }

  return (
    <div className="flex items-center">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="mr-2"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      <span className={`font-mono text-lg font-bold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
} 