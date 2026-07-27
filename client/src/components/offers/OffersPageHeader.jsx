import React from 'react';
import Container from '@/components/ui/Container.jsx';

/**
 * Header for the Offers & Campaigns listing page.
 * Features luxury dark theme styling matching Contact page.
 */
export const OffersPageHeader = () => {
  return (
    <section className="relative w-full bg-neutral-950 text-white py-20 overflow-hidden border-b border-neutral-900 mb-12">
      {/* Premium Luxury Background Accents */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_#d9a05b_0%,_transparent_55%)] opacity-15" 
        aria-hidden="true"
      />
      
      {/* Decorative Grid Line Overlays */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" 
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center flex flex-col items-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary mb-4">
          EXCLUSIVE CAMPAIGNS
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          Offers & Private Promotions
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Access member-only seasonal discounts, premium promotions, and private store campaigns at Mahakaal Fashion Trends.
        </p>
      </Container>
    </section>
  );
};

export default OffersPageHeader;
