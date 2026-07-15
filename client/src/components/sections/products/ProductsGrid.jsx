import React from 'react';
import ProductCard from './ProductCard.jsx';

/**
 * Products Grid layout.
 * Maps products array into responsive grid columns.
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
