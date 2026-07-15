import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Manage Products',
  description: 'Create, update, and manage product listings and inventory.',
  keywords: ['product management', 'inventory control', 'admin products'],
});

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Manage Products</h1>
      <p className="mt-2 text-sm text-neutral-500">Add, edit, or delete items in the store catalog.</p>
    </div>
  );
}
