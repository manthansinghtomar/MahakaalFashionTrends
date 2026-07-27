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
          {/* Star (Quality Products) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.116.488-.415.871-.84.61l-4.722-2.885a.563.563 0 00-.586 0L6.982 20.54c-.426.26-.957-.123-.841-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.32-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case 'pricing':
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
          {/* Tag / Currency (Affordable Prices) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      );
    case 'collection':
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
          {/* Shopping Bag / Apparel Collection (Wide Collection) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
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
          {/* Handshake / Support (Trusted Customer Service) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a5.97 5.97 0 00-.942 3.198m0 0A9.093 9.093 0 012.25 18.24a3 3 0 014.682-2.72C8.167 14.153 10.01 13.5 12 13.5c1.99 0 3.833.653 5.318 1.02" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 6a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * Premium Feature Card.
 * Displays SVG icon with secondary gold accents and clean layout.
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

      {/* Decorative accent at card bottom */}
      <div className="mt-8 pt-4 border-t border-neutral-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span>Mahakaal Promise</span>
        <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;
