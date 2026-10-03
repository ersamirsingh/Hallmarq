import apiClient from './client';

export const profileApi = {
  getProfile: async () => {
    const response = await apiClient.get('/profile');
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await apiClient.put('/profile', payload);
    return response.data;
  },
  changePassword: async (payload) => {
    const response = await apiClient.post('/profile/change-password', payload);
    return response.data;
  }
};

export default profileApi;
