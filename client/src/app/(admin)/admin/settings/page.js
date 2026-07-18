import React from 'react';
import SettingsClient from '@/components/admin/settings/SettingsClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Console Settings',
  description: 'Manage administrator system settings, API runtime configurations, and page style preferences.',
  keywords: ['admin console settings', 'global system properties', 'layout setups'],
});

export default function AdminSettingsPage() {
  return (
    <SettingsClient />
  );
}
