import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'My Wishlist',
  description: 'View the list of saved traditional clothing and Kurtas for future checkout.',
  keywords: ['favorite kurtas', 'saved outfits list', 'ethnic bookmarking'],
});

export default function WishlistPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">My Wishlist</h1>
      <p className="mt-2 text-sm text-neutral-500">Saved items catalog listing.</p>
    </div>
  );
}
