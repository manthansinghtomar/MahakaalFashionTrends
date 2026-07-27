"use client";

import React from 'react';
import OfferStatusBadge from './OfferStatusBadge.jsx';

/**
 * Dedicated Admin Offer Details Preview Modal.
 * Displays clean view of Offer banner, title, discount, valid dates, status, and description inside admin console without redirecting.
 */
export const ViewOfferModal = ({
  isOpen,
  onClose,
  offer = null,
  onEdit = null,
}) => {
  if (!isOpen || !offer) return null;

  const displayImage = offer.bannerImage?.url || 'https://placehold.co/600x300?text=No+Banner+Image';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-sm animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0 bg-white">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-secondary">
            OFFER DETAILS PREVIEW
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
          
          {/* Banner Image Preview Container */}
          <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs relative flex items-center justify-center">
            <img
              src={displayImage}
              alt={offer.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x300?text=No+Banner+Image';
              }}
            />
            <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/30 text-amber-400 font-extrabold text-xs tracking-wider shadow-lg">
              {offer.discountPercentage}% OFF
            </div>
          </div>

          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                {offer.title}
              </h2>
              <span className="text-xs font-bold text-amber-600 block mt-1">
                Special Promotional Campaign
              </span>
            </div>
            <div className="flex-shrink-0 pt-1">
              <OfferStatusBadge status={offer.status} />
            </div>
          </div>

          {/* Date Spans Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                Start Date
              </span>
              <span className="text-sm font-extrabold text-neutral-800 block">
                {formatDate(offer.startDate)}
              </span>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                End Date
              </span>
              <span className="text-sm font-extrabold text-neutral-800 block">
                {formatDate(offer.endDate)}
              </span>
            </div>
          </div>

          {/* Description Box */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
              Campaign Description
            </span>
            <p className="text-xs text-neutral-700 font-medium leading-relaxed">
              {offer.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Metadata */}
          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400 font-medium block text-[10px] uppercase tracking-wider">Created Date</span>
              <span className="font-bold text-neutral-800 block">
                {formatDate(offer.createdAt)}
              </span>
            </div>
            {offer.bannerImage?.public_id && (
              <div className="text-right">
                <span className="text-neutral-400 font-medium block text-[10px] uppercase tracking-wider">Image Asset ID</span>
                <span className="font-mono text-[11px] text-neutral-600 font-bold block max-w-[180px] truncate">
                  {offer.bannerImage.public_id}
                </span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-100 bg-white flex-shrink-0">
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
                onEdit(offer);
              }}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Offer
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewOfferModal;
