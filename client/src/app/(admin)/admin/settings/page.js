import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Console Settings',
  description: 'Admin configuration parameters, system preferences, and security settings.',
  keywords: ['admin console settings', 'global constants config', 'system setups'],
});

export default function AdminSettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Console Settings</h1>
      <p className="mt-2 text-sm text-neutral-500">Configure global parameters and preference flags.</p>
    </div>
  );
}
