import React from 'react';
import ProductsListClient from '@/components/products/ProductsListClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Shop Products',
  description: 'Explore the full catalog of premium ethnic clothing, traditional Kurtas, and suits.',
  keywords: ['ethnic collection', 'kurtas listing', 'mens traditional clothing'],
});

export default function ProductsPage() {
  return (
    <ProductsListClient />
  );
}
