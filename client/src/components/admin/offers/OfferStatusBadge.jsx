import React from 'react';

/**
 * Status Badge for Offers listing.
 * Maps status keys to localized high-contrast tags.
 */
export const OfferStatusBadge = ({ status = 'active' }) => {
  const normStatus = status.toLowerCase();

  let styles = 'bg-neutral-100 text-neutral-600 border-neutral-200';
  let label = status;

  if (normStatus === 'active') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Active';
  } else if (normStatus === 'upcoming') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Upcoming';
  } else if (normStatus === 'expired') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200';
    label = 'Expired';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${styles}`}>
      {label}
    </span>
  );
};

export default OfferStatusBadge;
