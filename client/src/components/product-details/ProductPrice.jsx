import React from 'react';

/**
 * Premium Price renderer for the Product Details page.
 * Displays sale price, strikethrough original price, and gold discount percentage badge.
 */
export const ProductPrice = ({ price, originalPrice, discountPercentage }) => {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className="flex items-center gap-4 py-2">
      {/* Active Price */}
      <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
        ${price?.toFixed(2)}
      </span>

      {/* Discount Comparison details */}
      {hasDiscount && (
        <div className="flex items-center gap-3">
          {/* Strikethrough Original Price */}
          <span className="text-sm sm:text-base text-neutral-400 line-through font-medium">
            ${originalPrice.toFixed(2)}
          </span>

          {/* Gold Discount Percentage badge */}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/10 border border-secondary/20 text-secondary uppercase tracking-wider animate-pulse">
            {discountPercentage || Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
