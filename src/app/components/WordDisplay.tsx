"use client";

interface WordDisplayProps {
  word: string;
  isRevealed: boolean;
}

export default function WordDisplay({ word, isRevealed }: WordDisplayProps) {
  // If the word is revealed, show it
  if (isRevealed) {
    return (
      <div className="mb-4 text-xl font-bold text-indigo-600 dark:text-indigo-400">
        Draw: {word}
      </div>
    );
  }
  
  // Otherwise, show the word with blanks
  const hiddenWord = word
    .split('')
    .map(char => (char === ' ' ? ' ' : '_'))
    .join(' ');
  
  // Calculate the hint (number of letters)
  const letterCount = word.replace(/\s/g, '').length;
  
  return (
    <div className="mb-4 text-center">
      <div className="text-xl font-mono tracking-wider">
        {hiddenWord}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {letterCount} letters
      </div>
    </div>
  );
} 