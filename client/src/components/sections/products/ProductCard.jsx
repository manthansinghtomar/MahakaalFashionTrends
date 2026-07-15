import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button.jsx';
import ProductPrice from './ProductPrice.jsx';
import ProductBadge from './ProductBadge.jsx';

/**
 * Reusable Product Card component.
 * Receives the full product object as a prop.
 * Styled in equal-height flex container with clamped titles and a 4:5 image.
 */
export const ProductCard = ({
  product,
  // Future-ready placeholder action overrides
  onWishlistToggle = null,
  onAddToCart = null,
  onQuickView = null,
  onCompare = null,
}) => {
  const {
    name,
    slug,
    image,
    price,
    originalPrice,
    discountPercentage,
    category,
    rating,
    reviewCount,
    isNew,
    isBestSeller,
    stock = 0,
  } = product;

  if (!slug) return null;

  // Support local relative paths and remote CDN/Cloudinary URLs dynamically
  const isRemote = image && (image.startsWith('http://') || image.startsWith('https://'));

  // Resolve populated category objects to name string safely
  const categoryName = typeof category === 'object' && category ? category.name : category;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col h-full bg-white rounded-lg border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* 1. Image Aspect Ratio 4:5 Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100 flex-shrink-0">
        
        {/* Optional absolute badges (New / Bestseller) */}
        <ProductBadge isNew={isNew} isBestSeller={isBestSeller} />

        {/* Future-ready Wishlist trigger placeholder (Hidden for now) */}
        {/*
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onWishlistToggle) onWishlistToggle(product);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white shadow-sm border border-neutral-100 hover:text-red-500 transition-colors"
          aria-label="Add to wishlist"
        >
          <HeartIcon className="h-4 w-4" />
        </button>
        */}

        {image ? (
          isRemote ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg
              className="h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* 2. Content Details Wrapper */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Category Label */}
        {categoryName && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1.5">
            {categoryName}
          </span>
        )}

        {/* Clamped Title (Max 2 lines to avoid layout shift) */}
        <h3 className="text-[15px] font-bold text-neutral-900 leading-snug tracking-tight group-hover:text-secondary transition duration-300 line-clamp-2 min-h-[40px] mb-2">
          {name}
        </h3>

        {/* Rating Value & Review Count Summary */}
        {rating && (
          <div className="flex items-center gap-1 text-xs text-neutral-500 mb-4 font-medium">
            <span className="text-amber-500">★</span>
            <span className="text-neutral-800">{rating.toFixed(1)}</span>
            <span className="text-neutral-400">({reviewCount})</span>
          </div>
        )}

        {/* Price and Action Section (Pushed to bottom) */}
        <div className="mt-auto pt-4 flex flex-col space-y-4">
          
          {/* Price Layout */}
          <ProductPrice
            price={price}
            originalPrice={originalPrice}
            discountPercentage={discountPercentage}
          />

          {/* Reusable Visual Button (Clicks bubble up to parent card link) */}
          <Button
            variant="outline"
            size="sm"
            className="w-full pointer-events-none rounded-md uppercase tracking-wider text-xs font-semibold py-2.5 transition-all duration-300 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-transparent"
          >
            View Details
          </Button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
