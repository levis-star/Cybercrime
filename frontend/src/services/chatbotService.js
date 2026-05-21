import api from './api.js';

export const chatbotService = {
  async query(message, language) {
    const { data } = await api.post('/chatbot/query', { message, language });
    return data;
  }
};
