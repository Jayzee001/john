import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from './config';
import { cookieUtils } from './cookies';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = cookieUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      cookieUtils.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden - redirect to home or show error
      console.error('Access forbidden');
    }
    
    if (error.response?.status === 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// API methods with better typing
export const apiClient = {
  // GET request
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then((response) => response.data),
  
  // POST request
  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then((response) => response.data),
  
  // PUT request
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config).then((response) => response.data),
  
  // PATCH request
  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config).then((response) => response.data),
  
  // DELETE request
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config).then((response) => response.data),
};

// Export the axios instance for direct use if needed
export default api; 