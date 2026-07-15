import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Product Details',
  description: 'Detailed view of selected ethnic kurtas and traditional outfits.',
  keywords: ['ethnic kurta fit', 'traditional sizing', 'care instructions'],
});

export default function ProductDetailPage({ params }) {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Product Detail</h1>
      <p className="mt-2 text-sm text-neutral-500">Details for item slug: {params?.slug || 'Item Slug'}</p>
    </div>
  );
}
