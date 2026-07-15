import React from 'react';
import Image from 'next/image';

/**
 * Hero Image component supporting both local and remote (Cloudinary, backend CDN) paths.
 */
export const HeroImage = ({ src, alt, badge, className = '' }) => {
  if (!src) {
    // Elegant fallback block if no image is present
    return (
      <div className={`w-full aspect-[4/3] rounded-lg border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center ${className}`}>
        <span className="text-xs uppercase tracking-wider text-neutral-400">
          No Banner Selected
        </span>
      </div>
    );
  }

  // Detect remote Cloudinary, unsplash, or server API URLs
  const isRemote = src.startsWith('http://') || src.startsWith('https://');

  return (
    <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 shadow-sm transition-all duration-500 hover:shadow-md ${className}`}>
      {/* Optional promotional badge overlay */}
      {badge && (
        <span className="absolute top-4 left-4 z-10 bg-secondary text-neutral-950 text-[10px] font-bold tracking-widest uppercase px-3 py-1 shadow-sm select-none">
          {badge}
        </span>
      )}
      
      {isRemote ? (
        <img
          src={src}
          alt={alt || 'Mahakaal Fashion Trends Editorial Collection'}
          className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          loading="eager"
        />
      ) : (
        <Image
          src={src}
          alt={alt || 'Mahakaal Fashion Trends Editorial Collection'}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-700 hover:scale-105"
        />
      )}
    </div>
  );
};

export default HeroImage;
