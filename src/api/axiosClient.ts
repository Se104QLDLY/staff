import axios from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Request interceptor to add JWT token
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosClient.interceptors.response.use(  
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          // Try to refresh token
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API Methods
export const apiClient = {
  // Authentication
  login: async (username: string, password: string) => {
    const response = await axiosClient.post('/token/', { username, password });
    const { access, refresh } = response.data;
    setTokens(access, refresh);
    return response.data;
  },

  logout: () => {
    clearTokens();
    window.location.href = '/login';
  },

  // Agencies
  getAgencies: (params?: any) => axiosClient.get('/agencies/agencies/', { params }),
  getAgency: (id: string) => axiosClient.get(`/agencies/agencies/${id}/`),
  createAgency: (data: any) => axiosClient.post('/agencies/agencies/', data),
  updateAgency: (id: string, data: any) => axiosClient.put(`/agencies/agencies/${id}/`, data),
  deleteAgency: (id: string) => axiosClient.delete(`/agencies/agencies/${id}/`),

  // Agency Types
  getAgencyTypes: () => axiosClient.get('/agencies/agency-types/'),
  
  // Districts
  getDistricts: () => axiosClient.get('/agencies/districts/'),

  // Accounts
  getAccounts: (params?: any) => axiosClient.get('/accounts/accounts/', { params }),
  createAccount: (data: any) => axiosClient.post('/accounts/register/', data),

  // Dashboard
  getDashboardStats: () => axiosClient.get('/dashboard/'),

  // Finance
  getFinanceData: (params?: any) => axiosClient.get('/finance/', { params }),

  // Inventory
  getInventoryData: (params?: any) => axiosClient.get('/inventory/', { params }),
};

export default axiosClient;
