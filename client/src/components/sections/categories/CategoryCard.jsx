"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Category Card component for Homepage Sections.
 * Mobile (< 640px): Compact 2-column card matching ProductCard layout with equal heights,
 * fixed 4:5 image aspect ratio, line-clamped text, and bottom-aligned CTA button.
 */
export const CategoryCard = ({ category }) => {
  const { name, slug, image, description } = category || {};
  const [imageError, setImageError] = useState(false);

  if (!slug) return null;

  // Support image as string or object { url, public_id } from DB
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
              </div>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                {name}
              </span>
            </div>
            
            <div className="text-[9px] text-neutral-400">
              Mahakaal Fashion Trends
            </div>
          </div>
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

        {/* Visual-only Button CTA */}
        <div className="mt-auto pt-2.5 sm:pt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full min-h-[34px] sm:min-h-[40px] pointer-events-none rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2.5 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent flex items-center justify-center"
          >
            Explore Category
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
