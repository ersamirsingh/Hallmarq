import apiClient from './client';

export const adminApi = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
  getUsers: async (params = {}) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  },
  getUserDetails: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },
  createUser: async (payload) => {
    const response = await apiClient.post('/admin/users', payload);
    return response.data;
  },
  getAvailableOwners: async () => {
    const response = await apiClient.get('/admin/available-owners');
    return response.data;
  },
  getStores: async (params = {}) => {
    const response = await apiClient.get('/admin/stores', { params });
    return response.data;
  },
  createStore: async (payload) => {
    const response = await apiClient.post('/admin/stores', payload);
    return response.data;
  }
};

export default adminApi;
