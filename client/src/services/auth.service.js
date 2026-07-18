import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const authService = {
  login: async (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },
  
  register: async (userData) => {
    return api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },
  
  adminLogin: async (credentials) => {
    return api.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
  },
  
  logout: async () => {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
  
  getCurrentUser: async () => {
    return api.get(API_ENDPOINTS.AUTH.ME);
  },

  updateProfile: async (profileData) => {
    return api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
  },

  changePassword: async (passwordData) => {
    return api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  },
};

export default authService;
