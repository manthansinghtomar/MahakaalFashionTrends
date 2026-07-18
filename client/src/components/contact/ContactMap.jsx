import React from 'react';
import Link from 'next/link';
import { FOOTER_CONTACT } from '@/constants/index.js';
import Button from '@/components/ui/Button.jsx';

/**
 * ContactMap component.
 * Rendered as a React Server Component.
 * Instead of embedding a heavy or mock iframe, this displays an elegant
 * store card with directions using the actual business address from constants.
 */
export const ContactMap = () => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FOOTER_CONTACT.address)}`;

  return (
    <div className="group relative bg-white p-6 sm:p-8 rounded-xl border border-neutral-200/60 hover:border-secondary/20 shadow-xs transition-all duration-300 flex flex-col justify-between space-y-6">
      {/* Soft gold border on card hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl origin-left" />

      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span>VISIT OUR SHOWROOM</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-neutral-900">
          The Flagship Experience
        </h3>

        <p className="text-sm text-neutral-500 leading-relaxed">
          Walk into our showroom to touch our premium fabrics, work directly with master style consultants, and get measured for bespoke jackets and Kurtas. 
        </p>

        {/* Structured address details layout */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 space-y-2 text-xs sm:text-sm text-neutral-700">
          <p className="font-semibold text-neutral-800">Mahakaal Fashion Trends</p>
          <p className="leading-relaxed">{FOOTER_CONTACT.address}</p>
          <p className="text-neutral-400 text-xs">Landmark: Lord Shiva Enclave, central textile sector.</p>
        </div>
      </div>

      {/* Button directing to Google Maps navigation */}
      <div>
        <a 
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full focus:outline-none"
        >
          <Button
            variant="outline"
            size="md"
            className="w-full rounded-lg font-bold tracking-wider text-xs uppercase hover:bg-neutral-50 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-3.446l5.562-2.25c.79-.32 1.733.267 1.733 1.12v8.25c0 .54-.343 1.011-.864 1.156L16.5 21L7.5 18L1.732 20.316C.942 20.636 0 20.05 0 19.196V10.95c0-.54.343-1.011.864-1.156L9 6L18 9l5.006-2.025a1.125 1.125 0 011.533 1.04v7.712a1.125 1.125 0 01-.639 1.016l-5.394 2.183" />
            </svg>
            <span>Get Directions on Google Maps</span>
          </Button>
        </a>
      </div>
    </div>
  );
};

export default ContactMap;
