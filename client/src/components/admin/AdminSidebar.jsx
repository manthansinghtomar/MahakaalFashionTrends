"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo.jsx';
import { ADMIN_NAV_LINKS } from '@/constants/index.js';

/**
 * Premium Dark-Neutral & Gold Admin Navigation Sidebar.
 * Displays logo and mapped links with custom inline SVGs.
 */
export const AdminSidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // Custom visual icon mappings based on label keys
  const getIcon = (label) => {
    switch (label) {
      case 'Dashboard':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
          </svg>
        );
      case 'Products':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Categories':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case 'Offers':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'Inquiries':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'Subscribers':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        );
      case 'Settings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const navContent = (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-300 border-r border-neutral-800">
      
      {/* 1. Header Logo */}
      <div className="flex h-20 items-center justify-between px-6 border-b border-neutral-900 bg-neutral-950">
        <Link href="/admin/dashboard" className="flex items-center focus:outline-none">
          <Logo variant="dark" imgSize="w-12 h-12" />
        </Link>
        {/* Close Button on Mobile Drawer */}
        {onClose && (
          <button 
            onClick={onClose} 
            className="md:hidden p-1 rounded-lg text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Close sidebar menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Navigation items */}
      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto text-sm font-medium">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose} // Auto-close drawer on click
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-neutral-900 border border-neutral-800 text-secondary' 
                  : 'hover:bg-neutral-900/50 hover:text-white border border-transparent'
              }`}
            >
              <span className={isActive ? 'text-secondary' : 'text-neutral-400'}>
                {getIcon(link.label)}
              </span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. Footer tag */}
      <div className="p-6 border-t border-neutral-900 text-[10px] text-neutral-500 font-semibold uppercase tracking-widest text-center">
        BESPOKE COLLECTION
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar overlay Drawer backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-out Mobile Panel Drawer */}
      <div 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        {navContent}
      </aside>
    </>
  );
};

export default AdminSidebar;
