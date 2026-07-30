import React from 'react';
import { formatRupees } from '@/utils/currency.js';

/**
 * Premium Price renderer for the Product Details page.
 * Displays selling price, strikethrough original price, and gold discount percentage badge.
 */
export const ProductPrice = ({ price, originalPrice, discountPercentage }) => {
  const numPrice = Number(price);
  const numOriginal = Number(originalPrice);
  const hasDiscount = Boolean(
    !isNaN(numOriginal) && 
    !isNaN(numPrice) && 
    numOriginal > numPrice
  );

  const calculatedDiscount = hasDiscount && numOriginal > 0
    ? Math.round(((numOriginal - numPrice) / numOriginal) * 100)
    : 0;

  const displayDiscount = discountPercentage || calculatedDiscount;

  if (price === undefined || price === null || isNaN(numPrice)) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-1">
      {/* Active Selling Price */}
      <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
        ₹{formatRupees(price)}
      </span>

      {/* Discount Comparison details */}
      {hasDiscount && (
        <div className="flex items-center gap-3">
          {/* Strikethrough Original Price */}
          <span className="text-base sm:text-lg text-neutral-400 line-through font-medium">
            ₹{formatRupees(originalPrice)}
          </span>

          {/* Discount Percentage badge */}
          {displayDiscount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 border border-secondary/20 text-secondary uppercase tracking-wider">
              {displayDiscount}% OFF
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
