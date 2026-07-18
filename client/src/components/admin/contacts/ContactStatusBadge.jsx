import React from 'react';

/**
 * Status Badge for Customer Inquiries listing.
 * Maps status keys to high-contrast tags.
 */
export const ContactStatusBadge = ({ status = 'unread' }) => {
  const normStatus = status.toLowerCase();

  let styles = 'bg-neutral-100 text-neutral-600 border-neutral-200';
  let label = status;

  if (normStatus === 'unread') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
    label = 'Unread';
  } else if (normStatus === 'read') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Read';
  } else if (normStatus === 'archived') {
    styles = 'bg-neutral-50 text-neutral-500 border-neutral-200';
    label = 'Archived';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${styles}`}>
      {label}
    </span>
  );
};

export default ContactStatusBadge;
