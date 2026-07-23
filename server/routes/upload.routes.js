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

// @route   POST /api/upload/:folder
// @desc    Upload multiple images to specific subfolder (max 8)
// @access  Private (Admin & Superadmin only)
router.post(
  '/:folder',
  protect,
  authorizeRoles('admin', 'superadmin'),
  (req, res, next) => {
    req.uploadFolder = req.params.folder || 'products';
    next();
  },
  uploadParser('images', 8),
  uploadImages
);

// @route   POST /api/upload
// @desc    Upload multiple images with query param folder
// @access  Private (Admin & Superadmin only)
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'superadmin'),
  (req, res, next) => {
    req.uploadFolder = req.query.folder || 'products';
    next();
  },
  uploadParser('images', 8),
  uploadImages
);

export default router;
