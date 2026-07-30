import React from 'react';
import ProductCard from '@/components/sections/products/ProductCard.jsx';

/**
 * Grid mapping active products to the reusable ProductCard component.
 * Mobile (< 640px): 2-column zero-gap mobile layout where cards touch side-by-side.
 * Tablet / Desktop: Preserved multi-column layout.
 */
export const ProductsGrid = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 gap-y-3 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
