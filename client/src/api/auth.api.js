import apiClient from './client';

export const authApi = {
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  register: async (payload) => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (payload) => {
    const response = await apiClient.post('/auth/reset-password', payload);
    return response.data;
  },
  verifyEmail: async (token) => {
    const response = await apiClient.post('/auth/verify-email', { token });
    return response.data;
  },
  resendVerification: async () => {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  }
};

export default authApi;
