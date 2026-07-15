import React from 'react';

/**
 * Reusable branding Logo component.
 */
export const Logo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Temporary Logo Icon/SVG on the left */}
      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-950 text-white font-bold text-xs tracking-wider border border-neutral-800 flex-shrink-0 select-none">
        M
      </div>
      {/* Full Brand Name in two lines on the right */}
      <div className="flex flex-col text-left leading-none flex-grow">
        <span className="text-sm font-bold tracking-[0.18em] text-neutral-950">
          MAHAKAAL
        </span>
        <span className="text-[8px] font-medium tracking-[0.25em] text-neutral-400 mt-0.5 uppercase">
          Fashion Trends
        </span>
      </div>
    </div>
  );
};

export default Logo;
