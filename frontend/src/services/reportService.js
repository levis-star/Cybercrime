import api from './api.js';

export const reportService = {
  async categories() {
    const { data } = await api.get('/reports/categories');
    return data.categories;
  },
  async create(payload) {
    const { data } = await api.post('/reports/create', payload);
    return data.report;
  },
  async track(trackingCode) {
    const { data } = await api.get(`/reports/${encodeURIComponent(trackingCode)}`);
    return data;
  }
};
