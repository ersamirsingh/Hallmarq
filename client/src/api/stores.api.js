import apiClient from './client';

export const storesApi = {
  getStores: async (params = {}) => {
    const response = await apiClient.get('/stores', { params });
    return response.data;
  },
  rateStore: async (storeId, payload) => {
    const response = await apiClient.post(`/stores/${storeId}/rating`, payload);
    return response.data;
  },
  getStoreReviews: async (storeId, params = {}) => {
    const response = await apiClient.get(`/stores/${storeId}/reviews`, { params });
    return response.data;
  }
};

export default storesApi;
