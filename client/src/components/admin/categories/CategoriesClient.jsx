"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import categoryService from '@/services/category.service.js';

import CategoriesToolbar from './CategoriesToolbar.jsx';
import CategoriesTable from './CategoriesTable.jsx';
import CategoryFormModal from './CategoryFormModal.jsx';
import DeleteCategoryModal from './DeleteCategoryModal.jsx';

/**
 * CategoriesClient component (Client Coordinator).
 * Manages states, filters, pagination, and Create/Update/Delete actions for categories.
 */
export const CategoriesClient = () => {
  // Query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Data lists
  const [categories, setCategories] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submittingCategory, setSubmittingCategory] = useState(false);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [deleteError, setDeleteError] = useState(null); // Catches backend constraints

  // Fetch categories whenever query parameters or pagination changes
  const fetchCategories = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await categoryService.getAllCategories({
        page: currentPage,
        limit: 10,
        includeInactive: 'true', // Essential for admin console to review inactive items
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        let fetchedCategories = response.categories || [];

        // Client-side partial matching for search name
        if (search.trim()) {
          const searchRegex = new RegExp(search.trim(), 'i');
          fetchedCategories = fetchedCategories.filter((cat) => searchRegex.test(cat.name));
        }

        // Client-side matching for status filter
        if (statusFilter) {
          fetchedCategories = fetchedCategories.filter((cat) => cat.status === statusFilter);
        }

        setCategories(fetchedCategories);
        setTotalCategories(response.totalCategories || fetchedCategories.length);
        setTotalPages(response.totalPages || 1);
      } else {
        setCategories([]);
        setTotalCategories(0);
        setTotalPages(1);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve categories listing.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, statusFilter, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchCategories(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchCategories]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Create or Update submit handler
  const handleFormSubmit = async (payload) => {
    setSubmittingCategory(true);
    try {
      if (editingCategory) {
        // Edit Mode
        const response = await categoryService.updateCategory(editingCategory._id || editingCategory.id, payload);
        if (response && response.success) {
          setIsFormOpen(false);
          setEditingCategory(null);
          fetchCategories();
        }
      } else {
        // Create Mode
        const response = await categoryService.createCategory(payload);
        if (response && response.success) {
          setIsFormOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to save category details.');
    } finally {
      setSubmittingCategory(false);
    }
  };

  // Delete confirm handler
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setDeletingStatus(true);
    setDeleteError(null);
    try {
      const response = await categoryService.deleteCategory(deletingCategory._id || deletingCategory.id);
      if (response && response.success) {
        setIsDeleteOpen(false);
        setDeletingCategory(null);
        fetchCategories();
      }
    } catch (err) {
      // Catch backend validation message (e.g. category has active products assigned)
      setDeleteError(err.response?.data?.message || err.message || 'An error occurred while deleting the category.');
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
            Categories Directory
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            Manage your brand ethnic catalog classifications. Create, update, or remove designer divisions.
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <CategoriesToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={() => fetchCategories()}
        onAddCategory={() => {
          setEditingCategory(null);
          setIsFormOpen(true);
        }}
      />

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching categories directory...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchCategories()} />
        </div>
      ) : (
        <div className="space-y-6">
          <CategoriesTable
            categories={categories}
            onEdit={(cat) => {
              setEditingCategory(cat);
              setIsFormOpen(true);
            }}
            onDelete={(cat) => {
              setDeletingCategory(cat);
              setDeleteError(null);
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

      {/* Create/Edit Form Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
        onSubmit={handleFormSubmit}
        submitting={submittingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingCategory(null);
          setDeleteError(null);
        }}
        category={deletingCategory}
        onConfirm={handleDeleteConfirm}
        deleting={deletingStatus}
        error={deleteError}
      />

    </div>
  );
};

export default CategoriesClient;
