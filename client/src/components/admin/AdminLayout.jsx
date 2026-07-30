"use client";

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

/**
 * Reusable Admin Layout Wrapper.
 * Embeds Sidebar navigation and Topbar console controls.
 * Adapts seamlessly to viewport breakpoints with strict zero horizontal overflow on mobile.
 */
export const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50/30 flex text-neutral-900 overflow-x-hidden w-full">
      
      {/* 1. Collapsible/Fixed Navigation Drawer */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. Content view offsets */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen min-w-0 w-full overflow-x-hidden">
        
        {/* Topbar Console Header */}
        <AdminTopbar 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />

        {/* Dynamic Main Workspace content */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 w-full overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
