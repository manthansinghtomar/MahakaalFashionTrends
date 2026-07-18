import React from 'react';
import { NEWSLETTER_CONFIG } from '@/constants/index.js';
import NewsletterForm from './NewsletterForm.jsx';

/**
 * Newsletter section component (React Server Component).
 * Styled with a premium dark luxury aesthetic (black, white, and gold).
 */
export const NewsletterSection = () => {
  return (
    <section 
      className="relative w-full bg-neutral-950 text-white py-24 border-b border-neutral-900 overflow-hidden"
      aria-labelledby="newsletter-section-title"
    >
      {/* Golden glow radial gradient background */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Visual background grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.005)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />

      <div className="mx-auto max-w-4xl px-4 text-center relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary block">
            NEWSLETTER
          </span>
          <h2 
            id="newsletter-section-title"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            {NEWSLETTER_CONFIG.title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl mx-auto">
            {NEWSLETTER_CONFIG.description}
          </p>
        </div>

        {/* Subscription Form */}
        <NewsletterForm config={NEWSLETTER_CONFIG} />

      </div>
    </section>
  );
};

export default NewsletterSection;
