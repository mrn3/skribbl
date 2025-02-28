"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateGame() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    rounds: 3,
    drawTime: 60,
    customWords: "",
    useCustomWordsOnly: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      alert("Please enter a username");
      return;
    }
    
    // In a real implementation, we would create a game on the server here
    // and get back a game ID to redirect to.
    // For now, we'll just redirect to a placeholder URL
    const gameId = Math.random().toString(36).substring(2, 10);
    
    router.push(`/game/${gameId}?host=true`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <main className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">
          Create a New Game
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Nickname
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              maxLength={15}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your nickname"
            />
          </div>

          <div>
            <label htmlFor="rounds" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Number of Rounds
            </label>
            <select
              id="rounds"
              name="rounds"
              value={formData.rounds}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {[2, 3, 4, 5, 6, 8, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="drawTime" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Drawing Time (seconds)
            </label>
            <select
              id="drawTime"
              name="drawTime"
              value={formData.drawTime}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              {[30, 45, 60, 75, 90, 120].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="customWords" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Words (optional, separate with commas)
            </label>
            <textarea
              id="customWords"
              name="customWords"
              value={formData.customWords}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="apple, house, cat, ..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="useCustomWordsOnly"
              name="useCustomWordsOnly"
              checked={formData.useCustomWordsOnly}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="useCustomWordsOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Use only custom words
            </label>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/"
              className="flex-1 px-4 py-2 text-center text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create Game
            </button>
          </div>
        </form>
      </main>
    </div>
  );
} 