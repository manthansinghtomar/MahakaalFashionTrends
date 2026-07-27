"use client";

import React, { useState, useEffect } from 'react';
import OfferBanner from './OfferBanner.jsx';

/**
 * Reusable Offer Carousel Component.
 * Rotates active offer banners every 3 seconds.
 * Automatically pauses rotation when hovered by user cursor.
 */
export const OfferCarousel = ({ offers = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automated 3-second timer - holds on mouse hover
  useEffect(() => {
    if (offers.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [offers.length, isHovered]);

  if (!offers || offers.length === 0) return null;

  const currentOffer = offers[currentIndex] || offers[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length);
  };

  return (
    <div
      className="relative group/carousel w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active Slide */}
      <div key={currentOffer._id || currentOffer.id || currentIndex} className="animate-fade-in transition-all duration-500">
        <OfferBanner offer={currentOffer} />
      </div>

      {/* Navigation controls if more than 1 offer */}
      {offers.length > 1 && (
        <>
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-950/75 hover:bg-neutral-950 text-white border border-neutral-800 shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 focus:outline-none"
            aria-label="Previous promotional offer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-950/75 hover:bg-neutral-950 text-white border border-neutral-800 shadow-xl flex items-center justify-center transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 focus:outline-none"
            aria-label="Next promotional offer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2.5 mt-6 z-20">
            {offers.map((off, idx) => (
              <button
                key={off._id || off.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                  idx === currentIndex
                    ? 'w-8 bg-amber-500 shadow-sm shadow-amber-500/50'
                    : 'w-2.5 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to offer slide ${idx + 1}`}
                title={off.title}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OfferCarousel;
