import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Manage Offers',
  description: 'Configure and monitor promotional discount offers, coupons, and seasonal sales.',
  keywords: ['deals configurations', 'promotional items', 'admin offers'],
});

export default function AdminOffersPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Manage Offers</h1>
      <p className="mt-2 text-sm text-neutral-500">Control active promotion campaigns and coupon lists.</p>
    </div>
  );
}
