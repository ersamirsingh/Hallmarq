import axios from 'axios';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const path = window.location.pathname;
    const isPublic = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'].some(p => path.startsWith(p));

    if (status === 401 && !isPublic) {
      window.location.href = '/login';
    } else if (status === 429) {
      const retryAfter = error?.response?.headers?.['retry-after'];
      const msg = retryAfter ? `Too many requests. Please wait ${retryAfter} seconds.` : 'Too many requests. Please slow down.';
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
