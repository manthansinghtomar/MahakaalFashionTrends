import express from 'express';
import {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  logoutUser,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/logout', logoutUser);

// Protected auth routes
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
