import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <main className="flex flex-col items-center max-w-3xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Skribbl Clone
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
          Draw and guess words with friends in this fun multiplayer game!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link 
            href="/game/create" 
            className="px-8 py-3 text-lg font-medium rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Create Game
          </Link>
          
          <Link 
            href="/game/join" 
            className="px-8 py-3 text-lg font-medium rounded-full bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Join Game
          </Link>
        </div>
        
        <div className="mt-20 flex flex-wrap gap-6 justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xs">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Draw</h3>
            <p className="text-gray-600 dark:text-gray-300">Use your artistic skills to draw the given word and help others guess it.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xs">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Guess</h3>
            <p className="text-gray-600 dark:text-gray-300">Try to guess what others are drawing as quickly as possible to score points.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xs">
            <h3 className="text-xl font-semibold mb-3 text-indigo-600 dark:text-indigo-400">Win</h3>
            <p className="text-gray-600 dark:text-gray-300">Earn points for guessing quickly and for others guessing your drawings.</p>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        <p>A skribbl.io clone built with Next.js and Socket.io</p>
      </footer>
    </div>
  );
}
