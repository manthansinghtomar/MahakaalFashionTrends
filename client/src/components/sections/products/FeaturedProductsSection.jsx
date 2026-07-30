"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import productService from '@/services/product.service.js';
import ProductsGrid from './ProductsGrid.jsx';

/**
 * Featured Products Section.
 * Fetches featured products from the backend on mount and manages loading/error/empty UI states.
 */
export const FeaturedProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedProducts = async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Query only featured products, limited to 4 items for grid layout
      const response = await productService.getAllProducts({
        featured: 'true',
        limit: 4,
        ...(signal ? { signal } : {}),
      });

      if (response && response.products) {
        setProducts(response.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      // Avoid state updates if request was canceled/aborted
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to load featured products.');
      }
    } finally {
      // Check if we are still active (not aborted) before loading finish
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchFeaturedProducts(controller.signal);

    // Cancel in-flight requests on component unmount
    return () => controller.abort();
  }, []);

  return (
    <section className="w-full bg-neutral-50 py-20 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-1.5 sm:px-6 lg:px-8">
        
        {/* Split Header Container */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary block">
              BESTSELLING PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Featured Products
            </h2>
            <p className="text-base text-neutral-500 leading-relaxed">
              Discover our most popular men's fashion products, including Polo T-Shirts, Shirts, Jeans, Trousers, Lowers, Belts and Kids Wear at affordable prices.
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <Link href="/products" passHref className="focus:outline-none">
              <Button
                variant="outline"
                className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest border-neutral-300 text-neutral-900 hover:bg-neutral-950 hover:text-white hover:border-transparent transition-all duration-300 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic States Render block */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Loading size="lg" />
          </div>
        ) : error ? (
          <div className="py-12">
            <Error message={error} retry={() => fetchFeaturedProducts()} />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Featured Items Found"
              description="Check back later for our new collection updates."
            />
          </div>
        ) : (
          /* Products Grid layout */
          <ProductsGrid products={products} />
        )}

      </div>
    </section>
  );
};

export default FeaturedProductsSection;
