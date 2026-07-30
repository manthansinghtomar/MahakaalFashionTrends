'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo.jsx';
import { CloseIcon } from './Icons.jsx';

/**
 * Accessible, animatable Mobile Drawer navigation menu.
 * Features focus trapping, Escape key listener, click-outside dismissal,
 * and support for nested submenus.
 */
export const MobileDrawer = ({
  isOpen = false,
  onClose = () => {},
  links = [],
}) => {
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const pathname = usePathname();

  // Track which submenus are expanded
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Keyboard and Focus Trap handlers
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = drawerRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab -> Wrap to end
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          // Tab -> Wrap to beginning
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Lock background scroll when drawer is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle transitions with absolute overlay
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Side Panel Container */}
      <div
        ref={drawerRef}
        className={`absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-100">
          <Link href="/" onClick={onClose} className="focus:outline-none">
            <Logo />
          </Link>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-800"
            aria-label="Close menu"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile menu links">
          <ul className="space-y-2">
            {links.filter((link) => link.showInMobileMenu !== false).map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              const isExpanded = !!expandedMenus[link.label];
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);

              return (
                <li key={link.label} className="block">
                  {hasChildren ? (
                    <div>
                      {/* Parent Menu Toggle */}
                      <button
                        onClick={() => toggleSubmenu(link.label)}
                        className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none"
                        aria-expanded={isExpanded}
                      >
                        <span>{link.label}</span>
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Sub-menu lists */}
                      <ul
                        className={`mt-1 pl-4 space-y-1 transition-all duration-200 overflow-hidden ${
                          isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {link.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block rounded-lg px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 focus:outline-none"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    /* Standard Direct Link */
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 border-l-2 ${
                        isActive
                          ? 'border-secondary text-neutral-950 bg-secondary/5 font-semibold'
                          : 'border-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {link.label}
                      {link.isComingSoon && (
                        <span className="ml-2 rounded bg-neutral-200 px-1.5 py-0.5 text-[10px] font-bold text-neutral-600">
                          Soon
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MobileDrawer;
