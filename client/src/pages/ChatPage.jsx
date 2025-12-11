import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { FaPaperPlane, FaUserCircle } from 'react-icons/fa';

const ENDPOINT = 'http://localhost:5000';
var socket;

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null); // The user we are chatting with
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
      if (currentChat && newMessageReceived.sender === currentChat._id) {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
      // Refresh conversations list to show new message preview
      fetchConversations();
    });

    return () => {
      socket.disconnect();
    };
  }, [userInfo]);

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

  // Handle initial chat selection from navigation (e.g., "Message Shelter")
  useEffect(() => {
    if (location.state && location.state.userId) {
      // Check if conversation exists, if not, create a temporary one
      const existingConv = conversations.find(c => c.user._id === location.state.userId);
      if (existingConv) {
        setCurrentChat(existingConv.user);
      } else {
        // Fetch user details if not in conversations list
        // For simplicity, we assume location.state passes necessary user info or we fetch it
        // Here we might need a "fetchUserById" endpoint or pass full object
        if (location.state.user) {
          setCurrentChat(location.state.user);
        }
      }
    }
  }, [location.state, conversations]);

  // Fetch Messages when Current Chat Changes
  useEffect(() => {
    if (!currentChat) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/chat/${currentChat._id}`, { withCredentials: true });
        setMessages(data);
        socket.emit('join_chat', userInfo._id); // Join own room is enough for 1-on-1 if logic is simple, or unique room ID
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentChat, userInfo]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [sending, setSending] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    setSending(true);
    // Artificial delay for UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    const messageData = {
      sender: userInfo,
      receiver: currentChat,
      content: newMessage,
      chatId: [userInfo._id, currentChat._id].sort().join('_'), // Simple chat ID generation
    };

    try {
      // Optimistic UI update
      // setMessages([...messages, { ...messageData, _id: Date.now(), createdAt: new Date().toISOString() }]);

      // Emit to socket
      socket.emit('new_message', messageData);

      // Add to local state immediately for responsiveness (socket will also broadcast but we can ignore our own echo if handled correctly)
      setMessages((prev) => [...prev, { ...messageData, sender: userInfo._id, createdAt: new Date().toISOString() }]);
      setNewMessage('');
      fetchConversations(); // Update sidebar
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv.user._id}
              onClick={() => setCurrentChat(conv.user)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${currentChat?._id === conv.user._id ? 'bg-green-50' : ''}`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUserCircle className="w-10 h-10 text-gray-400" />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900">{conv.user.name}</p>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
              <FaUserCircle className="w-8 h-8 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-800">{currentChat.name}</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-off-white space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === userInfo._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-sm ${msg.sender === userInfo._id
                      ? 'bg-forest-green text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none'
                      }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs block text-right mt-1 ${msg.sender === userInfo._id ? 'text-green-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-forest-green focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="ml-3 bg-forest-green text-white p-3 rounded-full hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {sending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <FaPaperPlane />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
