"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Premium Product Gallery component.
 * Displays a large main image and a list of thumbnails (if multiple exist).
 * Handles thumbnail click swapping with smooth transition animations.
 */
export const ProductGallery = ({ images = [], defaultImage = '' }) => {
  // 1. Safely normalize and filter valid image URLs
  const galleryImages = React.useMemo(() => {
    let list = [];
    if (Array.isArray(images) && images.length > 0) {
      list = images
        .map(img => (typeof img === 'string' ? { url: img } : img))
        .filter(img => img && typeof img.url === 'string' && img.url.trim() !== '');
    }
    if (list.length === 0 && typeof defaultImage === 'string' && defaultImage.trim() !== '') {
      list = [{ url: defaultImage.trim() }];
    }
    return list;
  }, [images, defaultImage]);

  // 2. Default activeImage to null (NEVER empty string "") to prevent Next.js empty src warnings
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

  // 4. Strict Guard: If no valid non-empty activeImage exists, render fallback container only
  if (!activeImage || typeof activeImage !== 'string' || activeImage.trim() === '') {
    return (
      <div className="w-full aspect-[4/5] rounded-3xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100">
        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const validSrc = activeImage.trim();
  const isRemote = validSrc.startsWith('http://') || validSrc.startsWith('https://');

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Display Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-xs flex-shrink-0 group">
        {isRemote ? (
          <img
            src={validSrc}
            alt="Product Display Detail"
            className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-102"
            loading="eager"
          />
        ) : (
          <Image
            src={validSrc}
            alt="Product Display Detail"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-700 hover:scale-102"
          />
        )}
      </div>

      {/* 2. Thumbnails Row (Only render if there are multiple valid images) */}
      {galleryImages.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {galleryImages.map((img, idx) => {
            const url = img?.url?.trim();
            if (!url) return null;

            const isSelected = url === validSrc;
            const isThumbRemote = url.startsWith('http://') || url.startsWith('https://');
            
            return (
              <button
                key={idx}
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
    </div>
  );
};

export default ProductGallery;
