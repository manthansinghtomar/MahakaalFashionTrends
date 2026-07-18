import React from 'react';
import DashboardClient from '@/components/admin/DashboardClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Admin Dashboard',
  description: 'Manage sales dashboards, order metrics, customer actions, and store status overview.',
  keywords: ['analytics overview', 'admin statistics panel', 'dashboard summary'],
});

export default function AdminDashboardPage() {
  return (
    <DashboardClient />
  );
}
