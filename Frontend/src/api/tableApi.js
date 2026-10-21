import api from './client';

const tableApi = {
  getAll: () => api.get('/tables'),
  create: (data) => api.post('/tables', data),
  update: (id, data) => api.put(`/tables/${id}`, data),
  remove: (id) => api.delete(`/tables/${id}`),
};

export default tableApi;
