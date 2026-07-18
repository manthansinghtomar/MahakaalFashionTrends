"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import offerService from '@/services/offer.service.js';
import OfferBanner from '@/components/sections/offers/OfferBanner.jsx';

import OffersPageHeader from './OffersPageHeader.jsx';
import OffersGrid from './OffersGrid.jsx';

/**
 * OffersClient coordinator component.
 * Coordinates fetching campaigns, separates featured active banners, and renders lists.
 */
export const OffersClient = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffersList = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await offerService.getAllOffers({
        page: 1,
        limit: 100, // Fetch all available campaigns
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.offers) {
        setOffers(response.offers);
      } else {
        setOffers([]);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve campaigns.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchOffersList(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchOffersList]);

  // 1. Identify active offers to select the latest one for the Featured Banner
  const activeOffers = offers.filter((o) => {
    const isBackendActive = o.status === 'active' && o.isActive === true;
    const isDateExpired = o.endDate ? new Date(o.endDate) < new Date() : false;
    return isBackendActive && !isDateExpired;
  });

  // Pick the latest/first active offer as featured
  const featuredOffer = activeOffers.length > 0 ? activeOffers[0] : null;

  // 2. Filter out the featured offer from the remaining grid listing
  const gridOffers = featuredOffer
    ? offers.filter((o) => o._id !== featuredOffer._id && o.id !== featuredOffer.id)
    : offers;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Editorial Header */}
      <OffersPageHeader />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Loading Campaigns...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchOffersList()} />
        </div>
      ) : offers.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No Offers Active"
            description="We currently have no private campaigns or special discounts active. Please subscribe to our newsletter to stay updated."
          />
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Active Offer Block (Only show if at least one active offer exists) */}
          {featuredOffer && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">
                  SPOTLIGHT DEAL
                </span>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                  Featured Promotion
                </h2>
              </div>
              <div className="border border-neutral-100 rounded-3xl overflow-hidden shadow-xs">
                <OfferBanner offer={featuredOffer} />
              </div>
            </div>
          )}

          {/* Grid section */}
          {gridOffers.length > 0 && (
            <div className="space-y-8">
              {(featuredOffer) && (
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                    ADDITIONAL DEALS
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                    All Active & Past Campaigns
                  </h3>
                </div>
              )}
              <OffersGrid offers={gridOffers} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OffersClient;
