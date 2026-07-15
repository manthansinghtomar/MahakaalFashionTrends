import express from 'express';
import {
  getDashboardOverview,
  getDashboardAnalytics,
  getRecentActivity,
  getQuickSearch,
  getSystemHealth,
} from '../controllers/admin.dashboard.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection & role check for admin/superadmin to all dashboard endpoints
router.use(protect);
router.use(authorizeRoles('admin', 'superadmin'));

router.get('/dashboard', getDashboardOverview);
router.get('/analytics', getDashboardAnalytics);
router.get('/activity', getRecentActivity);
router.get('/search', getQuickSearch);
router.get('/system', getSystemHealth);

export default router;
