// src/services/chatService.js
import {api} from './index.js';

export const chatService = {
  getUserChats: async () => {
    const response = await api.get('/chat');
    return response.data;
  },

  getOrCreateChat: async (userId) => {
    const response = await api.get(`/chat/${userId}`);
    return response.data;
  },

  getChatMessages: async (chatId, page = 1) => {
    const response = await api.get(`/chat/${chatId}/messages?page=${page}`);
    return response.data;
  },

  sendMessage: async (chatId, content) => {
    const response = await api.post(`/chat/${chatId}/send`, { content });
    return response.data;
  }
};
