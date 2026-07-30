import React from 'react';

/**
 * Renders absolute badges overlaying product images.
 * Supports status values like 'NEW' or 'BESTSELLER'.
 */
export const ProductBadge = ({ isNew, isBestSeller, isOutOfStock, className = '' }) => {
  if (isOutOfStock) {
    return (
      <span
        className={`absolute top-4 left-4 z-10 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-sm select-none rounded-sm bg-red-600 text-white ${className}`}
      >
        Out of Stock
      </span>
    );
  }

  if (!isNew && !isBestSeller) return null;

  // Prioritize BESTSELLER badge, show NEW otherwise
  const badgeText = isBestSeller ? 'Bestseller' : 'New';
  
  const bgClasses = isBestSeller
    ? 'bg-secondary text-neutral-950'
    : 'bg-neutral-900 text-white';

  return (
    <span
      className={`absolute top-4 left-4 z-10 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 shadow-sm select-none rounded-sm transition-all duration-300 ${bgClasses} ${className}`}
    >
      {badgeText}
    </span>
  );
};

export default ProductBadge;
