import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'My Profile',
  description: 'Manage your customer profile, shipping addresses, and personal details.',
  keywords: ['personal configurations', 'account parameters', 'billing settings'],
});

export default function ProfilePage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">My Account Profile</h1>
      <p className="mt-2 text-sm text-neutral-500">Configure your personal profile details.</p>
    </div>
  );
}
