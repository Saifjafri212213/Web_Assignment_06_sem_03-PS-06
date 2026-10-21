import api from './client';

const orderApi = {
  create: (data) => api.post('/orders', data),
  getMine: () => api.get('/orders/mine'),
  getAll: () => api.get('/orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
};

export default orderApi;
