"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import offerService from '@/services/offer.service.js';
import OfferBanner from './OfferBanner.jsx';

/**
 * OffersSection component for the homepage.
 * Fetches the active offers from backend on mount.
 * Renders the highest priority (latest) active offer in a premium banner.
 * Hides itself completely if no active offers exist.
 */
export const OffersSection = () => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveOffer = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active offers. We request the first page with a small limit,
      // as we only need the latest active offer.
      const response = await offerService.getAllOffers({
        page: 1,
        limit: 5, // fetch a few to choose from if needed
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.offers && response.offers.length > 0) {
        // Since backend already sorts active offers by createdAt desc,
        // response.offers[0] is the latest active offer.
        setOffer(response.offers[0]);
      } else {
        setOffer(null);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to load promotional offers.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchActiveOffer(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchActiveOffer]);

  if (loading) {
    return (
      <section className="w-full bg-white py-20 border-b border-neutral-100" aria-busy="true">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loading size="lg" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Error message={error} retry={() => fetchActiveOffer()} />
        </div>
      </section>
    );
  }

  // If no active offers exist, do not render the section at all.
  if (!offer) {
    return null;
  }

  return (
    <section className="w-full bg-white py-20 border-b border-neutral-100" aria-label="Promotional Offers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OfferBanner offer={offer} />
      </div>
    </section>
  );
};

export default OffersSection;
