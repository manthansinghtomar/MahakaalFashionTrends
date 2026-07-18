import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Premium Offer Banner component.
 * Displays a two-column promotional banner:
 * - Left: Offer Title, Description, Discount Percentage, Validity dates, Shop Now button.
 * - Right: Banner image from Cloudinary or a premium local placeholder.
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
    <div className="relative w-full overflow-hidden rounded-3xl bg-neutral-950 text-white shadow-2xl border border-neutral-900 group">
      
      {/* Decorative background grid pattern for luxury feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/15 via-transparent to-transparent pointer-events-none opacity-80" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
        {/* Left Column: Promotion Copy and Action */}
        <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative z-10 space-y-8">
          
          <div className="space-y-4">
            {/* Elegant Tag / Badge */}
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

        {/* Right Column: Promotional Image / Falls back to custom design */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full w-full overflow-hidden bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-900">
          {hasBannerImage ? (
            <img
              src={bannerImage.url}
              alt={title || 'Special Promotion Banner'}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Premium Local Fallback Banner */
            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br from-neutral-900 via-neutral-950 to-secondary/20">
              
              {/* Top brand accent */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
                  MAHAKAAL
                </span>
                <span className="w-2 h-2 rounded-full bg-secondary" />
              </div>

              {/* Central Premium Graphic Badge */}
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full border border-neutral-800 flex items-center justify-center mb-4 bg-neutral-950/60 shadow-lg group-hover:border-secondary/30 transition-colors duration-500">
                  <span className="text-2xl font-black text-secondary tracking-tighter">
                    {discountPercentage}%
                  </span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-300">
                  EXCLUSIVE DEAL
                </span>
                <span className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                  Premium Kurtas & Ethnic Wear
                </span>
              </div>

              {/* Bottom detail */}
              <div className="text-[10px] text-neutral-500 tracking-wider">
                &copy; {new Date().getFullYear()} Mahakaal Fashion Trends
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;
