import React from 'react';
import Link from 'next/link';
import Logo from '@/components/common/Logo.jsx';
import { NAV_LINKS, FOOTER_CATEGORIES, FOOTER_CONTACT } from '@/constants/index.js';
import FooterColumn from './FooterColumn.jsx';
import SocialLinks from './SocialLinks.jsx';
import FooterBottom from './FooterBottom.jsx';

/**
 * Public facing layout Footer component.
 * Organizes information columns, contact addresses, and newsletter scopes.
 */
export const Footer = () => {
  // Filter navbar links to show only valid public text links in Quick Links
  const quickLinks = NAV_LINKS.filter(
    (link) => link.showInFooter && !link.requiresAuth
  );

  return (
    <footer className="w-full bg-white border-t border-neutral-200 py-20 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 5-Column Symmetrical Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center focus:outline-none">
              <Logo />
            </Link>
            <p className="text-sm text-neutral-600 leading-loose max-w-[240px]">
              Premium ethnic clothing and designer traditional kurtas crafting legacies of style and elegance.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <FooterColumn title="Quick Links">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-600 hover:text-secondary hover:translate-x-1 font-medium transition-all duration-300 focus:outline-none focus:underline"
              >
                {link.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 3: Categories */}
          <FooterColumn title="Categories">
            {FOOTER_CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="text-sm text-neutral-600 hover:text-secondary hover:translate-x-1 font-medium transition-all duration-300 focus:outline-none focus:underline"
              >
                {cat.label}
              </Link>
            ))}
          </FooterColumn>

          {/* Column 4: Contact Information */}
          <FooterColumn title="Contact Us">
            <div className="text-sm text-neutral-600 space-y-5 leading-relaxed">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-900">Address</span>
                <span>{FOOTER_CONTACT.address}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-900">Phone</span>
                <a
                  href={`tel:${FOOTER_CONTACT.phone.replace(/\s+/g, '')}`}
                  className="hover:text-secondary transition focus:outline-none"
                >
                  {FOOTER_CONTACT.phone}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-900">Email</span>
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="hover:text-secondary transition focus:outline-none"
                >
                  {FOOTER_CONTACT.email}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-neutral-900">Hours</span>
                <span>{FOOTER_CONTACT.businessHours}</span>
              </div>
            </div>
          </FooterColumn>

          {/* Column 5: Social Links & Newsletter Placeholder */}
          <div className="flex flex-col space-y-8">
            
            {/* Social icons component */}
            <FooterColumn title="Follow Us">
              <SocialLinks />
            </FooterColumn>

            {/* Newsletter placeholder block */}
            <div className="border-t border-neutral-100 pt-6">
              <h4 className="text-base font-semibold uppercase tracking-wider text-black mb-3">
                Newsletter
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Subscribe to get early access to sales, new arrivals, and special collection notifications.
              </p>
              {/* Form trigger placeholder is left empty for future execution */}
            </div>

          </div>

        </div>

        {/* Legal copyrights bottom section */}
        <FooterBottom />

      </div>
    </footer>
  );
};

export default Footer;
