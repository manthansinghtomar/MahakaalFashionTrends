"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import productService from '@/services/product.service.js';
import categoryService from '@/services/category.service.js';
import offerService from '@/services/offer.service.js';
import toast from '@/utils/toast.js';

/**
 * RecentlyDeleted Component for Admin Settings Panel.
 * Supports 3 Sections:
 * 1. Products Trash
 * 2. Categories Trash
 * 3. Offers Trash
 * Lists soft-deleted items with capabilities to restore them or permanently purge them.
 */
export const RecentlyDeleted = () => {
  const [activeSection, setActiveSection] = useState('products'); // 'products' | 'categories' | 'offers'
  
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [deletedOffers, setDeletedOffers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Action states
  const [restoringId, setRestoringId] = useState(null);
  const [permanentModalItem, setPermanentModalItem] = useState(null); // { item, type: 'product'|'category'|'offer' }
  const [deletingId, setDeletingId] = useState(null);

  // Fetch soft-deleted items across all 3 modules
  const fetchAllDeletedItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [prodRes, catRes, offRes] = await Promise.allSettled([
        productService.getDeletedProducts(),
        categoryService.getDeletedCategories(),
        offerService.getDeletedOffers(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value?.products) {
        setDeletedProducts(prodRes.value.products);
      } else {
        setDeletedProducts([]);
      }

      if (catRes.status === 'fulfilled' && catRes.value?.categories) {
        setDeletedCategories(catRes.value.categories);
      } else {
        setDeletedCategories([]);
      }

      if (offRes.status === 'fulfilled' && offRes.value?.offers) {
        setDeletedOffers(offRes.value.offers);
      } else {
        setDeletedOffers([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve deleted items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllDeletedItems();
  }, [fetchAllDeletedItems]);

  // Restore action handler
  const handleRestore = async (item, type) => {
    const id = item._id || item.id;
    setRestoringId(id);
    try {
      let response;
      if (type === 'product') {
        response = await productService.restoreProduct(id);
      } else if (type === 'category') {
        response = await categoryService.restoreCategory(id);
      } else if (type === 'offer') {
        response = await offerService.restoreOffer(id);
      }

      if (response && response.success) {
        toast.success(`"${item.name || item.title}" restored successfully`);
        fetchAllDeletedItems();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to restore item.';
      toast.error(msg);
    } finally {
      setRestoringId(null);
    }
  };

  // Permanent Delete handler
  const handlePermanentDelete = async () => {
    if (!permanentModalItem) return;
    const { item, type } = permanentModalItem;
    const id = item._id || item.id;
    setDeletingId(id);

    try {
      let response;
      if (type === 'product') {
        response = await productService.permanentDeleteProduct(id);
      } else if (type === 'category') {
        response = await categoryService.permanentDeleteCategory(id);
      } else if (type === 'offer') {
        response = await offerService.permanentDeleteOffer(id);
      }

      if (response && response.success) {
        toast.success(`"${item.name || item.title}" permanently deleted`);
        setPermanentModalItem(null);
        fetchAllDeletedItems();
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to permanently delete item.';
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
          </div>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Manage soft-deleted Products, Categories, and Offers. Restore items back to active status or permanently delete them.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAllDeletedItems}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh List
        </button>
      </div>

      {/* 3 Section Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-2">
        {/* Products Section */}
        <button
          type="button"
          onClick={() => setActiveSection('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'products'
              ? 'bg-neutral-950 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>📦 Products</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSection === 'products' ? 'bg-neutral-800 text-secondary' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {deletedProducts.length}
          </span>
        </button>

        {/* Categories Section */}
        <button
          type="button"
          onClick={() => setActiveSection('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'categories'
              ? 'bg-neutral-950 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>🏷️ Categories</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSection === 'categories' ? 'bg-neutral-800 text-secondary' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {deletedCategories.length}
          </span>
        </button>

        {/* Offers Section */}
        <button
          type="button"
          onClick={() => setActiveSection('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'offers'
              ? 'bg-neutral-950 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <span>🎁 Offers</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeSection === 'offers' ? 'bg-neutral-800 text-secondary' : 'bg-neutral-200 text-neutral-700'
          }`}>
            {deletedOffers.length}
          </span>
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
          <Error message={error} retry={fetchAllDeletedItems} />
        </div>
      ) : activeSection === 'products' ? (
        /* SECTION 1: PRODUCTS TRASH */
        deletedProducts.length === 0 ? (
          <div className="py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-center">
            <EmptyState
              title="Products Trash is Empty"
              description="No recently deleted products found."
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
                        <td className="p-4 pl-6 flex items-center gap-3">
                          {displayImage ? (
                            <div className="w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                              <img src={displayImage} alt={prod.name} className="w-full h-full object-cover object-center" />
                            </div>
                          ) : (
                            <div className="w-10 h-12 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-neutral-900 block leading-tight">{prod.name}</span>
                            <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">{prod.brand || 'No Brand'}</span>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-neutral-600">
                          {prod.category?.name || 'Uncategorized'}
                        </td>

                        <td className="p-4 font-extrabold text-neutral-900">
                          ₹{new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(prod.price || 0)}
                        </td>

                        <td className="p-4 font-semibold text-neutral-400">
                          {formatDate(prod.deletedAt || prod.updatedAt)}
                        </td>

                        <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRestore(prod, 'product')}
                            disabled={isRestoring}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {isRestoring ? 'Restoring...' : 'Restore'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPermanentModalItem({ item: prod, type: 'product' })}
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
        )
      ) : activeSection === 'categories' ? (
        /* SECTION 2: CATEGORIES TRASH */
        deletedCategories.length === 0 ? (
          <div className="py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-center">
            <EmptyState
              title="Categories Trash is Empty"
              description="No recently deleted categories found."
            />
          </div>
        ) : (
          <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Deleted Category</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Parent Category</th>
                    <th className="p-4">Deleted At</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {deletedCategories.map((cat) => {
                    const displayImage = cat.image?.url || '';
                    const id = cat._id || cat.id;
                    const isRestoring = restoringId === id;

                    return (
                      <tr key={id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          {displayImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                              <img src={displayImage} alt={cat.name} className="w-full h-full object-cover object-center" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-neutral-900 block leading-tight">{cat.name}</span>
                            <span className="text-[10px] font-semibold text-neutral-400 block mt-0.5">{cat.description || 'No Description'}</span>
                          </div>
                        </td>

                        <td className="p-4 font-mono font-semibold text-neutral-500">{cat.slug}</td>

                        <td className="p-4 font-semibold text-neutral-600">
                          {cat.parent?.name || 'None'}
                        </td>

                        <td className="p-4 font-semibold text-neutral-400">
                          {formatDate(cat.deletedAt || cat.updatedAt)}
                        </td>

                        <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRestore(cat, 'category')}
                            disabled={isRestoring}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {isRestoring ? 'Restoring...' : 'Restore'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPermanentModalItem({ item: cat, type: 'category' })}
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
        )
      ) : (
        /* SECTION 3: OFFERS TRASH */
        deletedOffers.length === 0 ? (
          <div className="py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 text-center">
            <EmptyState
              title="Offers Trash is Empty"
              description="No recently deleted offers found."
            />
          </div>
        ) : (
          <div className="bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="p-4 pl-6">Deleted Offer</th>
                    <th className="p-4">Target Product</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Deleted At</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {deletedOffers.map((off) => {
                    const displayImage = off.bannerImage?.url || '';
                    const id = off._id || off.id;
                    const isRestoring = restoringId === id;

                    return (
                      <tr key={id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="p-4 pl-6 flex items-center gap-3">
                          {displayImage ? (
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/50 flex-shrink-0">
                              <img src={displayImage} alt={off.title} className="w-full h-full object-cover object-center" />
                            </div>
                          ) : (
                            <div className="w-16 h-10 rounded-lg bg-neutral-50 border border-neutral-200/40 flex items-center justify-center flex-shrink-0 text-neutral-300">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <span className="font-extrabold text-neutral-900 block leading-tight">{off.title}</span>
                            <span className="text-[10px] font-semibold text-neutral-400 block max-w-[180px] truncate mt-0.5">{off.description}</span>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-neutral-700">
                          {off.product?.name || 'Linked Product'}
                        </td>

                        <td className="p-4 font-extrabold text-secondary">
                          {off.discountPercentage}% OFF
                        </td>

                        <td className="p-4 font-semibold text-neutral-400">
                          {formatDate(off.deletedAt || off.updatedAt)}
                        </td>

                        <td className="p-4 pr-6 text-right space-x-2.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRestore(off, 'offer')}
                            disabled={isRestoring}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all disabled:opacity-50"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {isRestoring ? 'Restoring...' : 'Restore'}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPermanentModalItem({ item: off, type: 'offer' })}
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
        )
      )}

      {/* Permanent Delete Modal Confirmation */}
      {permanentModalItem && (
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
                  Are you sure you want to permanently erase <strong className="text-neutral-800">{permanentModalItem.item.name || permanentModalItem.item.title}</strong> from database storage? This action cannot be reversed.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPermanentModalItem(null)}
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
