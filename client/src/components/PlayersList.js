import React from 'react';
import './PlayersList.css';

function PlayersList({ players, currentDrawer }) {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="players-list">
      <h3>Players</h3>
      <ul>
        {sortedPlayers.map((player) => (
          <li 
            key={player.id} 
            className={player.id === currentDrawer ? 'current-drawer' : ''}
          >
            <span className="player-name">{player.username}</span>
            <span className="player-score">{player.score}</span>
            {player.id === currentDrawer && <span className="drawing-indicator">✏️</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersList; 