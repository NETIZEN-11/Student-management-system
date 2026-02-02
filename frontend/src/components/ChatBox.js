import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import '../assets/styles/chatbox.css';

const ChatBox = ({ receiverId, receiverName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socketService.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socketService.on('user_typing', () => {
      setIsTyping(true);
    });

    socketService.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      socketService.off('receive_message');
      socketService.off('user_typing');
      socketService.off('user_stop_typing');
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socketService.sendMessage(receiverId, newMessage);
      setMessages((prev) => [
        ...prev,
        {
          senderId: 'me',
          content: newMessage,
          timestamp: new Date(),
        },
      ]);
      setNewMessage('');
    }
  };

  const handleTyping = () => {
    socketService.notifyTyping(receiverId);
  };

  const handleStopTyping = () => {
    socketService.notifyStopTyping(receiverId);
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>{receiverName}</h3>
      </div>

      <div className="chatbox-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === 'me' ? 'sent' : 'received'}`}>
            <p>{msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Typing...</div>}
      </div>

      <form className="chatbox-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onFocus={handleTyping}
          onBlur={handleStopTyping}
          placeholder="Type a message..."
        />
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
