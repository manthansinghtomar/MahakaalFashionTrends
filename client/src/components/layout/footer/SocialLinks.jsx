import React from 'react';
import { SOCIAL_LINKS } from '@/constants/index.js';

// Social SVGs library
const SOCIAL_ICONS = {
  Instagram: (className) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.71 0-1.364.389-1.7.99l-.975 1.185Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
      />
    </svg>
  ),
  Facebook: (className) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      />
    </svg>
  ),
  YouTube: (className) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M23 12a10.05 10.05 0 0 1-1.74 5.83c-1.3 1.9-3.23 2.92-5.76 2.92H8.5c-2.53 0-4.46-1.02-5.76-2.92A10.05 10.05 0 0 1 1 12a10.05 10.05 0 0 1 1.74-5.83c1.3-1.9 3.23-2.92 5.76-2.92H15.5c2.53 0 4.46 1.02 5.76 2.92A10.05 10.05 0 0 1 23 12Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 15V9l5 3-5 3Z"
      />
    </svg>
  ),
  LinkedIn: (className) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"
      />
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  ),
};

export const SocialLinks = ({ className = '' }) => {
  // Filter for enabled channels
  const activeSocials = SOCIAL_LINKS.filter((item) => item.isEnabled);

  if (activeSocials.length === 0) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {activeSocials.map((social) => {
        const renderIcon = SOCIAL_ICONS[social.icon];
        return (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-300 bg-white p-2.5 text-neutral-600 transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/5 hover:border-secondary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            aria-label={`Follow us on ${social.label}`}
          >
            {renderIcon ? renderIcon('h-5 w-5') : <span className="text-sm font-semibold">{social.label[0]}</span>}
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
