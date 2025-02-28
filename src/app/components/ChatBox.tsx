"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: string;
  text: string;
  isSystem: boolean;
  isCorrectGuess: boolean;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'System', text: 'Game started! Have fun!', isSystem: true, isCorrectGuess: false },
    { id: '2', sender: 'Player 2', text: 'Hello everyone!', isSystem: false, isCorrectGuess: false },
    { id: '3', sender: 'Player 3', text: 'Good luck!', isSystem: false, isCorrectGuess: false },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // In a real implementation, we would send the message via socket.io
    // and receive it back from the server after processing
    
    // Mock guessing logic (in a real app this would be on the server)
    const isCorrectGuess = Math.random() < 0.1; // 10% chance of correct guess for demo
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'You', // In a real app, this would be the user's name
      text: newMessage,
      isSystem: false,
      isCorrectGuess,
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // If this was a correct guess, add a system message
    if (isCorrectGuess) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now().toString(), 
            sender: 'System', 
            text: 'You guessed the word correctly!', 
            isSystem: true,
            isCorrectGuess: false,
          }
        ]);
      }, 500);
    }
    
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
      <div className="p-4 bg-indigo-600 text-white">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`
              ${message.isSystem ? 'bg-gray-100 dark:bg-gray-700 italic text-center py-1 px-3 rounded-full mx-auto max-w-xs' : 'px-3 py-2 rounded-lg max-w-xs'}
              ${message.isCorrectGuess ? 'bg-green-100 dark:bg-green-900 font-bold' : message.isSystem ? '' : 'bg-indigo-100 dark:bg-indigo-900'}
              ${message.sender === 'You' && !message.isSystem ? 'ml-auto' : message.isSystem ? 'mx-auto' : ''}
            `}
          >
            {!message.isSystem && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {message.sender}
              </p>
            )}
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your guess here..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 