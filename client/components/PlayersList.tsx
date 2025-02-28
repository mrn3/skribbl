'use client';

interface Player {
  id: string;
  username: string;
  score: number;
}

interface PlayersListProps {
  players: Player[];
  scores: Record<string, number>;
  currentDrawer: string | null;
}

const PlayersList: React.FC<PlayersListProps> = ({
  players,
  scores,
  currentDrawer,
}) => {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => {
    const scoreA = scores[a.id] || 0;
    const scoreB = scores[b.id] || 0;
    return scoreB - scoreA;
  });
  
  return (
    <div>
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Players</h2>
      
      {sortedPlayers.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">
          No players yet
        </div>
      ) : (
        <ul className="space-y-2">
          {sortedPlayers.map((player) => (
            <li
              key={player.id}
              className={`player-item ${
                player.id === currentDrawer
                  ? 'player-item-active'
                  : 'player-item-inactive'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {player.id === currentDrawer && (
                    <span className="mr-2 text-blue-600 dark:text-blue-400">
                      ✏️
                    </span>
                  )}
                  <span className="font-medium">{player.username}</span>
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {scores[player.id] || 0}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayersList; 