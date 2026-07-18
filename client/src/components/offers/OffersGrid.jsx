import React from 'react';
import OfferCard from './OfferCard.jsx';

/**
 * Grid mapping Offer cards.
 */
export const OffersGrid = ({ offers = [] }) => {
  if (!offers || offers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {offers.map((offer) => (
        <OfferCard key={offer._id || offer.id} offer={offer} />
      ))}
    </div>
  );
};

export default OffersGrid;
