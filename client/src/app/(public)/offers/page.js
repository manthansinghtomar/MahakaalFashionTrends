import React from 'react';
import OffersClient from '@/components/offers/OffersClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Special Offers',
  description: 'Shop active discount coupons, festival promotion banners, and seasonal campaigns.',
  keywords: ['ethnic sales', 'traditional coupon codes', 'discount kurtas'],
});

export default function OffersPage() {
  return (
    <OffersClient />
  );
}
