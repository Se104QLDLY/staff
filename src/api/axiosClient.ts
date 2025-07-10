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
    // Xử lý lỗi 401 (Unauthorized)
    if (status === 401) {
      // Redirect về trang login chính (homepage)
      console.log('Staff app: 401 Unauthorized, redirecting to login');
      window.location.href = import.meta.env.VITE_LOGIN_APP_URL || 'http://localhost:5178';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;