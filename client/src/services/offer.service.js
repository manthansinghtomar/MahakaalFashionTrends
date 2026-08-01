import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const offerService = {
  getAllOffers: async (params = {}) => {
    return api.get(API_ENDPOINTS.OFFERS.BASE, { params });
  },

  getOfferById: async (id) => {
    return api.get(API_ENDPOINTS.OFFERS.BY_ID(id));
  },

  createOffer: async (offerData) => {
    return api.post(API_ENDPOINTS.OFFERS.BASE, offerData);
  },

  updateOffer: async (id, offerData) => {
    return api.put(`${API_ENDPOINTS.OFFERS.BASE}/${id}`, offerData);
  },

  deleteOffer: async (id) => {
    return api.delete(`${API_ENDPOINTS.OFFERS.BASE}/${id}`);
  },

  restoreOffer: async (id) => {
    return api.patch(`${API_ENDPOINTS.OFFERS.BASE}/${id}/restore`);
  },

  getDeletedOffers: async () => {
    return api.get(`${API_ENDPOINTS.OFFERS.BASE}/deleted/list`);
  },

  permanentDeleteOffer: async (id) => {
    return api.delete(`${API_ENDPOINTS.OFFERS.BASE}/${id}/permanent`);
  },
};

export default offerService;
