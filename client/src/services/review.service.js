import api from '../lib/axios.js';

/**
 * Review service to interact with review-related backend endpoints.
 */
export const reviewService = {
  /**
   * Fetch recent product reviews.
   * @param {Object} params - Query parameters (e.g. limit)
   */
  getRecentReviews: async (params = {}) => {
    return api.get('/products/reviews/recent', { params });
  },
};

export default reviewService;
