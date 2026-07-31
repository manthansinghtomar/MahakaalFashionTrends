"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/sections/products/ProductCard.jsx';

/**
 * Grid mapping active products to the reusable ProductCard component.
 * Mobile (< 640px): 2-column layout. Shows 6 products max by default on mobile if maxMobile prop is provided, with a "See More ->" button redirecting to /products.
 * Tablet / Desktop: Preserved multi-column layout.
 */
export const ProductsGrid = ({ products = [], maxMobile = null }) => {
  if (!products || products.length === 0) return null;

  const hasMoreThanMax = maxMobile && products.length > maxMobile;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 gap-y-3 sm:gap-6 lg:gap-8">
        {products.map((product, index) => {
          const isHiddenOnMobile = hasMoreThanMax && index >= maxMobile;
          return (
            <div
              key={product._id || product.id || product.slug}
              className={isHiddenOnMobile ? 'hidden sm:block' : 'block'}
            >
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>

      {hasMoreThanMax && (
        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 bg-white text-xs font-bold uppercase tracking-wider text-neutral-900 shadow-sm hover:bg-neutral-950 hover:text-white hover:border-transparent transition-all duration-300 active:scale-95"
          >
            <span>See More Products</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
