import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Manage Categories',
  description: 'Organize and structure your store with categories.',
  keywords: ['category management', 'catalog layout', 'admin categories'],
});

export default function AdminCategoriesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Manage Categories</h1>
      <p className="mt-2 text-sm text-neutral-500">Manage store classifications and collections.</p>
    </div>
  );
}
