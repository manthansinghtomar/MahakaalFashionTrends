import axios from 'axios';
import { handleApiError } from '../utils/apiErrorHandler.js';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Dynamically match browser hostname in development so auth cookies match host (localhost vs network IP)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      const hostname = window.location.hostname;
      config.baseURL = `http://${hostname}:5000/api`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response.data; // automatically unpack data property
  },
  (error) => {
    // Normalize and inject human-readable error messages
    const normalizedMessage = handleApiError(error);
    
    // Construct a custom error object carrying the normalized message
    const customError = new Error(normalizedMessage);
    customError.status = error.response?.status;
    customError.originalError = error;
    
    return Promise.reject(customError);
  }
);

export default api;
export { api as axiosInstance };
