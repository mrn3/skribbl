'use client';

import { useState, useEffect } from 'react';

interface WordSelectionProps {
  words: string[];
  onSelectWord: (word: string) => void;
}

const WordSelection: React.FC<WordSelectionProps> = ({
  words,
  onSelectWord,
}) => {
  const [timeLeft, setTimeLeft] = useState(15);
  
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Choose a word to draw
        </h2>
        
        <div className="text-center mb-6">
          <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Time left: <span className="text-red-500 font-bold">{timeLeft}</span> seconds
          </span>
        </div>
        
        <div className="space-y-3">
          {words.map((word) => (
            <button
              key={word}
              onClick={() => onSelectWord(word)}
              className="word-option"
            >
              {word}
            </button>
          ))}
        </div>
        
        <p className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          If you don't choose, a random word will be selected for you.
        </p>
      </div>
    </div>
  );
};

export default WordSelection; 