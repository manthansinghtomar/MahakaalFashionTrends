import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Shop Products',
  description: 'Explore the full catalog of premium ethnic clothing, traditional Kurtas, and suits.',
  keywords: ['ethnic collection', 'kurtas listing', 'mens traditional clothing'],
});

export default function ProductsPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Shop Catalog</h1>
      <p className="mt-2 text-sm text-neutral-500">Explore traditional kurtas and suits collection.</p>
    </div>
  );
}
