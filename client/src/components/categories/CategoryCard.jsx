"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Category Card component.
 * Features stateful image error fallback to a premium CSS placeholder.
 * Navigates to `/products?category=<slug>`.
 */
export const CategoryCard = ({ category }) => {
  const { name, slug, image, description, productCount } = category;
  const [imageError, setImageError] = useState(false);

  if (!slug) return null;

  // Resolve category image path
  const imageUrl = typeof image === 'object' && image ? image.url : image;
  const hasImage = imageUrl && !imageError;
  const isRemote = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  return (
    <Link
      href={`/products?category=${slug}`}
      className="group block bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* Aspect Ratio 4:5 Image wrapper */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100">
        {hasImage ? (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Premium Fallback Graphic */
          <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50">
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-bold">
                MAHAKAAL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            
            <div className="my-auto py-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3 text-neutral-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122A3 3 0 00.22 15M19.5 3.375c0-1.036-.84-1.875-1.875-1.875H5.25A1.875 1.875 0 003.375 3.375v17.25c0 1.035.84 1.875 1.875 1.875h12.375c1.036 0 1.875-.84 1.875-1.875V3.375z" />
                </svg>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                Collection
              </span>
            </div>
            
            <div className="text-[9px] text-neutral-400">
              Handcrafted fits
            </div>
          </div>
        )}

        {/* Dynamic Product Count Badge (Only if available in database query) */}
        {productCount !== undefined && productCount !== null && (
          <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold bg-neutral-900/80 backdrop-blur-xs text-white uppercase tracking-wider">
            {productCount} {productCount === 1 ? 'Item' : 'Items'}
          </span>
        )}
      </div>

      {/* Content wrapper */}
      <div className="p-6 flex flex-col space-y-3">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition duration-300">
          {name}
        </h3>
        
        {description && (
          <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed min-h-[40px]">
            {description}
          </p>
        )}

        {/* Explore CTA */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full pointer-events-none rounded-md uppercase tracking-wider text-xs font-semibold py-2.5 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent"
          >
            Explore Collection
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
