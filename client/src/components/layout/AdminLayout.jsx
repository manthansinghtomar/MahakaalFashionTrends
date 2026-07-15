import React from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

/**
 * Reusable AdminLayout wrapper component positioning Sidebar and Topbar.
 */
export const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
