import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';

const axiosClient = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

// Optional: Thêm interceptor để xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về response nếu không có lỗi
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    // Only reload for 401 errors on endpoints other than /auth/me/
    if (status === 401 && !url.endsWith('/auth/me/')) {
      console.error('Unauthorized! Reloading page...');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosClient;