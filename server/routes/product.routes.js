import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  getDeletedProducts,
  permanentDeleteProduct,
  getAllProducts,
  getProductBySlug,
  getRecentReviews,
} from '../controllers/product.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

/**
 * Inline optional protect middleware for the listing route.
 * Automatically loads logged-in administrator profiles if standard JWT cookie
 * tokens or Bearer headers are detected. Allows public users to query listing.
 */
const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin' || decoded.role === 'superadmin') {
        const admin = await Admin.findById(decoded.id).select('-password');
        if (admin && admin.isActive) {
          req.user = admin;
        }
      }
    } catch (err) {
      // Ignore token verification errors for optional protect
    }
  }
  next();
};

// Admin deleted items list route (must be before /:slug)
router.get('/deleted/list', protect, authorizeRoles('admin', 'superadmin'), getDeletedProducts);

// Public catalog routes
router.get('/reviews/recent', getRecentReviews);
router.get('/', optionalProtect, getAllProducts);
router.get('/:slug', getProductBySlug);

// Private Admin-only mutating routes
router.post('/', protect, authorizeRoles('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorizeRoles('admin', 'superadmin'), updateProduct);
router.delete('/:id/permanent', protect, authorizeRoles('admin', 'superadmin'), permanentDeleteProduct);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteProduct);
router.patch('/:id/restore', protect, authorizeRoles('admin', 'superadmin'), restoreProduct);

export default router;
