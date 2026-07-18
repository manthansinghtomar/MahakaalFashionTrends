"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import dashboardService from '@/services/dashboard.service.js';

import StatsCards from './StatsCards.jsx';
import QuickActions from './QuickActions.jsx';
import RecentActivity from './RecentActivity.jsx';

/**
 * DashboardClient component (Client Coordinator).
 * Manages parallel API fetches for dashboard statistics and lists.
 */
export const DashboardClient = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getOverview();
      
      if (response && response.success && response.data) {
        setOverview(response.data);
      } else {
        setOverview(null);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve admin dashboard summary.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchDashboardData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchDashboardData]);

  return (
    <div className="space-y-10">
      
      {/* 1. Header Page Details */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
          BUSINESS INSIGHTS
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Executive Overview
        </h2>
        <p className="text-sm text-neutral-500 max-w-xl leading-relaxed">
          Monitor your catalog performance, check pending customer inquiries, and navigate console services.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[400px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Compiling Dashboard Data...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchDashboardData()} />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Statistics Indicators */}
          <StatsCards overview={overview} />

          {/* Quick Shortcuts */}
          <QuickActions />

          {/* Activity Tables */}
          <RecentActivity overview={overview} />
        </div>
      )}

    </div>
  );
};

export default DashboardClient;
