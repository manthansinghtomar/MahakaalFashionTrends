import React from 'react';
import SubscribersClient from '@/components/admin/subscribers/SubscribersClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Subscribers Management',
  description: 'Manage newsletter subscriptions for Mahakaal Fashion Trends.',
  keywords: ['newsletter subscribers', 'admin subscribers console', 'email list'],
});

export default function AdminSubscribersPage() {
  return <SubscribersClient />;
}
