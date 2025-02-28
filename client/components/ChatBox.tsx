'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  sender: string;
  message: string;
  isSystem: boolean;
  isCorrectGuess: boolean;
}

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  currentWord: string;
  isDrawing: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  currentWord,
  isDrawing,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="chat-header">
        Chat
      </div>
      
      {/* Messages container */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No messages yet. Start chatting!
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg ${
                  msg.isSystem
                    ? 'bg-gray-200 dark:bg-gray-600 text-center'
                    : 'bg-blue-100 dark:bg-blue-900'
                } ${
                  msg.isCorrectGuess ? 'bg-green-100 dark:bg-green-900 font-bold' : ''
                }`}
              >
                {!msg.isSystem && (
                  <span className="font-bold text-blue-600 dark:text-blue-300">
                    {msg.sender}:
                  </span>
                )}{' '}
                <span className={msg.isCorrectGuess ? 'text-green-600 dark:text-green-300' : ''}>
                  {msg.message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isDrawing ? "You are drawing..." : "Type your guess here..."}
          disabled={isDrawing}
          className="flex-1 px-3 py-2 rounded-l-md border-0 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={isDrawing}
          className={`px-4 py-2 rounded-r-md font-bold ${
            isDrawing
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </form>
      
      {/* Current word display for drawer */}
      {isDrawing && currentWord && (
        <div className="p-2 bg-green-600 text-white text-center font-bold">
          Your word: {currentWord}
        </div>
      )}
    </div>
  );
};

export default ChatBox; 