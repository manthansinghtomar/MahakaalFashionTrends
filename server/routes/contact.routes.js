import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  markContactAsRead,
  archiveContact,
  deleteContact,
} from '../controllers/contact.controller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public submission route
router.post('/', createContact);

// Private Admin-only routes
router.get('/', protect, authorizeRoles('admin', 'superadmin'), getAllContacts);
router.get('/:id', protect, authorizeRoles('admin', 'superadmin'), getContactById);
router.patch('/:id/read', protect, authorizeRoles('admin', 'superadmin'), markContactAsRead);
router.patch('/:id/archive', protect, authorizeRoles('admin', 'superadmin'), archiveContact);
router.delete('/:id', protect, authorizeRoles('admin', 'superadmin'), deleteContact);

export default router;
