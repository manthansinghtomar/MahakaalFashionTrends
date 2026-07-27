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
 * New Arrivals Products Section.
 * Displays LATEST COLLECTION section mapping.
 * Accepts optional products prop; falls back to querying new arrivals from API.
 */
export const NewArrivalsSection = ({ products: initialProducts = null }) => {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState(null);

  const fetchNewArrivals = async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Query only new arrivals, limited to 4 items for grid layout
      const response = await productService.getAllProducts({
        newArrival: 'true',
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
        setError(err.message || 'Failed to load new arrivals.');
      }
    } finally {
      // Check if we are still active (not aborted) before loading finish
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // If initialProducts are passed through props, bypass backend calls
    if (initialProducts) {
      setProducts(initialProducts);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    fetchNewArrivals(controller.signal);

    // Cancel in-flight requests on component unmount
    return () => controller.abort();
  }, [initialProducts]);

  return (
    <section className="w-full bg-white py-20 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Split Header Container */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary block">
              Latest Collection
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              New Arrivals
            </h2>
            <p className="text-base text-neutral-500 leading-relaxed">
              Discover the newest arrivals in men's fashion, including stylish Shirts, Polo T-Shirts, Jeans, Trousers, and more at affordable prices.
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
            <Error message={error} retry={() => fetchNewArrivals()} />
          </div>
        ) : products.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No New Arrivals Found"
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

export default NewArrivalsSection;
