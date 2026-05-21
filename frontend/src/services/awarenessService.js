import api from './api.js';

export const awarenessService = {
  async list(language) {
    const { data } = await api.get('/awareness/content', { params: { language } });
    return data.content;
  }
};
