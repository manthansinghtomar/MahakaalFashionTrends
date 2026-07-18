import React from 'react';
import ProductCard from '@/components/sections/products/ProductCard.jsx';

/**
 * Grid mapping active products to the reusable ProductCard component.
 */
export const ProductsGrid = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product._id || product.id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
