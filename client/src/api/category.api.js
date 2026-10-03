import apiClient from './client';

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  createCategory: async (name) => {
    const response = await apiClient.post('/categories', { name });
    return response.data;
  }
};

export default categoryApi;
