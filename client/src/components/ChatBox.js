import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';

function ChatBox({ messages, sendMessage }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.type}`}
          >
            {msg.type === 'chat' ? (
              <><span className="username">{msg.username}:</span> {msg.content}</>
            ) : (
              <span className="system-message">{msg.content}</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your guess here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox; 