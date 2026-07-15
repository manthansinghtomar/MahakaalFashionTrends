import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const contactService = {
  submitInquiry: async (inquiryData) => {
    return api.post(API_ENDPOINTS.CONTACT.BASE, inquiryData);
  },

  getAllInquiries: async (params = {}) => {
    return api.get(API_ENDPOINTS.CONTACT.BASE, { params });
  },

  getInquiryById: async (id, params = {}) => {
    return api.get(API_ENDPOINTS.CONTACT.BY_ID(id), { params });
  },

  markAsRead: async (id) => {
    return api.patch(API_ENDPOINTS.CONTACT.READ(id));
  },

  archiveInquiry: async (id) => {
    return api.patch(API_ENDPOINTS.CONTACT.ARCHIVE(id));
  },

  deleteInquiry: async (id) => {
    return api.delete(`${API_ENDPOINTS.CONTACT.BASE}/${id}`);
  },
};

export default contactService;
