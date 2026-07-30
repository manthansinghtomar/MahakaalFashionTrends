"use client";

import React, { useState, useEffect } from 'react';
import productService from '@/services/product.service.js';
import ProductCard from '@/components/sections/products/ProductCard.jsx';

/**
 * RelatedProducts component.
 * Fetches other products from the same category.
 * Filters out the currently viewed product and limits output to maximum 4 items.
 * Hides itself completely if no related products are found.
 */
export const RelatedProducts = ({ categoryId, currentProductId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Request 5 items to allow filtering out the current product while still showing up to 4
        const response = await productService.getAllProducts({
          category: categoryId,
          limit: 5,
          signal: controller.signal,
        });

        if (response && response.success && response.products) {
          // Filter out the active product and limit output to 4 items
          const filtered = response.products
            .filter((p) => p._id !== currentProductId && p.id !== currentProductId)
            .slice(0, 4);
          setRelated(filtered);
        } else {
          setRelated([]);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.message !== 'canceled') {
          console.error('Failed to load related products:', err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchRelated();

    return () => {
      controller.abort();
    };
  }, [categoryId, currentProductId]);

  if (loading || related.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 pt-16 border-t border-neutral-100" aria-labelledby="related-products-title">
      <div className="space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
            COMPLEMENTARY STYLES
          </span>
          <h3 id="related-products-title" className="text-2xl font-bold tracking-tight text-neutral-900">
            Related Products
          </h3>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 gap-y-3 sm:gap-6 lg:gap-8">
          {related.map((prod) => (
            <ProductCard key={prod._id || prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
