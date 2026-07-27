"use client";

import React from 'react';
import CategoryStatusBadge from './CategoryStatusBadge.jsx';

/**
 * Dedicated Admin Category Details Preview Modal.
 * Displays clean view of Category image, details, slug, status, and metadata without redirecting to public shop.
 */
export const ViewCategoryModal = ({
  isOpen,
  onClose,
  category = null,
  onEdit = null,
}) => {
  if (!isOpen || !category) return null;

  const displayImage = category.image?.url || 'https://placehold.co/400x400?text=No+Image';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-sm animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0 bg-white">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-secondary">
            CATEGORY DETAILS PREVIEW
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl focus:outline-none transition-colors"
            aria-label="Close view modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Category Image Preview */}
            <div className="sm:col-span-5 space-y-2">
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs relative flex items-center justify-center">
                <img
                  src={displayImage}
                  alt={category.name}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x400?text=No+Image';
                  }}
                />
              </div>
            </div>

            {/* Right Column: Category Details */}
            <div className="sm:col-span-7 space-y-4">
              
              {/* Name & Status */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                  {category.name}
                </h2>
                <div className="flex-shrink-0 pt-1">
                  <CategoryStatusBadge status={category.status} />
                </div>
              </div>

              {/* Description Box */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                  Description
                </span>
                <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                  {category.description || 'No description provided for this category.'}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                  Metadata
                </span>
                <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-0.5 text-xs">
                  <span className="text-neutral-400 font-medium block">Created Date</span>
                  <span className="font-bold text-neutral-800 block">
                    {formatDate(category.createdAt)}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end p-4 border-t border-neutral-100 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
            >
              Close
            </button>
            
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(category);
                }}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 rounded-xl transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit Category
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewCategoryModal;
