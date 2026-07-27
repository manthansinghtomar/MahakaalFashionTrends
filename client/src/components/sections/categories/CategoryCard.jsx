"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Category Card component.
 * Wraps the entire card inside a link matching `/products?category=${slug}`.
 * Images are formatted to a fixed 4:5 aspect ratio and animate on hover.
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
      className="group block bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-xs hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* Aspect Ratio 4:5 Image Wrapper */}
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
          <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-50 to-neutral-100/50">
            <div className="flex justify-between items-center">
              <span className="text-[9px] tracking-[0.2em] uppercase text-neutral-400 font-bold">
                MAHAKAAL
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            </div>
            
            <div className="my-auto py-6 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3 text-neutral-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                </svg>
              </div>
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                {name}
              </span>
            </div>
            
            <div className="text-[9px] text-neutral-400">
              Mahakaal Fashion Trends
            </div>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-6 flex flex-col space-y-3.5">
        <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition duration-300">
          {name}
        </h3>
        
        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed min-h-[40px]">
          {description}
        </p>

        {/* Visual-only Button CTA */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full pointer-events-none rounded-md uppercase tracking-wider text-xs font-semibold py-2.5 transition-all duration-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-transparent"
          >
            Explore Category
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
