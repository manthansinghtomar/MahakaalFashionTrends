'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo.jsx';
import { NAV_LINKS } from '@/constants/index.js';
import AnnouncementBar from './AnnouncementBar.jsx';
import DesktopNav from './DesktopNav.jsx';
import SearchInput from './SearchInput.jsx';
import NavbarActions from './NavbarActions.jsx';
import MobileDrawer from './MobileDrawer.jsx';
import { MenuIcon } from './Icons.jsx';

/**
 * Public Navbar Master Orchestrator component.
 * Coordinates sticky layouts, scrolling states, and responsive drawers.
 */
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Monitor screen scrolling height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col z-40 sticky top-0">
      {/* Main Navigation Panel */}
      <header
        className={`w-full transition-all duration-300 py-5 ${
          isScrolled
            ? 'bg-white/90 shadow-sm backdrop-blur-md border-b border-neutral-100'
            : 'bg-white border-b border-neutral-200'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between md:grid md:grid-cols-3 md:items-center gap-4 md:gap-0">
            
            {/* Column 1: Brand Logo & Mobile menu trigger (Left) */}
            <div className="flex items-center gap-4 justify-start">
              <button
                onClick={() => setDrawerOpen(true)}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-800 md:hidden"
                aria-expanded={drawerOpen}
                aria-haspopup="true"
                aria-controls="mobile-nav-drawer"
                aria-label="Open mobile menu"
              >
                <MenuIcon className="h-6 w-6" />
              </button>

              <Link href="/" className="flex items-center focus:outline-none">
                <Logo />
              </Link>
            </div>

            {/* Column 2: Desktop Navigation Links (Center) */}
            <div className="hidden md:flex justify-center -translate-x-5">
              <DesktopNav />
            </div>

            {/* Column 3: Search & Actions (Right) */}
            <div className="flex items-center justify-end gap-6">
              {/* Search Input (Desktop) */}
              <div className="hidden md:block w-[230px]">
                <SearchInput />
              </div>

              {/* Right Action Icons & Auth state */}
              <NavbarActions />
            </div>

          </div>

          {/* Collapsed Search input on smaller screens */}
          <div className="mt-4 block md:hidden">
            <SearchInput className="max-w-full" />
          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Drawer Side Panel */}
      <MobileDrawer
        id="mobile-nav-drawer"
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={NAV_LINKS}
      />
    </div>
  );
};

export default Navbar;
