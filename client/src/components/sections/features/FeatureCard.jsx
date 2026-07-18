import React from 'react';

/**
 * Maps feature icon strings to custom inline SVG icons.
 * Keeps constants clean and components functional.
 */
const FeatureIcon = ({ iconKey, className = 'w-6 h-6' }) => {
  switch (iconKey) {
    case 'quality':
      return (
        <svg 
          className={className} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Crown (Sartorial Excellence) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 12h12l3-12-5 4-4-6-4 6-5-4z M6 18c0 1.1.9 2 2 2h8a2 2 0 002-2" />
        </svg>
      );
    case 'tailoring':
      return (
        <svg 
          className={className} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Scissors (Bespoke Precision) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6a3 3 0 100 6 3 3 0 000-6z M18 6a3 3 0 100 6 3 3 0 000-6z M14.5 12.5L9 18 M9.5 12.5L15 18" />
        </svg>
      );
    case 'delivery':
      return (
        <svg 
          className={className} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Isometric Box/Package (Privileged Handling) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7.5L12 3 4 7.5M20 7.5v9L12 21M20 7.5L12 12M4 7.5v9L12 21M4 7.5L12 12 M12 12v9" />
        </svg>
      );
    case 'support':
      return (
        <svg 
          className={className} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Headset (Style Concierge) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3 M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Premium Feature Card.
 * Displays SVG icon with secondary gold accents and luxurious layout.
 * Leverages hover translations and equal-height layout.
 */
export const FeatureCard = ({ title, description, icon }) => {
  return (
    <div 
      className="group relative flex flex-col justify-between h-full bg-white p-8 rounded-2xl border border-neutral-100 hover:border-secondary/20 shadow-xs hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
      role="article"
    >
      {/* Top micro gold line indicator on card hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl origin-left" />

      <div className="space-y-6">
        {/* Icon wrapper */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-50 text-neutral-900 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-500 border border-neutral-100 group-hover:border-secondary/20">
          <FeatureIcon iconKey={icon} className="w-5 h-5" />
        </div>

        {/* Feature content */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative luxury accent at card bottom */}
      <div className="mt-8 pt-4 border-t border-neutral-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span>Exclusive Detail</span>
        <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;
