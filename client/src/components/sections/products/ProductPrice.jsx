import React from 'react';

/**
 * Renders e-commerce price layouts.
 * Supports current price, original price (line-through), and discount badges.
 */
export const ProductPrice = ({
  price,
  originalPrice,
  discountPercentage,
  className = '',
}) => {
  // Format numbers with commas (e.g. 18,999)
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className={`flex flex-wrap items-baseline gap-2.5 ${className}`}>
      {/* Current/Discounted Price */}
      <span className="text-base font-bold text-neutral-950">
        ₹{formatPrice(price)}
      </span>

      {/* Original price (cross-lined) */}
      {hasDiscount && (
        <span className="text-xs text-neutral-400 line-through">
          ₹{formatPrice(originalPrice)}
        </span>
      )}

      {/* Discount Tag */}
      {hasDiscount && discountPercentage && (
        <span className="text-xs text-secondary font-semibold tracking-wider">
          ({discountPercentage}% OFF)
        </span>
      )}
    </div>
  );
};

export default ProductPrice;
