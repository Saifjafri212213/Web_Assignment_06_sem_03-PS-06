import api from './client';

const menuApi = {
  getAll: () => api.get('/menu'),
  getOne: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  remove: (id) => api.delete(`/menu/${id}`),
};

export default menuApi;
