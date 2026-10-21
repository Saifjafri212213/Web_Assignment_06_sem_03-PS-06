import api from './client';

const dashboardApi = {
  get: () => api.get('/dashboard'),
};

export default dashboardApi;
