"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import Loading from '@/components/ui/Loading.jsx';

import ProfileHeader from './ProfileHeader.jsx';
import ProfileInfoCard from './ProfileInfoCard.jsx';
import ProfileActions from './ProfileActions.jsx';

/**
 * Client coordinator for user profile dashboard.
 * Binds directly to currentUser from AuthContext.
 */
export const ProfileClient = () => {
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

  // Failsafe if user is not resolved (ProtectedRoute handles redirection)
  if (!currentUser) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Page Header */}
      <ProfileHeader />

      {/* Profile info card detail */}
      <ProfileInfoCard user={currentUser} />

      {/* Available actions */}
      <ProfileActions />
    </div>
  );
};

export default ProfileClient;
