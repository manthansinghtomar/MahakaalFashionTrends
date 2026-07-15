import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const productService = {
  getAllProducts: async (params = {}) => {
    return api.get(API_ENDPOINTS.PRODUCTS.BASE, { params });
  },

  getProductBySlug: async (slug) => {
    return api.get(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug));
  },

  createProduct: async (productData) => {
    return api.post(API_ENDPOINTS.PRODUCTS.BASE, productData);
  },

  updateProduct: async (id, productData) => {
    return api.put(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return api.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}`);
  },

  restoreProduct: async (id) => {
    return api.patch(API_ENDPOINTS.PRODUCTS.RESTORE(id));
  },
};

export default productService;
