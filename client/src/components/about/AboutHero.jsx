import React from 'react';
import Container from '@/components/ui/Container.jsx';

/**
 * AboutHero component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Creates a premium, high-impact brand introduction with a luxury dark gradient and gold accents.
 */
export const AboutHero = () => {
  return (
    <section 
      className="relative bg-neutral-950 text-white py-24 sm:py-32 overflow-hidden border-b border-neutral-900"
      aria-labelledby="about-hero-title"
    >
      {/* Premium Luxury Background Accents */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_#d9a05b_0%,_transparent_55%)] opacity-15" 
        aria-hidden="true"
      />
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary/5 blur-[120px] pointer-events-none" 
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
          Heritage & Elegance
        </span>

        {/* Hero Title */}
        <h1 
          id="about-hero-title"
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] max-w-4xl text-white mb-6"
        >
          The Art of Indian Sartorial Heritage, <span className="text-secondary">Redefined</span>
        </h1>

        {/* Small Elegant Divider */}
        <div className="w-12 h-[2px] bg-secondary my-6 opacity-80" aria-hidden="true" />

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-neutral-300 max-w-2xl leading-relaxed">
          Mahakaal Fashion Trends marries centuries-old handcrafted textile traditions with modern silhouettes, creating a new standard of luxury menswear for the contemporary gentleman.
        </p>
      </Container>
    </section>
  );
};

export default AboutHero;
