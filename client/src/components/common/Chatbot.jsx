import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaPaperPlane, FaTimes, FaMinus } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am your Pet-Paal assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history for the API (convert to Gemini format if needed, but simple list is fine for our controller)
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const { data } = await axios.post('/api/chatbot/chat', {
        message: input,
        history: history
      });

      const botMessage = { role: 'model', text: data.text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot Error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pastel-purple to-pastel-pink text-white p-4 rounded-full shadow-2xl hover:shadow-pastel-purple/40 transition-all transform hover:scale-110 animate-bounce-slow"
        >
          <FaRobot size={28} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-white/60 ring-1 ring-white/50" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-pastel-purple to-pastel-pink p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-3 text-white">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <FaRobot className="animate-pulse" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>Pet-Paal AI</span>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 p-1 rounded-full hover:bg-white/20">
                <FaMinus size={12} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-pastel-bg bg-opacity-30 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                      ? 'bg-gradient-to-r from-pastel-purple to-pastel-pink text-white rounded-br-none'
                      : 'bg-white/80 backdrop-blur-md text-gray-800 border border-white/50 rounded-bl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-md text-gray-500 p-3 rounded-2xl rounded-bl-none border border-white/50 text-sm shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pastel-purple rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pastel-pink rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-pastel-purple rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-white/40 backdrop-blur-md border-t border-white/40 flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 border border-pastel-pink/30 bg-white/60 backdrop-blur-sm rounded-full px-5 py-3 text-sm focus:outline-none focus:border-pastel-purple focus:ring-2 focus:ring-pastel-purple/20 placeholder-gray-400 text-gray-700 shadow-inner transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-pastel-purple to-pastel-pink text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
