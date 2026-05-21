import api from './api.js';

export const alertService = {
  async live(language) {
    const { data } = await api.get('/alerts/live', { params: { language } });
    return data.alerts;
  }
};
