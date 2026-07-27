"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import offerService from '@/services/offer.service.js';
import OfferCarousel from './OfferCarousel.jsx';

/**
 * OffersSection component for the homepage.
 * Fetches all active offers from backend and renders an automated 3-second carousel slider.
 * Pauses automatically when the user hovers their cursor over the banner.
 */
export const OffersSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActiveOffers = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch active offers listing
      const response = await offerService.getAllOffers({
        page: 1,
        limit: 10,
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.offers && response.offers.length > 0) {
        setOffers(response.offers);
      } else {
        setOffers([]);
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
    fetchActiveOffers(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchActiveOffers]);

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
          <Error message={error} retry={() => fetchActiveOffers()} />
        </div>
      </section>
    );
  }

  // If no active offers exist, do not render the section
  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-20 border-b border-neutral-100" aria-label="Promotional Offers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <OfferCarousel offers={offers} />
      </div>
    </section>
  );
};

export default OffersSection;
