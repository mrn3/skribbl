"use client";

interface WordSelectionProps {
  words: string[];
  onSelect: (word: string) => void;
}

export default function WordSelection({ words, onSelect }: WordSelectionProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Choose a word to draw
        </h2>
        
        <div className="grid gap-4 grid-cols-1">
          {words.map((word, index) => (
            <button
              key={index}
              onClick={() => onSelect(word)}
              className={`
                px-6 py-4 rounded-lg text-center text-lg font-medium transition-colors
                ${index === 0 ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800' : ''}
                ${index === 1 ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:hover:bg-yellow-800' : ''}
                ${index === 2 ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800' : ''}
                ${index > 2 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800' : ''}
              `}
            >
              {word}
            </button>
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>You have 10 seconds to choose, or a random word will be selected.</p>
        </div>
      </div>
    </div>
  );
} 