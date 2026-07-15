import React from 'react';

/**
 * Placeholder component for rendering individual promotional campaign offers.
 */
export const OfferCard = ({ offer }) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-900 text-white p-6 hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <div>
          <span className="inline-block bg-amber-500 text-neutral-950 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
            {offer?.discountPercentage || 0}% OFF
          </span>
          <h3 className="text-xl font-bold">{offer?.title || 'Offer Banner'}</h3>
          <p className="mt-2 text-xs text-neutral-400">{offer?.description || 'Campaign details placeholder'}</p>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
