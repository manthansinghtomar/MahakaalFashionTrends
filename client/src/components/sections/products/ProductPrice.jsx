import React from 'react';
import { formatRupees } from '@/utils/currency.js';

/**
 * Renders e-commerce price layouts.
 * Supports current price, original price (line-through), and discount badges.
 * Responsive sizing: compact for mobile 2-column grids, original size for tablet/desktop.
 */
export const ProductPrice = ({
  price,
  originalPrice,
  discountPercentage,
  className = '',
}) => {
  const hasDiscount = Boolean(originalPrice && originalPrice > price);

  return (
    <div className={`flex flex-wrap items-baseline gap-1.5 sm:gap-2.5 ${className}`}>
      {/* Current/Discounted Price */}
      <span className="text-xs sm:text-base font-extrabold text-neutral-950">
        ₹{formatRupees(price)}
      </span>

      {/* Original price (cross-lined) */}
      {hasDiscount && (
        <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-medium">
          ₹{formatRupees(originalPrice)}
        </span>
      )}

      {/* Discount Tag */}
      {hasDiscount && discountPercentage && (
        <span className="text-[9px] sm:text-xs text-secondary font-bold tracking-wider">
          ({discountPercentage}% OFF)
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
