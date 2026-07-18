"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import reviewService from '@/services/review.service.js';
import ReviewCard from './ReviewCard.jsx';

/**
 * ReviewsSection component.
 * Fetches recent approved reviews on mount.
 * Displays a 3-column layout on desktop, 2-column on tablet, and 1-column on mobile.
 * Gracefully hides itself if no reviews are available.
 */
export const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentReviews = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      // Query recent reviews (limiting to 6 for the 3-column layout)
      const response = await reviewService.getRecentReviews({
        limit: 6,
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.reviews) {
        setReviews(response.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to load customer reviews.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRecentReviews(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchRecentReviews]);

  if (loading) {
    return (
      <section className="w-full bg-white py-20 border-b border-neutral-100" aria-busy="true">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto animate-pulse">
            <div className="h-4 w-32 bg-neutral-100 rounded-full" />
            <div className="h-8 w-64 bg-neutral-100 rounded-lg" />
            <div className="h-4 w-96 bg-neutral-100 rounded-lg" />
          </div>
          {/* Spinner */}
          <div className="flex justify-center py-12">
            <Loading size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white py-20 border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Error message={error} retry={() => fetchRecentReviews()} />
        </div>
      </section>
    );
  }

  // Gracefully hide the section if no reviews exist
  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section 
      className="w-full bg-white py-20 border-b border-neutral-100"
      aria-labelledby="reviews-section-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            CUSTOMER EXPERIENCES
          </span>
          <h2 
            id="reviews-section-title"
            className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900"
          >
            What Our Customers Say
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            Read real feedback and shopping experiences from our valued community who enjoy the luxury fit of our ethnic collections.
          </p>
        </div>

        {/* Reviews Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;
