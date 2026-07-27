"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import offerService from '@/services/offer.service.js';
import OfferCarousel from '@/components/sections/offers/OfferCarousel.jsx';

import OffersPageHeader from './OffersPageHeader.jsx';
import OffersGrid from './OffersGrid.jsx';

/**
 * OffersClient coordinator component.
 * Coordinates fetching campaigns, renders 3-second automated offer carousel with hover hold, and lists all campaigns.
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

  // Identify active and upcoming offers for the automated carousel
  const activeOffers = offers.filter((o) => {
    const isUpcomingOrActive = o.status === 'active' || o.status === 'upcoming';
    const isDateExpired = o.endDate ? new Date(o.endDate) < new Date() : false;
    return isUpcomingOrActive && !isDateExpired;
  });

  // Display offers carousel fallback to all fetched offers if none strictly filtered
  const carouselOffers = activeOffers.length > 0 ? activeOffers : offers;

  return (
    <div className="w-full bg-neutral-50 min-h-screen">
      {/* Editorial Dark Hero Header */}
      <OffersPageHeader />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 space-y-12">

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
          {/* Featured Carousel Block (3-second auto slide with hover pause) */}
          {carouselOffers.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-secondary">
                  SPOTLIGHT DEALS
                </span>
                <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                  Featured Promotional Banners
                </h2>
              </div>
              <OfferCarousel offers={carouselOffers} />
            </div>
          )}

          {/* Grid listing section */}
          {offers.length > 0 && (
            <div className="space-y-8">
              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  CAMPAIGNS DIRECTORY
                </span>
                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  All Promotional Offers
                </h3>
              </div>
              <OffersGrid offers={offers} />
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default OffersClient;
