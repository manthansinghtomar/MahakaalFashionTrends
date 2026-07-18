import React from 'react';
import OffersClient from '@/components/admin/offers/OffersClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Offers Management',
  description: 'Configure and monitor promotional campaign banners, discount offers, and seasonal sales.',
  keywords: ['campaign management', 'admin offers console', 'sales setup settings'],
});

export default function AdminOffersPage() {
  return (
    <OffersClient />
  );
}
