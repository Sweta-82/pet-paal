import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const ENDPOINT = '/';
var socket;

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentPet, setCurrentPet] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', userInfo);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('message_received', (newMessageReceived) => {
      // Check if message belongs to current conversation (User + Pet)
      const isSameUser = currentChat && newMessageReceived.sender === currentChat._id;
      const isSamePet = (currentPet && newMessageReceived.pet === currentPet._id) || (!currentPet && !newMessageReceived.pet);

      if (isSameUser && isSamePet) {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
      fetchConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo, currentChat, currentPet]); // Add deps to ensure listener allows updates correctly

  // Fetch Conversations
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('/api/chat/conversations', { withCredentials: true });
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle initial chat selection
  useEffect(() => {
    if (location.state && location.state.userId) {
      // If we have a pet in state, we prioritize valid existing conversation about that pet
      const existingConv = conversations.find(c =>
        c.user._id === location.state.userId &&
        ((c.pet && location.state.petId && c.pet._id === location.state.petId) || (!c.pet && !location.state.petId))
      );

      if (existingConv) {
        setCurrentChat(existingConv.user);
        setCurrentPet(existingConv.pet);
      } else {
        // Start new conv
        if (location.state.user) setCurrentChat(location.state.user);
        if (location.state.pet) setCurrentPet(location.state.pet);
      }
    }
  }, [location.state, conversations]);

  // Fetch Messages
  useEffect(() => {
    if (!currentChat) return;

    const fetchMessages = async () => {
      try {
        let url = `/api/chat/${currentChat._id}`;
        if (currentPet) url += `?petId=${currentPet._id}`;

        const { data } = await axios.get(url, { withCredentials: true });
        setMessages(data);
        socket.emit('join_chat', userInfo._id);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentChat, currentPet, userInfo]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [sending, setSending] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    setSending(true);

    const messageData = {
      sender: userInfo,
      receiver: currentChat,
      pet: currentPet,
      content: newMessage,
      chatId: [userInfo._id, currentChat._id].sort().join('_') + (currentPet ? '_' + currentPet._id : ''),
    };

    try {
      socket.emit('new_message', messageData);
      setMessages((prev) => [...prev, { ...messageData, sender: userInfo._id, createdAt: new Date().toISOString() }]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-pastel-bg bg-opacity-30 pt-16">
      {/* Sidebar */}
      <div className="w-1/3 bg-white/60 backdrop-blur-xl border-r border-white/40 overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-pastel-pink/20 bg-pastel-purple/5 sticky top-0 z-10 backdrop-blur-md">
          <h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: '"BBH Bartle Static", sans-serif' }}>Messages</h2>
        </div>
        <ul>
          {conversations.map((conv) => {
            const isSelected = currentChat?._id === conv.user._id && ((currentPet && conv.pet && currentPet._id === conv.pet._id) || (!currentPet && !conv.pet));

            return (
              <li
                key={`${conv.user._id}_${conv.pet ? conv.pet._id : 'gen'}`}
                onClick={() => { setCurrentChat(conv.user); setCurrentPet(conv.pet); }}
                className={`p-4 border-b border-pastel-pink/10 cursor-pointer hover:bg-pastel-pink/10 transition-colors ${isSelected ? 'bg-pastel-purple/10 border-l-4 border-l-pastel-purple' : 'border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative">
                    <FaUserCircle className="w-12 h-12 text-pastel-purple/50" />
                    {conv.pet && (
                      <img src={conv.pet.images?.[0] || 'https://via.placeholder.com/20'} alt={conv.pet.name} className="w-6 h-6 rounded-full absolute -bottom-1 -right-1 border-2 border-white object-cover" />
                    )}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-bold text-gray-800">{conv.user.name}</p>
                    {conv.pet && <p className="text-xs text-pastel-purple font-bold">Ref: {conv.pet.name}</p>}
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-white/40 bg-white/60 backdrop-blur-md flex items-center shadow-sm z-10 sticky top-0">
              <FaUserCircle className="w-10 h-10 text-pastel-purple/80 mr-3" />
              <div>
                <h2 className="text-lg font-bold text-gray-800">{currentChat.name}</h2>
                {currentPet && (
                  <p className="text-xs text-pastel-purple font-medium flex items-center">
                    Interested in <span className="font-bold ml-1">{currentPet.name}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === userInfo._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-md ${msg.sender === userInfo._id
                      ? 'bg-gradient-to-r from-pastel-purple to-pastel-pink text-white rounded-br-none'
                      : 'bg-white/80 backdrop-blur-md text-gray-800 rounded-bl-none border border-white/50'
                      }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                    <span className={`text-[10px] block text-right mt-1 opacity-70 ${msg.sender === userInfo._id ? 'text-white' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white/60 backdrop-blur-xl border-t border-white/40">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-pastel-pink/30 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-pastel-purple focus:border-transparent bg-white/60 shadow-inner placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="ml-3 bg-gradient-to-r from-pastel-purple to-pastel-pink text-white p-3 rounded-full hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {sending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FaPaperPlane />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-pastel-bg/20">
            <div className="w-24 h-24 bg-pastel-purple/20 rounded-full flex items-center justify-center mb-4">
              <FaPaperPlane className="text-4xl text-pastel-purple" />
            </div>
            <p className="text-xl font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
