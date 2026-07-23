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

  getDeletedProducts: async () => {
    return api.get(`${API_ENDPOINTS.PRODUCTS.BASE}/deleted/list`);
  },

  restoreProduct: async (id) => {
    return api.patch(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/restore`);
  },

  permanentDeleteProduct: async (id) => {
    return api.delete(`${API_ENDPOINTS.PRODUCTS.BASE}/${id}/permanent`);
  },
};

export default productService;
