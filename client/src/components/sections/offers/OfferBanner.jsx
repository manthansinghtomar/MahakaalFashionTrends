import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Premium Offer Banner component.
 * Displays a continuous solid black promotional banner:
 * - Left: Offer Title, Description, Discount Percentage, Validity dates, Shop Now button.
 * - Right: Banner image or clean truthful placeholder icon if no banner is available.
 */
export const OfferBanner = ({ offer }) => {
  if (!offer) return null;

  const { title, description, discountPercentage, startDate, endDate, bannerImage } = offer;
  const [imageError, setImageError] = useState(false);

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);

  // Check if remote banner image is available and valid
  const hasBannerImage = bannerImage && bannerImage.url && !imageError && !bannerImage.url.includes('example.com');

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-black text-white shadow-2xl border border-neutral-900 group">
      
      {/* Decorative subtle ambient pattern on solid black */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Column: Promotion Copy and Action */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 space-y-8">
          
          <div className="space-y-4">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                Limited Time Campaign
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl">
              {description}
            </p>
          </div>

          {/* Discount and Date highlight row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 py-4 border-t border-b border-neutral-900">
            {/* Discount Badge */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary tracking-tight">
                {discountPercentage}%
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                OFF
              </span>
            </div>

            {/* Validity Range */}
            {formattedStart && formattedEnd && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-secondary">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Offer Validity
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-neutral-200">
                    {formattedStart} &mdash; {formattedEnd}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Shop Now Action Button */}
          <div className="pt-2">
            <Link href="/products" passHref className="focus:outline-none">
              <Button
                variant="outline"
                className="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] border-white text-white hover:bg-white hover:text-neutral-950 hover:border-transparent transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
                aria-label={`Shop products under the ${title} promotion`}
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Solid Black Background Container for Banner Image or Clean Placeholder */}
        <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full w-full overflow-hidden bg-black flex items-center justify-center p-5 sm:p-7 lg:p-8">
          {hasBannerImage ? (
            <img
              src={bannerImage.url}
              alt={title || 'Special Promotion Banner'}
              className="relative z-10 max-w-full max-h-[430px] w-auto h-auto object-contain object-center transition-transform duration-700 group-hover:scale-105 rounded-xl"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Clean Truthful Placeholder Icon */
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center text-neutral-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                No Banner Available
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
