import React from 'react';
import ProductCard from './ProductCard.jsx';

/**
 * Products Grid layout for Homepage Sections.
 * Mobile (< 640px): 2-column zero-gap mobile layout where cards touch side-by-side.
 * Desktop: Preserved 4-column grid.
 */
export const ProductsGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-12 text-neutral-400">
        No products available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0 gap-y-3 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
