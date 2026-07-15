import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Shopping Cart',
  description: 'View items in your shopping cart and proceed to checkout.',
  keywords: ['shopping cart', 'checkout prep', 'bag items list'],
});

export default function CartPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Shopping Cart</h1>
      <p className="mt-2 text-sm text-neutral-500">Items selected for purchase will appear here.</p>
    </div>
  );
}
