// src/hooks/useChat.js
import { useState } from 'react';
import { chatService } from '../api/chat'
import { toast } from 'react-toastify';

export const useChat = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const getUserChats = async () => {
    try {
      setLoading(true);
      const response = await chatService.getUserChats();
      setChats(response.data);
      return response.data;
    } catch (error) {
      toast.error('Failed to load chats');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (userId) => {
    try {
      setLoading(true);
      const response = await chatService.getOrCreateChat(userId);
      setCurrentChat(response.data);
      
      // Load messages
      const messagesResponse = await chatService.getChatMessages(response.data._id);
      setMessages(messagesResponse.data.messages);
      
      return response.data;
    } catch (error) {
      toast.error('Failed to open chat');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (chatId, content) => {
    try {
      const response = await chatService.sendMessage(chatId, content);
      
      // Add message to local state
      setMessages(prev => [...prev, response.data]);
      
      // Update chat list
      setChats(prev => prev.map(chat => 
        chat._id === chatId 
          ? { ...chat, lastMessage: content, lastMessageTime: new Date() }
          : chat
      ));
      
      return response.data;
    } catch (error) {
      toast.error('Failed to send message');
      throw error;
    }
  };

  return {
    loading,
    chats,
    messages,
    currentChat,
    getUserChats,
    openChat,
    sendMessage,
    setMessages,
    setCurrentChat
  };
};
