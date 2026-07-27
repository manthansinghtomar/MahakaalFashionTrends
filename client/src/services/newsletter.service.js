import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const newsletterService = {
  subscribe: async (email) => {
    return api.post(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, { email });
  },

  getAllSubscribers: async (params = {}) => {
    return api.get(API_ENDPOINTS.NEWSLETTER.BASE, { params });
  },

  deleteSubscriber: async (id) => {
    return api.delete(API_ENDPOINTS.NEWSLETTER.BY_ID(id));
  },
};

export default newsletterService;
