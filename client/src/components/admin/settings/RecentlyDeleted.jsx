"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import productService from '@/services/product.service.js';
import toast from '@/utils/toast.js';

/**
 * RecentlyDeleted Component for Admin Settings Panel.
 * Lists soft-deleted products with capabilities to restore them or permanently delete them.
 */
export const RecentlyDeleted = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action states
  const [restoringId, setRestoringId] = useState(null);
  const [permanentModalProduct, setPermanentModalProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch soft-deleted items
  const fetchDeletedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getDeletedProducts();
      if (response && response.success && response.products) {
        setDeletedProducts(response.products);
      } else {
        setDeletedProducts([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve deleted items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeletedProducts();
  }, [fetchDeletedProducts]);

  // Restore action handler
  const handleRestore = async (product) => {
    const id = product._id || product.id;
    setRestoringId(id);
    try {
      const response = await productService.restoreProduct(id);
      if (response && response.success) {
        toast.success(`"${product.name}" restored to catalog`);
        fetchDeletedProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to restore product.';
      toast.error(msg);
    } finally {
      setRestoringId(null);
    }
  };

  // Permanent Delete handler
  const handlePermanentDelete = async () => {
    if (!permanentModalProduct) return;
    const id = permanentModalProduct._id || permanentModalProduct.id;
    setDeletingId(id);
    try {
      const response = await productService.permanentDeleteProduct(id);
      if (response && response.success) {
        toast.success(`"${permanentModalProduct.name}" permanently deleted`);
        setPermanentModalProduct(null);
        fetchDeletedProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to permanently delete product.';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              Recently Deleted Items
            </h3>
            {deletedProducts.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-50 text-red-600 border border-red-100">
                {deletedProducts.length}
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Products removed from the active store catalog. Restore items back to the store or permanently delete them from database storage.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDeletedProducts}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh List
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[250px]">
          <Loading size="md" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-3 animate-pulse">
            Fetching trash bin items...
          </span>
        </div>
      ) : error ? (
        <div className="py-8">
          <Error message={error} retry={fetchDeletedProducts} />
        </div>
      ) : deletedProducts.length === 0 ? (
        <div className="py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-center">
          <EmptyState
            title="Trash Bin is Empty"
            description="No recently deleted products found. Items removed by admins will be stored here for restoration."
          />
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Deleted Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Deleted At</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {deletedProducts.map((prod) => {
                  const displayImage = prod.images?.[0]?.url || '';
                  const id = prod._id || prod.id;
                  const isRestoring = restoringId === id;

                  return (
                    <tr key={id} className="hover:bg-neutral-50/50 transition-colors">
                      {/* Image & Title */}
                      <td className="p-4 pl-6 flex items-center gap-3">
                        {displayImage ? (
                          <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                            <img 
                              src={displayImage} 
                              alt={prod.name} 
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-12 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-neutral-900 block leading-tight">
                            {prod.name}
                          </span>
                          <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">
                            {prod.brand || 'No Brand'}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 font-semibold text-neutral-600">
                        {prod.category?.name || 'Uncategorized'}
                      </td>

                      {/* Price */}
                      <td className="p-4 font-extrabold text-neutral-900">
                        ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(prod.price || 0)}
                      </td>

                      {/* Deleted Date */}
                      <td className="p-4 font-semibold text-neutral-400">
                        {formatDate(prod.deletedAt || prod.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                        {/* Restore Button */}
                        <button
                          type="button"
                          onClick={() => handleRestore(prod)}
                          disabled={isRestoring}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          {isRestoring ? 'Restoring...' : 'Restore'}
                        </button>

                        {/* Permanent Delete Button */}
                        <button
                          type="button"
                          onClick={() => setPermanentModalProduct(prod)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Permanently
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permanent Delete Modal Confirmation */}
      {permanentModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex-shrink-0 border border-red-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none">
                  Permanent Database Deletion
                </h3>
                <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
                  Are you sure you want to permanently erase <strong className="text-neutral-800">{permanentModalProduct.name}</strong> from MongoDB storage? This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPermanentModalProduct(null)}
                disabled={deletingId !== null}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                disabled={deletingId !== null}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all flex items-center gap-2"
              >
                {deletingId !== null ? 'Deleting...' : 'Confirm Permanent Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RecentlyDeleted;
