import React from 'react';
import Container from '@/components/ui/Container.jsx';
import SectionTitle from '@/components/ui/SectionTitle.jsx';

/**
 * BrandValues component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Displays the four core brand values using custom vector icons.
 */
export const BrandValues = () => {
  const values = [
    {
      title: 'Premium Quality',
      description: 'We source high-grade long-staple threads and authentic raw silks, ensuring that every garment has a rich weight, beautiful drape, and longevity.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Crown Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 12h12l3-12-5 4-4-6-4 6-5-4z M6 18c0 1.1.9 2 2 2h8a2 2 0 002-2" />
        </svg>
      ),
    },
    {
      title: 'Authentic Craftsmanship',
      description: 'We honor ancestral weaving, hand-embroidery, and traditional tailoring methods, ensuring that every design carries human touch and artistry.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Scissors Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6a3 3 0 100 6 3 3 0 000-6z M18 6a3 3 0 100 6 3 3 0 000-6z M14.5 12.5L9 18 M9.5 12.5L15 18" />
        </svg>
      ),
    },
    {
      title: 'Customer Satisfaction',
      description: 'Our commitment is to guide you through personalized fittings, style consultation, and priority handling for a seamless experience.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Handset/Advisor Concierge Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3 M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3" />
        </svg>
      ),
    },
    {
      title: 'Timeless Style',
      description: 'We design clothing that transcends seasonal micro-trends. Our aesthetic focus is on classic silhouettes that remain refined for years to come.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Hourglass Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ];

  return (
    <section 
      className="w-full bg-neutral-50 py-20 border-b border-neutral-100"
      aria-labelledby="brand-values-title"
    >
      <Container>
        {/* Section Header */}
        <SectionTitle 
          title="Our Core Values" 
          subtitle="The foundational pillars that guide our commitment to luxury and heritage." 
          center={true} 
        />

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {values.map((val, index) => (
            <div 
              key={index}
              className="group relative flex flex-col justify-between h-full bg-white p-8 rounded-2xl border border-neutral-200/50 hover:border-secondary/20 shadow-xs hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
              role="article"
            >
              {/* Top micro gold line indicator on card hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl origin-left" />

              <div className="space-y-6">
                {/* Icon wrapper */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 text-neutral-900 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-500 border border-neutral-100 group-hover:border-secondary/20">
                  {val.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition-colors duration-300">
                    {val.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>

              {/* Decorative luxury detail at card bottom */}
              <div className="mt-8 pt-4 border-t border-neutral-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span>Core Pillar</span>
                <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BrandValues;
