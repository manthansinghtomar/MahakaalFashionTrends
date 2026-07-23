"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Loading from '@/components/ui/Loading.jsx';
import Error from '@/components/ui/Error.jsx';
import dashboardService from '@/services/dashboard.service.js';

import SettingsSection from './SettingsSection.jsx';
import SettingsCard from './SettingsCard.jsx';
import SettingsForm from './SettingsForm.jsx';
import RecentlyDeleted from './RecentlyDeleted.jsx';

/**
 * SettingsClient component (Client Coordinator).
 * Fetches system diagnostics from the backend and wraps them in read-only cards.
 * Exposes local interface toggles and Recently Deleted items management.
 */
export const SettingsClient = () => {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'recently-deleted'
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch server diagnostics
  const fetchSettings = useCallback(async (signal = null) => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getSystemStatus({
        ...(signal ? { signal } : {}),
      });

      if (response && response.success && response.health) {
        setSystemStatus(response.health);
      } else {
        throw new Error('System diagnostic payload was empty or malformed.');
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setError(err.message || 'Failed to retrieve backend settings.');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchSettings(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchSettings]);

  // Formats bytes to MB helper
  const formatMB = (bytes) => {
    if (!bytes) return 'N/A';
    return `${Math.round(bytes / 1024 / 1024)} MB`;
  };

  // Formats seconds to readable string helper
  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m (${Math.round(seconds)}s)`;
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-secondary">
            CONSOLE SETTINGS
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            {activeTab === 'settings' ? 'System Preferences' : 'Trash & Deleted Catalog'}
          </h2>
          <p className="text-sm text-neutral-500 max-w-lg leading-relaxed">
            {activeTab === 'settings' 
              ? 'Monitor API environments, backend engines, database performance, and customize interface details.'
              : 'Review soft-deleted product items, restore them to store display, or permanently purge them.'
            }
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-white text-neutral-950 shadow-xs font-extrabold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Diagnostics
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recently-deleted')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'recently-deleted'
                ? 'bg-white text-red-600 shadow-xs font-extrabold'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Recently Deleted Items
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'recently-deleted' ? (
        <RecentlyDeleted />
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-32 min-h-[300px]">
          <Loading size="lg" />
          <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
            Fetching system settings...
          </span>
        </div>
      ) : error ? (
        <div className="py-16">
          <Error message={error} retry={() => fetchSettings()} />
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Section 1: Server Environment Status */}
          <SettingsSection 
            title="Server Engine Status"
            description="Diagnostic metrics and host engine variables returned by the running API Node server."
          >
            {/* Server Status Card */}
            <SettingsCard
              label="Node Server Status"
              value={systemStatus?.serverStatus}
              icon={
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                </span>
              }
            />

            {/* Node Version Card */}
            <SettingsCard
              label="NodeJS Runtime Version"
              value={systemStatus?.nodeVersion}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
              }
            />

            {/* Runtime Environment Card */}
            <SettingsCard
              label="Environment Mode"
              value={systemStatus?.environment}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Section 2: Database Configuration */}
          <SettingsSection 
            title="Database Configuration"
            description="Information describing your connected MongoDB database instance."
          >
            {/* Database State Card */}
            <SettingsCard
              label="Mongoose Database Connection"
              value={systemStatus?.databaseStatus}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V10.125m16.5 0v3.75m-16.5-3.75v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V13.875" />
                </svg>
              }
            />

            {/* MongoDB Version Card */}
            <SettingsCard
              label="MongoDB Server Version"
              value={systemStatus?.mongodbVersion}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.518.408l-.023.007a.75.75 0 01-.536-.395zM16.5 10.5h.008v.008H16.5V10.5zm-6 1.5h.008v.008h-.008V12zm-3-1.5h.008v.008H7.5V10.5zm6-6h.008v.008H13.5V4.5zm-6 0h.008v.008H7.5V4.5zm0 15h.008v.008H7.5V19.5zm6 0h.008v.008H13.5V19.5zm6 0h.008v.008H19.5V19.5z" />
                </svg>
              }
            />

            {/* API Version Card */}
            <SettingsCard
              label="REST API Gateway Version"
              value={systemStatus?.apiVersion}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Section 3: Diagnostic Analytics */}
          <SettingsSection 
            title="System Diagnostics"
            description="Real-time Node process diagnostics, heap footprint parameters, and system uptime stats."
          >
            {/* Memory RSS Card */}
            <SettingsCard
              label="Resident Set Size (RSS)"
              value={formatMB(systemStatus?.memoryUsage?.rss)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
              }
            />

            {/* Heap Used Card */}
            <SettingsCard
              label="Heap Memory Allocated / Used"
              value={`${formatMB(systemStatus?.memoryUsage?.heapUsed)} / ${formatMB(systemStatus?.memoryUsage?.heapTotal)}`}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0V6.75m0 9.75v1.5a2.25 2.25 0 002.25 2.25h1.5a2.25 2.25 0 002.25-2.25v-1.5m-6 0v-6" />
                </svg>
              }
            />

            {/* Uptime Card */}
            <SettingsCard
              label="Process Run Uptime"
              value={formatUptime(systemStatus?.processUptime)}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </SettingsSection>

          {/* Section 4: Local Form Customizations */}
          <div className="max-w-xl">
            <SettingsForm />
          </div>

        </div>
      )}

    </div>
  );
};

export default SettingsClient;
