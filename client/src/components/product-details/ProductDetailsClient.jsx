"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import Button from '@/components/ui/Button.jsx';
import productService from '@/services/product.service.js';

import ProductGallery from './ProductGallery.jsx';
import ProductInfo from './ProductInfo.jsx';
import ProductSpecifications from './ProductSpecifications.jsx';
import RelatedProducts from './RelatedProducts.jsx';

/**
 * ProductDetailsClient component.
 * Coordinates client-side data fetching, page states, and layout rendering.
 */
export const ProductDetailsClient = ({ slug }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetails = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getProductBySlug(slug);
      
      if (response && response.success && response.product) {
        setProduct(response.product);
      } else {
        setProduct(null);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        // If API responds with 404, capture it gracefully
        if (err.status === 404 || err.message?.includes('404')) {
          setProduct(null);
        } else {
          setError(err.message || 'Failed to load product details.');
        }
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProductDetails(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProductDetails]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center min-h-[500px]">
        <Loading size="lg" />
        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
          Loading Product Details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <Error message={error} retry={() => fetchProductDetails()} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <EmptyState
          title="Product Not Found"
          description="We couldn't find the product you are looking for. It may have been removed or the link might be broken."
        >
          <Link href="/products" passHref className="focus:outline-none">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-neutral-300 text-neutral-900 hover:bg-neutral-950 hover:text-white transition-all duration-300"
            >
              Back to Catalog
            </Button>
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      
      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6">
          <ProductGallery 
            images={product.images} 
            defaultImage={product.image} 
          />
        </div>

        {/* Right Column: Information details and technical specs */}
        <div className="lg:col-span-6 space-y-6">
          <ProductInfo product={product} />
          
          <ProductSpecifications product={product} />
        </div>
      </div>

      {/* Full-width Related Products section */}
      <RelatedProducts 
        categoryId={product.category?._id || product.category} 
        currentProductId={product._id} 
      />

    </div>
  );
};

export default ProductDetailsClient;
