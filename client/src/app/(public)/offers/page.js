import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Special Offers',
  description: 'Shop active discount coupons, festival promotion banners, and seasonal campaigns.',
  keywords: ['ethnic sales', 'traditional coupon codes', 'discount kurtas'],
});

export default function OffersPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Special Campaigns & Offers</h1>
      <p className="mt-2 text-sm text-neutral-500">Discover ongoing seasonal deals.</p>
    </div>
  );
}
