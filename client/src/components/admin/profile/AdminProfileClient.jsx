"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import Loading from '@/components/ui/Loading.jsx';

import ProfileHeader from '@/components/profile/ProfileHeader.jsx';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard.jsx';
import ProfileActions from '@/components/profile/ProfileActions.jsx';

/**
 * AdminProfileClient coordinator for the admin console profile dashboard.
 * Separated from customer profile space to custom redirect behavior.
 */
export const AdminProfileClient = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 flex flex-col items-center justify-center min-h-[400px]">
        <Loading size="lg" />
        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-widest mt-4 animate-pulse">
          Loading Profile Session...
        </span>
      </div>
    );
  }

  // Failsafe (layout routing handles protection)
  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <ProfileHeader />

      {/* Profile Details Card */}
      <ProfileInfoCard user={currentUser} />

      {/* Profile modification actions with admin redirections */}
      <ProfileActions showSignOut={true} logoutRedirect="/login" />
    </div>
  );
};

export default AdminProfileClient;
