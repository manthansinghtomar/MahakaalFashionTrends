import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button.jsx';
import ProductPrice from './ProductPrice.jsx';

/**
 * Reusable Product Card component.
 * Compact 2-column mobile layout with equal-height cards, locked image aspect ratio (4:5),
 * category tag on left, bestseller/new status badge on right, 2-line clamped titles,
 * and bottom-aligned View Details button.
 */
export const ProductCard = ({
  product,
  // Optional action overrides
  onWishlistToggle = null,
  onAddToCart = null,
  onQuickView = null,
  onCompare = null,
}) => {
  const {
    name,
    slug,
    image,
    images = [],
    price,
    originalPrice,
    discountPercentage,
    category,
    description,
    isNew,
    isBestSeller,
    newArrival,
    bestSeller,
    stock,
    status,
  } = product || {};

  if (!slug) return null;

  const displayImage = image || images[0]?.url || '';
  const isRemote = displayImage && (displayImage.startsWith('http://') || displayImage.startsWith('https://'));
  const categoryName = typeof category === 'object' && category ? category.name : category;
  const isNewItem = isNew || newArrival;
  const isBestItem = isBestSeller || bestSeller;
  const isOutOfStock = stock === 0 || status === 'outofstock';
  const hasDescription = typeof description === 'string' && description.trim().length > 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col h-full w-full bg-white rounded-xl sm:rounded-2xl border border-neutral-100/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-neutral-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
    >
      {/* 1. Image Container (Fixed 4:5 aspect ratio across all cards, clean without image overlay badges) */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-50 border-b border-neutral-100/70 flex-shrink-0">
        {displayImage ? (
          isRemote ? (
            <img
              src={displayImage}
              alt={name || 'Product Image'}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <Image
              src={displayImage}
              alt={name || 'Product Image'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <svg
              className="h-10 w-10 sm:h-12 sm:w-12"
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
      <div className="p-2.5 sm:p-5 flex flex-col flex-grow justify-between text-left">
        
        <div className="space-y-1 sm:space-y-1.5">
          {/* Category & Status Badge Row */}
          {(categoryName || isBestItem || isNewItem || isOutOfStock) && (
            <div className="flex flex-wrap items-center justify-between gap-1 leading-tight">
              {categoryName ? (
                <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/5 border border-secondary/15 px-2 py-0.5 rounded-md">
                  {categoryName}
                </span>
              ) : <div />}

              {isOutOfStock ? (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-red-500">
                  Out of Stock
                </span>
              ) : isBestItem ? (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-600">
                  Bestseller
                </span>
              ) : isNewItem ? (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  New Arrival
                </span>
              ) : null}
            </div>
          )}

          {/* Clamped Title */}
          <h3 className="text-xs sm:text-[15px] font-bold text-neutral-900 leading-snug tracking-tight group-hover:text-secondary transition duration-300 line-clamp-2">
            {name}
          </h3>

          {/* Product Description */}
          {hasDescription && (
            <p className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1 leading-relaxed">
              {description.trim()}
            </p>
          )}
        </div>

        {/* Price and CTA Section (Pushed to bottom via mt-auto) */}
        <div className="mt-auto pt-2.5 sm:pt-4 flex flex-col space-y-2 sm:space-y-3">
          
          {/* Price Layout */}
          <ProductPrice
            price={price}
            originalPrice={originalPrice}
            discountPercentage={discountPercentage}
          />

          {/* View Details Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full min-h-[34px] sm:min-h-[40px] pointer-events-none rounded-md uppercase tracking-wider text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2.5 transition-all duration-300 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-transparent flex items-center justify-center"
          >
            View Details
          </Button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;
