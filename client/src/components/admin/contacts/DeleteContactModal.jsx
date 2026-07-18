"use client";

import React from 'react';

/**
 * Delete confirmation modal for contact inquiry submissions.
 * Disables buttons during requests and renders backend constraint validation errors inline.
 */
export const DeleteContactModal = ({
  isOpen,
  onClose,
  message = null,
  onConfirm,
  deleting = false,
  error = null,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-sm">
        
        {/* Warning Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex-shrink-0 border border-red-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight leading-none">
              Delete Contact Message?
            </h3>
            <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
              This action is permanent and cannot be undone. It will remove the inquiry log from the support database.
            </p>
          </div>
        </div>

        {/* Backend Error Warning Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <span className="block font-bold">Cannot delete message</span>
              <span className="block font-medium mt-0.5 text-[11px] leading-tight">{error}</span>
            </div>
          </div>
        )}

        {/* Contact Message Preview */}
        <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-extrabold text-neutral-800 block leading-none">{message.name}</span>
            <span className="text-[10px] text-neutral-400 font-bold lowercase">{message.email}</span>
          </div>
          <span className="text-[11px] font-semibold text-neutral-500 block line-clamp-2">
            Subject: {message.subject}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 border border-red-600 rounded-xl transition-all flex items-center gap-2"
          >
            {deleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteContactModal;
