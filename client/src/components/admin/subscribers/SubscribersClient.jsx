"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import newsletterService from '@/services/newsletter.service.js';
import toast from '@/utils/toast.js';
import DeleteSubscriberModal from './DeleteSubscriberModal.jsx';

/**
 * SubscribersClient component for Admin Dashboard.
 * Displays subscriber list, search filter, sorting, pagination, and deletion modal.
 */
export const SubscribersClient = () => {
  // Query parameters
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  // Data
  const [subscribers, setSubscribers] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingSubscriber, setDeletingSubscriber] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch subscribers from API
  const fetchSubscribers = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await newsletterService.getAllSubscribers({
        page: currentPage,
        limit: 10,
        search: search.trim(),
        sort,
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        setSubscribers(response.subscribers || []);
        setTotalSubscribers(response.totalSubscribers || 0);
        setTotalPages(response.totalPages || 1);
      } else {
        setSubscribers([]);
        setTotalSubscribers(0);
        setTotalPages(1);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.response?.data?.message || err.message || 'Failed to fetch newsletter subscribers.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, sort, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchSubscribers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchSubscribers]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deletingSubscriber) return;
    setDeletingStatus(true);
    setDeleteError(null);

    try {
      const response = await newsletterService.deleteSubscriber(
        deletingSubscriber._id || deletingSubscriber.id
      );

      if (response && response.success) {
        setIsDeleteOpen(false);
        setDeletingSubscriber(null);
        toast.success(response.message || 'Subscriber removed successfully.');
        fetchSubscribers();
      } else {
        const msg = response?.message || 'Failed to remove subscriber.';
        setDeleteError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'An error occurred while deleting subscriber.';
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
            MAILING LIST MANAGEMENT
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Newsletter Subscribers
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            View and manage customer email subscriptions for Mahakaal Fashion Trends.
          </p>
        </div>

        {/* Total Subscribers Count Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white self-start sm:self-auto shadow-xs">
          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span className="text-xs font-medium text-neutral-300">Total Subscribers:</span>
          <span className="text-sm font-bold text-secondary">{totalSubscribers}</span>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-neutral-100 shadow-xs w-full min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriber by email..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs outline-none focus:border-secondary focus:bg-white transition-all"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="sort-subscribers" className="sr-only">Sort subscribers</label>
          <select
            id="sort-subscribers"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="flex-1 sm:flex-none px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 outline-none focus:border-secondary focus:bg-white transition-all cursor-pointer"
          >
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => fetchSubscribers()}
            className="p-2.5 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 text-neutral-600 rounded-xl transition-all shrink-0"
            title="Refresh list"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M160 80v48M128 80l32 32-32 32" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching subscribers...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchSubscribers()} />
        </div>
      ) : subscribers.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 text-neutral-400 flex items-center justify-center mx-auto border border-neutral-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900">
              No newsletter subscribers yet.
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              {search.trim()
                ? `No subscribers matched "${search.trim()}". Try adjusting your search query.`
                : 'Customer subscriptions will appear here as soon as users sign up through the store website.'}
            </p>
          </div>
        </div>
      ) : (
        /* Data Table */
        <div className="space-y-6 w-full min-w-0">
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-xs w-full min-w-0">
            <div className="overflow-x-auto w-full max-w-full scrollbar-thin">
              <table className="w-full min-w-[550px] text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50/80 border-b border-neutral-100 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                    <th className="py-4 px-6">#</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Subscription Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {subscribers.map((sub, index) => {
                    const itemNumber = (currentPage - 1) * 10 + index + 1;
                    const formattedDate = new Date(
                      sub.subscribedAt || sub.createdAt
                    ).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr
                        key={sub._id || sub.id}
                        className="hover:bg-neutral-50/60 transition-colors group"
                      >
                        <td className="py-4 px-6 text-neutral-400 font-mono text-[11px]">
                          {itemNumber}
                        </td>
                        <td className="py-4 px-6 font-semibold text-neutral-900">
                          {sub.email}
                        </td>
                        <td className="py-4 px-6 text-neutral-500 font-medium">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingSubscriber(sub);
                              setDeleteError(null);
                              setIsDeleteOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all"
                            title="Delete Subscriber"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4 border-t border-neutral-100 text-xs font-bold">
              <span className="text-neutral-400 font-semibold uppercase tracking-wider">
                Page {currentPage} of {totalPages}
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

      {/* Delete Confirmation Modal */}
      <DeleteSubscriberModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingSubscriber(null);
          setDeleteError(null);
        }}
        subscriber={deletingSubscriber}
        onConfirm={handleDeleteConfirm}
        deleting={deletingStatus}
        error={deleteError}
      />
    </div>
  );
};

export default SubscribersClient;
