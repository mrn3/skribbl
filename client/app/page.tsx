'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 8);
    router.push(`/game/${newRoomId}?username=${encodeURIComponent(username)}`);
  };

  const handleJoinRoom = () => {
    if (!username) {
      setError('Please enter a username');
      return;
    }

    if (!roomId) {
      setError('Please enter a room ID');
      return;
    }

    router.push(`/game/${roomId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="z-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-600 dark:text-blue-400">
          Skribbl.io Clone
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your name"
            />
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Create New Game
            </button>
            
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Room Code
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter room code"
              />
            </div>
            
            <button
              onClick={handleJoinRoom}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            >
              Join Game
            </button>
          </div>
          
          {error && (
            <p className="mt-4 text-red-500 text-center">{error}</p>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/how-to-play" className="text-blue-600 dark:text-blue-400 hover:underline">
            How to Play
          </Link>
        </div>
      </div>
    </main>
  );
} 