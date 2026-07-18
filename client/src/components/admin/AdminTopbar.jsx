"use client";

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/index.js';
import { useAuth } from '@/context/AuthContext.jsx';

/**
 * Premium Admin Topbar console header.
 * Displays toggle buttons for mobile viewports, user indicators, and back-to-shop triggers.
 */
export const AdminTopbar = ({ onMenuClick }) => {
  const { currentUser } = useAuth();

  // Extract initials
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const initials = currentUser ? getInitials(currentUser.fullName) : 'A';

  return (
    <header className="flex h-20 items-center justify-between border-b border-neutral-100 bg-white px-6 lg:px-8 sticky top-0 z-20 shadow-xs">
      
      {/* 1. Mobile Menu Toggle Trigger */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-neutral-500 hover:text-neutral-900 focus:outline-none md:hidden transition-colors"
          aria-label="Open sidebar menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Title */}
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 hidden sm:block">
          Administrator Console
        </h2>
      </div>

      {/* 2. User Indicator & Store Link */}
      <div className="flex items-center gap-6">
        
        {/* Back to store */}
        <Link 
          href={ROUTES.HOME}
          className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-secondary transition-colors"
        >
          Back to Store
        </Link>

        {/* User initials bubble indicator */}
        <div className="flex items-center gap-3 pl-4 border-l border-neutral-100">
          <div 
            className="w-9 h-9 rounded-full bg-secondary/5 border border-secondary/20 text-secondary flex items-center justify-center text-xs font-bold tracking-wider select-none"
            title={currentUser?.fullName || 'Administrator'}
          >
            {initials}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-neutral-800 leading-none">
              {currentUser?.fullName || 'Admin User'}
            </div>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">
              {currentUser?.role || 'admin'}
            </span>
          </div>
        </div>

      </div>

    </header>
  );
};

export default AdminTopbar;
