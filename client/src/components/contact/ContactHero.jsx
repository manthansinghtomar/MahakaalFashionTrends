import React from 'react';
import Container from '@/components/ui/Container.jsx';

/**
 * ContactHero component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Creates a premium brand header with a luxury dark gradient and gold accents.
 */
export const ContactHero = () => {
  return (
    <section 
      className="relative bg-neutral-950 text-white py-20 overflow-hidden border-b border-neutral-900"
      aria-labelledby="contact-hero-title"
    >
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
        {/* Editorial Wide-Spaced Tag */}
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary mb-4">
          Concierge Support
        </span>

        {/* Hero Title */}
        <h1 
          id="contact-hero-title"
          className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4"
        >
          Get in Touch
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Whether you have questions about custom sizes, private atelier appointments, or order deliveries, our dedicated team is at your service.
        </p>
      </Container>
    </section>
  );
};

export default ContactHero;
