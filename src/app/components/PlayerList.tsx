"use client";

interface Player {
  id: string;
  username: string;
  score: number;
  isDrawing: boolean;
}

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold">Players</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedPlayers.map((player) => (
            <li key={player.id} className="px-4 py-3 flex items-center">
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  {player.isDrawing && (
                    <div className="mr-2 bg-green-500 rounded-full p-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m7 12 3 3 7-7"></path>
                      </svg>
                    </div>
                  )}
                  <p className={`text-sm font-medium truncate ${player.isDrawing ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'}`}>
                    {player.username}
                  </p>
                </div>
                {player.isDrawing && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currently drawing
                  </p>
                )}
              </div>
              <div className="ml-3 flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {player.score} pts
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 