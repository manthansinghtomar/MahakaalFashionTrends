import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute.jsx';
import ProfileClient from '@/components/profile/ProfileClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'My Profile',
  description: 'Manage your customer profile, shipping addresses, and personal details.',
  keywords: ['personal configurations', 'account parameters', 'billing settings'],
});

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileClient />
    </ProtectedRoute>
  );
}
