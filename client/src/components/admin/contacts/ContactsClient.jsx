"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import contactService from '@/services/contact.service.js';
import toast from '@/utils/toast.js';

import ContactsToolbar from './ContactsToolbar.jsx';
import ContactsTable from './ContactsTable.jsx';
import ContactDetailsModal from './ContactDetailsModal.jsx';
import DeleteContactModal from './DeleteContactModal.jsx';

/**
 * ContactsClient component (Client Coordinator).
 * Manages queries, search, status filters, pagination, and details view tracking.
 */
export const ContactsClient = () => {
  // Query parameters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  // Data lists
  const [messages, setMessages] = useState([]);

  // States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Details Modal States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Delete Modal States
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // Fetch inquiries whenever query parameters or pagination changes
  const fetchMessages = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await contactService.getAllInquiries({
        page: currentPage,
        limit: 10,
        search: search.trim(),
        status: statusFilter,
        ...(signal ? { signal } : {}),
      });

      if (response && response.success) {
        setMessages(response.messages || []);
        setTotalMessages(response.totalMessages || 0);
        setTotalPages(response.totalPages || 1);
      } else {
        setMessages([]);
        setTotalMessages(0);
        setTotalPages(1);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve customer inquiries listing.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, statusFilter, currentPage]);

  useEffect(() => {
    const controller = new AbortController();
    fetchMessages(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchMessages]);

  // Reset pagination on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // View details triggers database Read patch if contact was unread
  const handleViewDetails = async (msg) => {
    setSelectedMessage(msg);
    setIsDetailsOpen(true);

    if (msg.status === 'unread') {
      try {
        const response = await contactService.markAsRead(msg._id || msg.id);
        if (response && response.success) {
          // Incrementally update row status to read without page reloads
          setMessages((prev) =>
            prev.map((item) =>
              (item._id === msg._id || item.id === msg.id) ? { ...item, status: 'read' } : item
            )
          );
          toast.success('Contact status updated');
        }
      } catch (err) {
        console.error('Failed to automatically mark inquiry as read on backend:', err);
      }
    }
  };

  // Archive inquiry status mutation
  const handleArchive = async (msg) => {
    try {
      const response = await contactService.archiveInquiry(msg._id || msg.id);
      if (response && response.success) {
        // Incrementally update row status to archived without page reloads
        setMessages((prev) =>
          prev.map((item) =>
            (item._id === msg._id || item.id === msg.id) ? { ...item, status: 'archived' } : item
          )
        );
        toast.success('Contact status updated');
      }
    } catch (err) {
      console.error('Failed to archive inquiry on backend:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to archive inquiry.');
    }
  };

  // Delete confirm mutation
  const handleDeleteConfirm = async () => {
    if (!deletingMessage) return;
    setDeletingStatus(true);
    setDeleteError(null);
    try {
      const response = await contactService.deleteInquiry(deletingMessage._id || deletingMessage.id);
      if (response && response.success) {
        setIsDeleteOpen(false);
        setDeletingMessage(null);
        fetchMessages();
        toast.success('Inquiry deleted successfully');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'An error occurred while deleting the message.';
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
            SUPPORT WORKSPACE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Customer Inquiries
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            Monitor and review messages submitted by users through the store support portals.
          </p>
        </div>
      </div>

      {/* Toolbar Controls */}
      <ContactsToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={() => fetchMessages()}
      />

      {/* Main Table Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching inquiries...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchMessages()} />
        </div>
      ) : (
        <div className="space-y-6">
          <ContactsTable
            messages={messages}
            onViewDetails={handleViewDetails}
            onArchive={handleArchive}
            onDelete={(msg) => {
              setDeletingMessage(msg);
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

      {/* Details View Modal */}
      <ContactDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteContactModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingMessage(null);
          setDeleteError(null);
        }}
        message={deletingMessage}
        onConfirm={handleDeleteConfirm}
        deleting={deletingStatus}
        error={deleteError}
      />

    </div>
  );
};

export default ContactsClient;
