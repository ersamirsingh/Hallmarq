import apiClient from './client';

export const ownerApi = {
  getDashboard: async (params = {}) => {
    const response = await apiClient.get('/owner/dashboard', { params });
    return response.data;
  },
  updateStoreName: async (name) => {
    const response = await apiClient.patch('/owner/store', { name });
    return response.data;
  }
};

export default ownerApi;
