import React from 'react';
import Image from 'next/image';

export const Logo = ({ 
  className = '', 
  imgSize = 'w-12 h-12', 
  showText = true,
  variant = 'light' // 'light' for light backgrounds (dark text), 'dark' for dark backgrounds (light text)
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* High resolution circular brand logo image */}
      <div className={`relative ${imgSize} rounded-full overflow-hidden border border-amber-500/40 shadow-sm flex-shrink-0 bg-black transition-transform duration-300 group-hover:scale-105`}>
        <img
          src="/logos/logo.jpg"
          alt="Mahakaal Fashion Trends Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-none flex-grow">
          <span className={`text-base font-bold tracking-[0.18em] ${isDark ? 'text-white' : 'text-neutral-950'}`}>
            MAHAKAAL
          </span>
          <span className={`text-[11px] font-semibold tracking-[0.22em] uppercase mt-0.5 ${isDark ? 'text-amber-400' : 'text-neutral-500'}`}>
            Fashion Trends
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

