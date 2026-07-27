"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import categoryService from '@/services/category.service.js';

import CategoriesPageHeader from './CategoriesPageHeader.jsx';
import CategoriesGrid from './CategoriesGrid.jsx';

/**
 * CategoriesClient coordinator component.
 * Coordinates category catalog fetching and layout.
 */
export const CategoriesClient = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoriesList = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all active categories
      const response = await categoryService.getAllCategories({
        page: 1,
        limit: 100, // Fetch all available categories for catalog listing
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.categories) {
        setCategories(response.categories);
      } else {
        setCategories([]);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve categories.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategoriesList(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchCategoriesList]);

  return (
    <div className="w-full bg-neutral-50 min-h-screen">
      {/* 1. Full-Width Dark Hero Header */}
      <CategoriesPageHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* 2. State coordination */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Loading Categories...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchCategoriesList()} />
        </div>
      ) : categories.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No Categories Found"
            description="We currently have no category listings available. Please check back later."
          />
        </div>
      ) : (
        /* Curated Grid */
        <CategoriesGrid categories={categories} />
      )}
    </div>
  </div>
  );
};

export default CategoriesClient;
