import express from 'express';
import {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
} from '../controllers/newsletter.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public newsletter subscription route
router.post('/subscribe', subscribe);

// Private Admin-only routes
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllSubscribers);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteSubscriber);

export default router;
