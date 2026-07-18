import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx';
import AdminLayout from '@/components/admin/AdminLayout.jsx';

/**
 * Admin Panel layout entry.
 * Secures all administrative sub-pages by verifying admin roles,
 * and renders the collateral Sidebar/Topbar workspace layouts.
 */
export default function AdminPageLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
