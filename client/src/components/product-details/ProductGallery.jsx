"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Premium Product Gallery component.
 * Mobile (< 640px): Tap main image to open interactive Lightbox Zoom Modal with Zoom In (+), Zoom Out (-), and double-tap zoom.
 * Desktop (>= 640px): Clean static presentation, no popup.
 */
export const ProductGallery = ({ images = [], defaultImage = '' }) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  // 1. Safely normalize, filter, and deduplicate valid image URLs
  const galleryImages = React.useMemo(() => {
    let list = [];
    if (Array.isArray(images) && images.length > 0) {
      list = images
        .map(img => (typeof img === 'string' ? img.trim() : img?.url?.trim()))
        .filter(url => typeof url === 'string' && url.length > 0);
    }
    if (list.length === 0 && typeof defaultImage === 'string' && defaultImage.trim() !== '') {
      list = [defaultImage.trim()];
    }
    
    // Deduplicate to ensure only unique image URLs exist in gallery
    const uniqueUrls = Array.from(new Set(list));
    return uniqueUrls.map(url => ({ url }));
  }, [images, defaultImage]);

  // 2. Default activeImage state
  const [activeImage, setActiveImage] = useState(() => {
    return galleryImages.length > 0 ? galleryImages[0].url : null;
  });

  // 3. Keep activeImage in sync when props change
  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0].url);
    } else {
      setActiveImage(null);
    }
  }, [galleryImages]);

  // Reset zoom scale whenever modal state or active image changes
  useEffect(() => {
    setZoomScale(1);
  }, [isZoomOpen, activeImage]);

  // Handle ESC key to close full-screen zoom modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomOpen]);

  // 4. Strict Guard: If no valid non-empty activeImage exists, render fallback container only
  if (!activeImage || typeof activeImage !== 'string' || activeImage.trim() === '') {
    return (
      <div className="w-full aspect-[4/5] rounded-3xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100">
        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const validSrc = activeImage.trim();
  const isRemote = validSrc.startsWith('http://') || validSrc.startsWith('https://');

  // Find index of currently active image
  const currentIndex = galleryImages.findIndex(img => img?.url?.trim() === validSrc);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (galleryImages.length <= 1) return;
    const prevIdx = currentIndex <= 0 ? galleryImages.length - 1 : currentIndex - 1;
    setActiveImage(galleryImages[prevIdx].url);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (galleryImages.length <= 1) return;
    const nextIdx = (currentIndex + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIdx].url);
  };

  // Open modal only on mobile screens (< 640px)
  const handleMainImageClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsZoomOpen(true);
      setZoomScale(1);
    }
  };

  // Determine if multiple distinct images exist
  const hasMultipleImages = galleryImages.length > 1;

  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleToggleZoom = (e) => {
    e.stopPropagation();
    setZoomScale(prev => (prev > 1 ? 1 : 2));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Display Image Container */}
      <div 
        onClick={handleMainImageClick}
        className="relative w-full max-w-lg mx-auto min-h-[380px] sm:min-h-0 aspect-[4/5] sm:aspect-[4/4.2] rounded-3xl overflow-hidden bg-neutral-50/80 border border-neutral-100 shadow-xs flex items-center justify-center p-0 flex-shrink-0 group cursor-pointer sm:cursor-default"
      >
        {isRemote ? (
          <img
            src={validSrc}
            alt="Product Display Detail"
            className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-105"
            loading="eager"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={validSrc}
              alt="Product Display Detail"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-700 hover:scale-105"
            />
          </div>
        )}

        {/* Mobile-Only Zoom Hint Badge */}
        <div className="sm:hidden absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-neutral-950/70 text-white text-[10px] font-semibold tracking-wider backdrop-blur-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
          <span>Tap to Zoom</span>
        </div>

        {/* Carousel Navigation Buttons (Render ONLY when more than 1 image exists) */}
        {hasMultipleImages && (
          <>
            {/* Previous Image Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-neutral-800 shadow-md backdrop-blur-xs border border-neutral-200/80 transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95 z-10"
              aria-label="Previous image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Image Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/85 hover:bg-white text-neutral-800 shadow-md backdrop-blur-xs border border-neutral-200/80 transition-all duration-200 focus:outline-none hover:scale-110 active:scale-95 z-10"
              aria-label="Next image"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 2. Thumbnails Row (Render ONLY when more than 1 image exists) */}
      {hasMultipleImages && (
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {galleryImages.map((img, idx) => {
            const url = img?.url?.trim();
            if (!url) return null;

            const isSelected = url === validSrc;
            const isThumbRemote = url.startsWith('http://') || url.startsWith('https://');
            
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(url)}
                className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden bg-neutral-50 border transition-all duration-300 outline-none ${
                  isSelected 
                    ? 'border-secondary ring-2 ring-secondary/20 scale-95 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-400 hover:scale-98'
                }`}
                aria-label={`Show image details ${idx + 1}`}
              >
                {isThumbRemote ? (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover object-center"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Mobile-Only Interactive Image Zoom Lightbox Modal */}
      {isZoomOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 animate-fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          {/* Top Bar: Close Button */}
          <div className="w-full flex justify-between items-center z-50 pt-2 px-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Image Zoom ({Math.round(zoomScale * 100)}%)
            </span>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none"
              aria-label="Close zoom view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Center Image Container with Scale Zoom */}
          <div 
            className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden my-auto cursor-zoom-in"
            onClick={handleToggleZoom}
          >
            <img
              src={validSrc}
              alt="Zoomed product detail"
              style={{ transform: `scale(${zoomScale})` }}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-transform duration-300 origin-center"
            />
          </div>

          {/* Bottom Control Bar: Zoom In (+), Zoom Out (-), Prev/Next */}
          <div className="w-full max-w-sm flex items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-full z-50 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
            {/* Zoom Out Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 1}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white transition-all"
              aria-label="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            {/* Reset Zoom Button */}
            <button
              type="button"
              onClick={() => setZoomScale(1)}
              className="text-xs font-bold text-neutral-300 hover:text-white px-3 py-1 uppercase tracking-wider"
            >
              {Math.round(zoomScale * 100)}% Reset
            </button>

            {/* Zoom In Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 3}
              className="p-2 rounded-full bg-secondary text-neutral-950 font-bold hover:bg-amber-400 disabled:opacity-40 transition-all"
              aria-label="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
