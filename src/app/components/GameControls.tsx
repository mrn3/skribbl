"use client";

export default function GameControls() {
  // In a real app, these functions would emit Socket.io events
  const handleFillScreen = () => {
    // Implementation would clear canvas and fill with a color
    console.log('Fill screen clicked');
  };

  const handleUndo = () => {
    // Implementation would undo last drawing action
    console.log('Undo clicked');
  };

  const handleHint = () => {
    // Implementation would provide a hint to other players
    console.log('Hint clicked');
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 flex space-x-4">
        <button
          onClick={handleUndo}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center"
          title="Undo last action"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 14 4 9l5-5"/>
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
          </svg>
          <span className="ml-2">Undo</span>
        </button>
        
        <button
          onClick={handleFillScreen}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center"
          title="Fill canvas with color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 21-4.9-4.9a.7.7 0 0 1 0-1l9.5-9.5a1 1 0 0 1 1.4 0l4.3 4.3a1 1 0 0 1 0 1.4L8 21"/>
            <path d="M19 15h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"/>
          </svg>
          <span className="ml-2">Fill</span>
        </button>
        
        <button
          onClick={handleHint}
          className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors flex items-center"
          title="Give hint to other players"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3"/>
            <path d="m9 18 3-3-3-3"/>
            <path d="M11 15h-2a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1h4"/>
          </svg>
          <span className="ml-2">Hint</span>
        </button>
      </div>
    </div>
  );
} 