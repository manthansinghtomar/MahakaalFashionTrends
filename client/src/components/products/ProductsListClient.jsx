"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import Button from '@/components/ui/Button.jsx';
import productService from '@/services/product.service.js';
import categoryService from '@/services/category.service.js';

import ProductsPageHeader from './ProductsPageHeader.jsx';
import ProductsToolbar from './ProductsToolbar.jsx';
import ProductsGrid from './ProductsGrid.jsx';
import Pagination from './Pagination.jsx';

/**
 * ProductsListClient component (Client Coordinator).
 * Manages URL-synchronized parameters (search, category, sort, page) and fetches catalog listings.
 * Caches and reuses categories during the lifecycle, and manages loading, error, and empty states.
 */
export const ProductsListClient = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse state parameters directly from the browser URL search parameters
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const currentLimit = 8; // Renders 8 products per page

  // Local state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch categories ONCE on mount and reuse them
  useEffect(() => {
    let active = true;
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (active && response && response.success && response.categories) {
          setCategories(response.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  // 2. Fetch products whenever query parameters change
  const fetchProducts = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAllProducts({
        search: currentSearch,
        category: currentCategory,
        sort: currentSort,
        page: currentPage,
        limit: currentLimit,
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        setProducts(response.products || []);
        setTotalProducts(response.totalProducts || 0);
        setTotalPages(response.totalPages || 0);
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(0);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve products catalog.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [currentSearch, currentCategory, currentSort, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // Sync state update to browser URL params
  const updateQuery = (key, value) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination to page 1 when sorting or filtering filters change
    if (key !== 'page') {
      params.delete('page');
    }

    const searchStr = params.toString();
    const query = searchStr ? `?${searchStr}` : '';
    router.push(`${pathname}${query}`);
  };

  const handleSearch = (term) => updateQuery('search', term);
  const handleCategory = (slug) => updateQuery('category', slug);
  const handleSort = (sortOption) => updateQuery('sort', sortOption);
  const handlePage = (pageNum) => updateQuery('page', pageNum);
  const handleResetFilters = () => router.push(pathname);

  // Look up selected category name from cache for header display title
  const activeCategory = categories.find(
    (cat) => cat.slug === currentCategory || cat._id === currentCategory
  );
  const activeCategoryName = activeCategory ? activeCategory.name : '';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Dynamic Page Header */}
      <ProductsPageHeader activeCategoryName={activeCategoryName} />

      {/* Toolbar Filter panel */}
      <ProductsToolbar
        totalProducts={totalProducts}
        categories={categories}
        currentSearch={currentSearch}
        currentCategory={currentCategory}
        currentSort={currentSort}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategory}
        onSortChange={handleSort}
      />

      {/* Grid rendering and state handlers */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Loading Catalog...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchProducts()} />
        </div>
      ) : products.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No Products Found"
            description="We couldn't find any products matching your search terms or filters."
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider border-neutral-300 text-neutral-900 hover:bg-neutral-950 hover:text-white transition-all duration-300"
            >
              Reset All Filters
            </Button>
          </EmptyState>
        </div>
      ) : (
        <>
          {/* Main Products Grid */}
          <ProductsGrid products={products} />

          {/* Catalog Pagination bar */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </>
      )}
    </div>
  );
};

export default ProductsListClient;
