import React from 'react';
import ContactStatusBadge from './ContactStatusBadge.jsx';

/**
 * Contact Details modal popup.
 * Displays message text wraps and hides empty phone fields cleanly.
 */
export const ContactDetailsModal = ({
  isOpen,
  onClose,
  message = null,
}) => {
  if (!isOpen || !message) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasPhone = message.phone && message.phone.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              Inquiry Details
            </h3>
            <p className="text-xs text-neutral-400 font-medium mt-0.5">
              Received on {formatDate(message.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl focus:outline-none transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* Sender Overview Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Sender Name</span>
              <span className="block font-extrabold text-neutral-800 text-xs mt-0.5">{message.name}</span>
            </div>
            
            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Email Address</span>
              <a href={`mailto:${message.email}`} className="block font-semibold text-secondary text-xs mt-0.5 lowercase hover:underline">
                {message.email}
              </a>
            </div>

            {/* Phone (rendered conditionally) */}
            {hasPhone && (
              <div>
                <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Phone number</span>
                <span className="block font-semibold text-neutral-800 text-xs mt-0.5">{message.phone}</span>
              </div>
            )}

            <div>
              <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Status</span>
              <div className="mt-1">
                <ContactStatusBadge status={message.status} />
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Subject</span>
            <div className="px-4 py-2.5 bg-neutral-50 border border-neutral-150 rounded-xl font-bold text-neutral-900">
              {message.subject}
            </div>
          </div>

          {/* Message Field */}
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1.5">Inquiry Message</span>
            <div className="whitespace-pre-wrap break-words leading-relaxed text-neutral-600 bg-neutral-50 border border-neutral-150 rounded-2xl p-5 text-xs font-medium">
              {message.message}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end p-6 border-t border-neutral-100 flex-shrink-0 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactDetailsModal;
