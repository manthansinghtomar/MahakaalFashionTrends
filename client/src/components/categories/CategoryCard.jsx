"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Category Card component.
 * Mobile (< 640px): Compact 2-column card matching ProductCard layout with equal heights,
 * fixed 4:5 image aspect ratio, line-clamped text, and bottom-aligned CTA button.
 */
export const CategoryCard = ({ category }) => {
  const { name, slug, image, description, productCount } = category || {};
  const [imageError, setImageError] = useState(false);

  if (!slug) return null;

  // Resolve category image path
  const imageUrl = typeof image === 'object' && image ? image.url : image;
  const hasImage = imageUrl && !imageError;

  return (
    <Link
      href={`/products?category=${slug}`}
      className="group flex flex-col h-full w-full bg-white rounded-xl sm:rounded-2xl border border-neutral-100/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* Aspect Ratio Image Wrapper (Fixed 4:5 aspect ratio) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100/70 flex-shrink-0">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Fallback Graphic */
          <div className="w-full h-full flex flex-col justify-between p-3 sm:p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50">
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-bold">
                MAHAKAAL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            
            <div className="my-auto py-3 text-center flex flex-col items-center">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-2 text-neutral-400">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.22 15M19.5 3.375c0-1.036-.84-1.875-1.875-1.875H5.25A1.875 1.875 0 003.375 3.375v17.25c0 1.035.84 1.875 1.875 1.875h12.375c1.036 0 1.875-.84 1.875-1.875V3.375z" />
                </svg>
              </div>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Collection
              </span>
            </div>
            
            <div className="text-[9px] text-neutral-400">
              Handcrafted fits
            </div>
          </div>
        )}

        {/* Dynamic Product Count Badge */}
        {productCount !== undefined && productCount !== null && (
          <span className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold bg-neutral-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
            {productCount} {productCount === 1 ? 'Item' : 'Items'}
          </span>
        )}
      </div>

      {/* Content details wrapper */}
      <div className="p-2.5 sm:p-5 flex flex-col flex-grow justify-between text-left">
        <div className="space-y-1 sm:space-y-1.5">
          <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary leading-tight">
            CATEGORY
          </span>
          <h3 className="text-xs sm:text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition duration-300 line-clamp-1">
            {name}
          </h3>
          
          {description && (
            <p className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Explore CTA (Pinned at bottom) */}
        <div className="mt-auto pt-2.5 sm:pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full min-h-[34px] sm:min-h-[40px] pointer-events-none rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2.5 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent flex items-center justify-center"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
