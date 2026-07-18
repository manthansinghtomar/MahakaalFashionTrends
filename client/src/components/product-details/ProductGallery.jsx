"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Premium Product Gallery component.
 * Displays a large main image and a list of thumbnails (if multiple exist).
 * Handles thumbnail click swapping with smooth transition animations.
 */
export const ProductGallery = ({ images = [], defaultImage = '' }) => {
  // Normalize images list (handle case where images array is empty but single defaultImage is provided)
  const galleryImages = images.length > 0 
    ? images 
    : defaultImage 
      ? [{ url: defaultImage }] 
      : [];

  const [activeImage, setActiveImage] = useState('');

  // Sync active image when product details change
  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImage(galleryImages[0].url);
    } else {
      setActiveImage('');
    }
  }, [images, defaultImage]);

  if (galleryImages.length === 0) {
    return (
      <div className="w-full aspect-[4/5] rounded-3xl bg-neutral-50 flex items-center justify-center text-neutral-300 border border-neutral-100">
        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  const isRemote = activeImage.startsWith('http://') || activeImage.startsWith('https://');

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Main Display Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100 shadow-xs flex-shrink-0 group">
        {isRemote ? (
          <img
            src={activeImage}
            alt="Product Display Detail"
            className="w-full h-full object-cover object-center transition-all duration-700 hover:scale-102"
            loading="eager"
          />
        ) : (
          <Image
            src={activeImage}
            alt="Product Display Detail"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-all duration-700 hover:scale-102"
          />
        )}
      </div>

      {/* 2. Thumbnails Row (Only render if there are multiple images) */}
      {galleryImages.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 mt-2">
          {galleryImages.map((img, idx) => {
            const isSelected = img.url === activeImage;
            const isThumbRemote = img.url.startsWith('http://') || img.url.startsWith('https://');
            
            return (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`relative w-20 aspect-[4/5] rounded-xl overflow-hidden bg-neutral-50 border transition-all duration-300 outline-none ${
                  isSelected 
                    ? 'border-secondary ring-2 ring-secondary/20 scale-95 shadow-sm' 
                    : 'border-neutral-200 hover:border-neutral-400 hover:scale-98'
                }`}
                aria-label={`Show image details ${idx + 1}`}
              >
                {isThumbRemote ? (
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={img.url}
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
