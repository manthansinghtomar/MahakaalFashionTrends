import React from 'react';
import { FEATURES_CONFIG } from '@/constants/index.js';
import FeatureCard from './FeatureCard.jsx';

/**
 * Why Choose Us Section.
 * React Server Component (no 'use client' directive).
 * Maps over the features configuration in a responsive grid.
 */
export const WhyChooseUsSection = () => {
  return (
    <section 
      className="w-full bg-white py-20 border-b border-neutral-100"
      aria-labelledby="features-section-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            WHY SHOP WITH US
          </span>
          <h2 
            id="features-section-title"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900"
          >
            Why Customers Choose Mahakaal Fashion Trends
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            We offer quality men's clothing, accessories, and everyday fashion at affordable prices with a focus on customer satisfaction and trusted local service.
          </p>
        </div>

        {/* Features Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES_CONFIG.map((feature) => (
            <FeatureCard 
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;
