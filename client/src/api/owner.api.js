import apiClient from './client';

export const ownerApi = {
  getDashboard: async (params = {}) => {
    const response = await apiClient.get('/owner/dashboard', { params });
    return response.data;
  }
};

export default ownerApi;
