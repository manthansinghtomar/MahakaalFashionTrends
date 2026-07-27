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
      title: 'Quality Products',
      description: 'We carefully select clothing that offers comfort, durability, and everyday style so our customers always get the best value for their money.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Quality Shield Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Affordable Pricing',
      description: "We believe everyone deserves stylish fashion. That's why we focus on offering quality products at reasonable, budget-friendly prices.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Tag / Price Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1 1 0 01.707.293l7 7a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-7-7A1 1 0 017 9V3z" />
        </svg>
      ),
    },
    {
      title: 'Customer Satisfaction',
      description: 'Helping every customer find the right fit, size, and style with a smooth, friendly, and welcoming shopping experience.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Smile / Satisfaction Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Wide Collection',
      description: 'From kids to teenagers and adults, explore casual, formal, and everyday fashion options all in one convenient place.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Collection Grid Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
          subtitle="The values that guide how we serve every customer at Mahakaal Fashion Trends." 
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
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BrandValues;
