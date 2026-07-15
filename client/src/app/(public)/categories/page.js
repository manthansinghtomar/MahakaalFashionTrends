import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Categories',
  description: 'Browse the collection of outfits sorted by categories.',
  keywords: ['ethnic categories', 'clothing classifications', 'trending sections'],
});

export default function CategoriesPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Categories</h1>
      <p className="mt-2 text-sm text-neutral-500">Filter traditional wear by category divisions.</p>
    </div>
  );
}
