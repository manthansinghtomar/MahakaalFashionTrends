import React from 'react';

/**
 * Header for the Offers & Campaigns listing page.
 */
export const OffersPageHeader = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
        EXCLUSIVE CAMPAIGNS
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
        Offers & Private Promotions
      </h1>
      <p className="text-base text-neutral-500 leading-relaxed">
        Access member-only seasonal discounts, premium tailored collections promotions, and private ethnic wear campaigns.
      </p>
    </div>
  );
};

export default OffersPageHeader;
