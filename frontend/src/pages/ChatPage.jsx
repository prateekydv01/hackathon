// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, Search, User } from 'lucide-react';
import { useChat } from '../hooks/chatHook';
import ChatWindow from '../components/Chat/ChatWindow';
import UserList from '../components/Chat/ChatList';

const ChatPage = () => {
  const [view, setView] = useState('chats'); // 'chats', 'users', 'chat'
  const [searchTerm, setSearchTerm] = useState('');
  const { chats, loading, getUserChats, currentChat } = useChat();

  useEffect(() => {
    getUserChats();
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (currentChat && view === 'chat') {
    return <ChatWindow onBack={() => setView('chats')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <MessageCircle className="mr-2" />
              Messages
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('chats')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  view === 'chats' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                My Chats
              </button>
              <button
                onClick={() => setView('users')}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  view === 'users' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                New Chat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'users' ? (
          <UserList onUserSelect={(userId) => setView('chat')} />
        ) : (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="bg-white rounded-lg shadow-sm">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading chats...</p>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start a conversation with someone from your network
                  </p>
                  <button
                    onClick={() => setView('users')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Start New Chat
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {chats
                    .filter(chat => 
                      chat.otherUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((chat) => (
                      <div
                        key={chat._id}
                        onClick={() => {
                          setView('chat');
                          // openChat will be called in ChatWindow component
                        }}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={chat.otherUser.avatar}
                            alt={chat.otherUser.fullName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {chat.otherUser.fullName}
                              </h3>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                  {formatTime(chat.lastMessageTime)}
                                </span>
                                {chat.unreadCount > 0 && (
                                  <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {chat.lastMessage || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
