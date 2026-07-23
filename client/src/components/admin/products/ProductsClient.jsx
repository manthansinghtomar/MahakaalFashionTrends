"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import productService from '@/services/product.service.js';
import categoryService from '@/services/category.service.js';
import toast from '@/utils/toast.js';

import ProductsToolbar from './ProductsToolbar.jsx';
import ProductsTable from './ProductsTable.jsx';
import ProductFormModal from './ProductFormModal.jsx';
import ViewProductModal from './ViewProductModal.jsx';
import DeleteProductModal from './DeleteProductModal.jsx';

/**
 * ProductsClient component (Client Coordinator).
 * Manages states, filters, pagination, and Create/Update/Delete actions for products.
 */
export const ProductsClient = () => {
  // Query parameters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Data lists
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View Modal States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(false);

  // 1. Fetch categories ONCE on mount
  useEffect(() => {
    let active = true;
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (active && response && response.success && response.categories) {
          setCategories(response.categories);
        }
      } catch (err) {
        console.error('Failed to load categories for forms:', err);
      }
    };
    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  // 2. Fetch products whenever query parameters or pagination changes
  const fetchProducts = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Parse sorting parameter
      const response = await productService.getAllProducts({
        search: search.trim(),
        category: categoryFilter,
        sort: sortBy,
        page: currentPage,
        limit: 10,
        includeInactive: 'true', // Essential for admin console to review inactive items
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        // Safe check for status filter on client-side (since backend filters by isActive, not status)
        let fetchedProducts = response.products || [];
        if (statusFilter) {
          fetchedProducts = fetchedProducts.filter((p) => p.status === statusFilter);
        }

        setProducts(fetchedProducts);
        setTotalProducts(response.totalProducts || 0);
        setTotalPages(response.totalPages || 1);
      } else {
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve products listing.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, categoryFilter, statusFilter, sortBy, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortBy]);

  // Create or Update submit handler
  const handleFormSubmit = async (payload) => {
    setSubmittingProduct(true);
    try {
      if (editingProduct) {
        // Edit Mode
        const response = await productService.updateProduct(editingProduct._id || editingProduct.id, payload);
        if (response && response.success) {
          setIsFormOpen(false);
          setEditingProduct(null);
          fetchProducts();
          toast.success('Product updated successfully');
        }
      } else {
        // Create Mode
        const response = await productService.createProduct(payload);
        if (response && response.success) {
          setIsFormOpen(false);
          fetchProducts();
          toast.success('Product created successfully');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product details.';
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete confirm handler
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setDeletingStatus(true);
    try {
      const response = await productService.deleteProduct(deletingProduct._id || deletingProduct.id);
      if (response && response.success) {
        setIsDeleteOpen(false);
        setDeletingProduct(null);
        fetchProducts();
        toast.success('Product deleted successfully');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete product.';
      toast.error(msg);
    } finally {
      setDeletingStatus(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
            CATALOG WORKSPACE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Products Directory
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            Manage your brand ethnic wears collection. Create, update, view, or remove items.
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <ProductsToolbar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={() => fetchProducts()}
        onAddProduct={() => {
          setEditingProduct(null);
          setIsFormOpen(true);
        }}
      />

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching product directory...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchProducts()} />
        </div>
      ) : (
        <div className="space-y-6">
          <ProductsTable
            products={products}
            onView={(prod) => {
              setViewingProduct(prod);
              setIsViewOpen(true);
            }}
            onEdit={(prod) => {
              setEditingProduct(prod);
              setIsFormOpen(true);
            }}
            onDelete={(prod) => {
              setDeletingProduct(prod);
              setIsDeleteOpen(true);
            }}
          />

          {/* Simple Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4 border-t border-neutral-100 mt-4 text-xs font-bold">
              <span className="text-neutral-400 font-semibold uppercase tracking-wider">
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Details Modal */}
      <ViewProductModal
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setViewingProduct(null);
        }}
        product={viewingProduct}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsFormOpen(true);
        }}
      />

      {/* Create/Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        submitting={submittingProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteProductModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingProduct(null);
        }}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
        deleting={deletingStatus}
      />

    </div>
  );
};

export default ProductsClient;
