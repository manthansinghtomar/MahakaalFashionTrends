import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Admin Dashboard',
  description: 'Manage sales dashboards, order metrics, customer actions, and store status overview.',
  keywords: ['analytics overview', 'admin statistics panel', 'dashboard summary'],
});

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-500">Welcome to the administration console.</p>
    </div>
  );
}
