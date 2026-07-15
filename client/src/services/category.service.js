import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const categoryService = {
  getAllCategories: async (params = {}) => {
    return api.get(API_ENDPOINTS.CATEGORIES.BASE, { params });
  },

  getCategoryBySlug: async (slug) => {
    return api.get(API_ENDPOINTS.CATEGORIES.BY_SLUG(slug));
  },

  createCategory: async (categoryData) => {
    return api.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return api.put(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return api.delete(`${API_ENDPOINTS.CATEGORIES.BASE}/${id}`);
  },

  restoreCategory: async (id) => {
    return api.patch(API_ENDPOINTS.CATEGORIES.RESTORE(id));
  },
};

export default categoryService;
