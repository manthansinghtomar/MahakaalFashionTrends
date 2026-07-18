'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/constants/index.js';

/**
 * Desktop Nav menu list items.
 * Optimized with React.memo and useMemo to prevent redundant renders.
 */
export const DesktopNav = React.memo(() => {
  const pathname = usePathname();

  // Filter public items that are marked to be displayed in the main navbar
  const navbarLinks = useMemo(() => {
    return NAV_LINKS.filter((link) => link.showInNavbar);
  }, []);

  return (
    <nav className="hidden md:flex items-center gap-10" aria-label="Main Navigation">
      {navbarLinks.map((link) => {
        const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`relative py-2 text-[13px] font-medium tracking-wider transition-colors duration-300 focus:outline-none ${
              isActive
                ? 'text-neutral-950'
                : 'text-neutral-500 hover:text-neutral-950'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {link.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-secondary animate-fade-in" />
            )}
          </Link>
        );
      })}
    </nav>
  );
});

DesktopNav.displayName = 'DesktopNav';

export default DesktopNav;
