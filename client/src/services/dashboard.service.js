import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const dashboardService = {
  getOverview: async () => {
    return api.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  },

  getAnalytics: async () => {
    return api.get(API_ENDPOINTS.ADMIN.ANALYTICS);
  },

  getRecentActivity: async () => {
    return api.get(API_ENDPOINTS.ADMIN.ACTIVITY);
  },

  quickSearch: async (q) => {
    return api.get(API_ENDPOINTS.ADMIN.SEARCH, { params: { q } });
  },

  getSystemStatus: async () => {
    return api.get(API_ENDPOINTS.ADMIN.SYSTEM);
  },
};

export default dashboardService;
