import React from 'react';
import ProductPrice from './ProductPrice.jsx';

/**
 * Renders core product metadata, titles, and descriptions.
 */
export const ProductInfo = ({ product }) => {
  if (!product) return null;

  const {
    name,
    category,
    brand,
    sku,
    stock = 0,
    price,
    originalPrice,
    discountPercentage,
    description,
    rating,
    reviewCount = 0,
  } = product;

  // Safe category retrieval
  const categoryName = typeof category === 'object' && category ? category.name : category;

  // Availability status
  const isInStock = stock > 0;

  return (
    <div className="space-y-6">
      {/* 1. Category & Brand Headers */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          {categoryName && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/5 border border-secondary/15 px-2.5 py-0.5 rounded-md">
              {categoryName}
            </span>
          )}
          {brand && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              {brand}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          {name}
        </h2>
      </div>

      {/* 2. Rating & Review Summary */}
      {rating && (
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-0.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-neutral-800">{rating.toFixed(1)}</span>
          <span className="text-neutral-400">({reviewCount} reviews)</span>
        </div>
      )}

      {/* 3. Price Rendering */}
      <ProductPrice
        price={price}
        originalPrice={originalPrice}
        discountPercentage={discountPercentage}
      />

      {/* 4. Availability & SKU Row */}
      <div className="flex items-center gap-6 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 border-t border-b border-neutral-100">
        {/* Availability */}
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isInStock ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-neutral-800">
            Availability: <span className={isInStock ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>{isInStock ? 'In Stock' : 'Out of Stock'}</span>
          </span>
        </div>

        {/* SKU */}
        {sku && (
          <div>
            <span>SKU: </span>
            <span className="text-neutral-800 font-bold">{sku}</span>
          </div>
        )}
      </div>

      {/* 5. Product Description */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Description
        </h4>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
