import express from 'express';
import { uploadImages } from '../controllers/upload.controller.js';
import { uploadParser } from '../middleware/uploadMiddleware.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Middleware helper to configure the Cloudinary destination subfolder dynamically.
 * Helps reuse the upload controller across multiple endpoints (products, categories, offers, profiles).
 */
const setUploadFolder = (folderName) => {
  return (req, res, next) => {
    req.uploadFolder = folderName;
    next();
  };
};

// @route   POST /api/upload/products
// @desc    Upload multiple product images (max 8)
// @access  Private (Admin & Superadmin only)
router.post(
  '/products',
  protect,
  authorizeRoles('admin', 'superadmin'),
  setUploadFolder('products'),
  uploadParser('images', 8),
  uploadImages
);

export default router;
