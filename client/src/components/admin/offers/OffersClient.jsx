"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import offerService from '@/services/offer.service.js';
import toast from '@/utils/toast.js';

import OffersToolbar from './OffersToolbar.jsx';
import OffersTable from './OffersTable.jsx';
import OfferFormModal from './OfferFormModal.jsx';
import DeleteOfferModal from './DeleteOfferModal.jsx';

/**
 * OffersClient component (Client Coordinator).
 * Manages states, filters, pagination, and Create/Update/Delete actions for offers.
 */
export const OffersClient = () => {
  // Query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOffers, setTotalOffers] = useState(0);

  // Data lists
  const [offers, setOffers] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingOffer, setDeletingOffer] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch offers whenever query parameters or pagination changes
  const fetchOffers = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await offerService.getAllOffers({
        page: currentPage,
        limit: 10,
        sort: sortBy,
        includeInactive: 'true', // Essential for admin console to review inactive items
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        let fetchedOffers = response.offers || [];

        // Client-side partial matching for search title
        if (search.trim()) {
          const searchRegex = new RegExp(search.trim(), 'i');
          fetchedOffers = fetchedOffers.filter((off) => searchRegex.test(off.title));
        }

        // Client-side matching for status filter
        if (statusFilter) {
          fetchedOffers = fetchedOffers.filter((off) => off.status === statusFilter);
        }

        setOffers(fetchedOffers);
        setTotalOffers(response.totalOffers || fetchedOffers.length);
        setTotalPages(response.totalPages || 1);
      } else {
        setOffers([]);
        setTotalOffers(0);
        setTotalPages(1);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve offers listing.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, statusFilter, sortBy, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchOffers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchOffers]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  // Create or Update submit handler
  const handleFormSubmit = async (payload) => {
    setSubmittingOffer(true);
    try {
      if (editingOffer) {
        // Edit Mode
        const response = await offerService.updateOffer(editingOffer._id || editingOffer.id, payload);
        if (response && response.success) {
          setIsFormOpen(false);
          setEditingOffer(null);
          fetchOffers();
          toast.success('Offer updated successfully');
        }
      } else {
        // Create Mode
        const response = await offerService.createOffer(payload);
        if (response && response.success) {
          setIsFormOpen(false);
          fetchOffers();
          toast.success('Offer created successfully');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save offer details.';
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setSubmittingOffer(false);
    }
  };

  // Delete confirm handler
  const handleDeleteConfirm = async () => {
    if (!deletingOffer) return;
    setDeletingStatus(true);
    setDeleteError(null);
    try {
      const response = await offerService.deleteOffer(deletingOffer._id || deletingOffer.id);
      if (response && response.success) {
        setIsDeleteOpen(false);
        setDeletingOffer(null);
        fetchOffers();
        toast.success('Offer deleted successfully');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred while deleting the offer.';
      setDeleteError(msg);
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
            MARKETING WORKSPACE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Offers Directory
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            Manage your store promotional discounts and campaign banners. Create, update, or remove offers.
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <OffersToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={() => fetchOffers()}
        onAddOffer={() => {
          setEditingOffer(null);
          setIsFormOpen(true);
        }}
      />

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching campaign directory...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchOffers()} />
        </div>
      ) : (
        <div className="space-y-6">
          <OffersTable
            offers={offers}
            onEdit={(off) => {
              setEditingOffer(off);
              setIsFormOpen(true);
            }}
            onDelete={(off) => {
              setDeletingOffer(off);
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
      <OfferFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingOffer(null);
        }}
        offer={editingOffer}
        onSubmit={handleFormSubmit}
        submitting={submittingOffer}
      />

      {/* Delete Confirmation Modal */}
      <DeleteOfferModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingOffer(null);
          setDeleteError(null);
        }}
        offer={deletingOffer}
        onConfirm={handleDeleteConfirm}
        deleting={deletingStatus}
        error={deleteError}
      />

    </div>
  );
};

export default OffersClient;
