"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Reusable Offer/Campaign Card component.
 * Integrates image error boundaries (gold-neutral luxury CSS placeholder fallback).
 * Evaluates backend flags (status/isActive) and fallbacks to client date compares for status badges.
 */
export const OfferCard = ({ offer }) => {
  const { title, description, bannerImage, status, discountPercentage, startDate, endDate, isActive } = offer;
  const [imageError, setImageError] = useState(false);

  // 1. Evaluate Active vs. Expired status (prefer backend flags, fallback to date comparison)
  const isBackendInactive = status === 'inactive' || !isActive;
  const isDateExpired = endDate ? new Date(endDate) < new Date() : false;
  const isExpired = isBackendInactive || isDateExpired;

  // 2. Format validity dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const validityStr = `Valid: ${formatDate(startDate)} – ${formatDate(endDate)}`;

  // 3. Resolve Image URL
  const imageUrl = typeof bannerImage === 'object' && bannerImage ? bannerImage.url : bannerImage;
  const hasImage = imageUrl && !imageError;
  const isRemote = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

  return (
    <div 
      className={`group flex flex-col h-full bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${
        isExpired ? 'border-neutral-200 opacity-80' : 'border-neutral-100 hover:border-neutral-200'
      }`}
    >
      {/* Aspect Ratio 16:9 Image container */}
      <div className="relative w-full aspect-[16/9] bg-neutral-50 overflow-hidden border-b border-neutral-100">
        
        {/* Status Badge */}
        <span 
          className={`absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
            isExpired 
              ? 'bg-neutral-800 text-neutral-300' 
              : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'
          }`}
        >
          {isExpired ? 'Expired' : 'Active'}
        </span>

        {/* Discount Percentage Floating Badge */}
        <span className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-md text-[10px] font-bold bg-secondary text-neutral-950 uppercase tracking-widest">
          {discountPercentage}% OFF
        </span>

        {hasImage ? (
          <div className="w-full h-full relative flex items-center justify-center p-3 bg-neutral-950">
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center filter blur-xl opacity-30 scale-125 pointer-events-none"
            />
            <img
              src={imageUrl}
              alt={title}
              onError={() => setImageError(true)}
              className="relative z-1 max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105 drop-shadow-md rounded-lg"
              loading="lazy"
            />
          </div>
        ) : (
          /* Premium fallback gradient */
          <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white">
            <span className="text-[9px] font-bold tracking-[0.25em] text-secondary">
              MAHAKAAL EXCLUSIVE
            </span>
            <div className="my-auto py-2">
              <h4 className="text-xl font-bold tracking-tight text-white leading-tight">
                {title}
              </h4>
            </div>
            <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              {validityStr}
            </span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div className="space-y-2">
          {hasImage && (
            <h3 className="text-lg font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition duration-300">
              {title}
            </h3>
          )}
          <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Date validity block */}
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-auto pt-2">
          {validityStr}
        </div>

        {/* CTA Explore Button */}
        <div className="pt-2">
          <Link
            href={offer.product && typeof offer.product === 'object' && offer.product.slug ? `/products/${offer.product.slug}` : '/products'}
            passHref
            className="focus:outline-none"
          >
            <Button
              variant="outline"
              size="sm"
              disabled={isExpired}
              className="w-full rounded-md uppercase tracking-wider text-xs font-semibold py-2.5 transition-all duration-300 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400 disabled:hover:border-neutral-200"
            >
              {isExpired ? 'Offer Ended' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
