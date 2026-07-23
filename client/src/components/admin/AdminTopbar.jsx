"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.jsx';
import Link from 'next/link';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';

/**
 * Premium Admin Topbar console header.
 * Displays toggle buttons for mobile viewports, user indicators, and back-to-shop triggers.
 */
export const AdminTopbar = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };

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

      {/* 2. User Indicator & Dropdown */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        
        {/* User initials bubble indicator & name toggle */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
        >
          <div 
            className="w-9 h-9 rounded-full bg-secondary/5 border border-secondary/20 text-secondary flex items-center justify-center text-xs font-bold tracking-wider select-none group-hover:border-secondary/50 group-focus:ring-2 group-focus:ring-secondary/30 transition-all duration-300"
            title={currentUser?.fullName || 'Administrator'}
          >
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-neutral-800 group-hover:text-neutral-900 transition-colors leading-none">
              {currentUser?.fullName || 'Admin User'}
            </div>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none block mt-1">
              {currentUser?.role || 'admin'}
            </span>
          </div>
          {/* Dropdown chevron arrow */}
          <svg className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-50 mt-2 w-48 origin-top-right rounded-lg border border-neutral-100 bg-white py-1 shadow-lg focus:outline-none animate-fade-in">
            <div className="px-4 py-2 border-b border-neutral-50">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Signed in as</p>
              <p className="truncate text-xs font-semibold text-neutral-800 mt-0.5">{currentUser?.fullName || currentUser?.email}</p>
            </div>
            <Link
              href="/admin/profile"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              My Profile
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="block w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-150 cursor-pointer border-t border-neutral-100 rounded-b-md"
            >
              Logout
            </button>
          </div>
        )}

      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        cancelText="Cancel"
        loading={loggingOut}
        variant="primary"
      />
    </header>
  );
};

export default AdminTopbar;
