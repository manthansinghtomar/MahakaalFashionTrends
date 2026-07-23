'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.jsx';
import { ROUTES } from '@/constants/index.js';
import { HeartIcon, CartIcon, UserIcon, BellIcon } from './Icons.jsx';
import ConfirmDialog from '@/components/ui/ConfirmDialog.jsx';

/**
 * NavbarActions handles auth states (Loading/Guest/Auth) and badge counts.
 */
export const NavbarActions = ({
  cartCount = 3, // placeholder count
  wishlistCount = 1, // placeholder count
  notificationCount = 2, // placeholder count
}) => {
  const { user, loading, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  // Render auth section based on state
  const renderAuthSection = () => {
    if (loading) {
      // 1. Loading State (Skeleton UI)
      return (
        <div className="h-8 w-16 animate-pulse rounded-full bg-neutral-200" aria-hidden="true" />
      );
    }

    if (!user) {
      // 2. Guest State (Sign In Button)
      return (
        <Link
          href={ROUTES.LOGIN}
          className="rounded-full bg-neutral-950 px-6 py-2 text-xs font-semibold tracking-wider text-white transition-all duration-300 hover:bg-secondary hover:text-neutral-955 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          SIGN IN
        </Link>
      );
    }

    // Get initials for profile placeholder
    const getInitials = () => {
      if (!user.name) return 'U';
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    };

    // 3. Authenticated State (User Dropdown Menu)
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-neutral-900 hover:ring-2 hover:ring-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2"
        >
          {getInitials()}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-neutral-200 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-4 py-2 border-b border-neutral-100">
              <p className="text-xs text-neutral-400">Signed in as</p>
              <p className="truncate text-sm font-semibold text-neutral-800">{user.name || user.email}</p>
            </div>
            <Link
              href={ROUTES.PROFILE}
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              My Profile
            </Link>
            <Link
              href={ROUTES.ORDERS}
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              My Orders
            </Link>
            {['admin', 'superadmin'].includes(user.role) && (
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-secondary font-medium hover:bg-neutral-50"
              >
                Admin Panel
              </Link>
            )}
            <button
              onClick={() => {
                setDropdownOpen(false);
                setShowLogoutConfirm(true);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 border-t border-neutral-100"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-4">
      {/* 1. Notifications Link (Badge Placeholder - Hidden for now) */}
      <Link
        href={ROUTES.NOTIFICATIONS || '#'}
        className="relative rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 hidden"
        aria-label="View notifications"
      >
        <BellIcon className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white ring-2 ring-white">
            {notificationCount}
          </span>
        )}
      </Link>

      {/* 2. Wishlist Link (Badge Placeholder - Hidden for now) */}
      <Link
        href={ROUTES.WISHLIST}
        className="relative rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 hidden"
        aria-label="View wishlist"
      >
        <HeartIcon className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white ring-2 ring-white">
            {wishlistCount}
          </span>
        )}
      </Link>

      {/* 3. Cart Link (Badge Placeholder - Hidden for now) */}
      <Link
        href={ROUTES.CART}
        className="relative rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 hidden"
        aria-label="View shopping bag"
      >
        <CartIcon className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white ring-2 ring-white">
            {cartCount}
          </span>
        )}
      </Link>

      <span className="h-5 w-[1px] bg-neutral-200 hidden" aria-hidden="true" />

      {/* 4. Auth State Handler */}
      {renderAuthSection()}

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
    </div>
  );
};

export default NavbarActions;
