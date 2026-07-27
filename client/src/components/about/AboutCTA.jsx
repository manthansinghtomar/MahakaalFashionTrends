import React from 'react';
import Link from 'next/link';
import Container from '@/components/ui/Container.jsx';
import Button from '@/components/ui/Button.jsx';

/**
 * AboutCTA component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Editorial Call To Action encouraging visitors to explore products.
 */
export const AboutCTA = () => {
  return (
    <section 
      className="relative bg-neutral-950 text-white py-20 overflow-hidden border-t border-neutral-900"
      aria-labelledby="about-cta-title"
    >
      {/* Luxury Radial Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#d9a05b_0%,_transparent_65%)] opacity-10"
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center flex flex-col items-center space-y-6">
        <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
          ABOUT MAHAKAAL FASHION TRENDS
        </span>

        <h2 
          id="about-cta-title"
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto"
        >
          Fashion for Every Generation
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed">
          Mahakaal Fashion Trends is a trusted men's fashion store in Birla Nagar, Gwalior. We offer stylish and affordable clothing for kids, teenagers, and adults, including casual wear, formal wear, jeans, T-shirts, shirts, lowers, belts, and accessories for every occasion.
        </p>

        {/* CTA Button Link */}
        <div className="pt-4">
          <Link href="/products" passHref className="focus:outline-none">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full px-8 py-3.5 tracking-widest uppercase text-xs shadow-md transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-secondary focus:ring-offset-2 bg-secondary text-neutral-950 hover:bg-secondary/90 font-bold"
            >
              Explore Collection
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default AboutCTA;
