import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Checkout',
  description: 'Complete your purchase details, shipping addresses, and billing options.',
  keywords: ['checkout billing', 'shipping info', 'purchase step'],
});

export default function CheckoutPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Checkout</h1>
      <p className="mt-2 text-sm text-neutral-500">Provide payment and delivery addresses to place orders.</p>
    </div>
  );
}
