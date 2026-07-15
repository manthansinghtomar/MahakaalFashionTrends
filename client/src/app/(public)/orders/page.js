import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'My Orders',
  description: 'View your order history, shipment updates, and track deliveries.',
  keywords: ['order history', 'purchase invoices', 'delivery details tracking'],
});

export default function OrdersPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">My Orders</h1>
      <p className="mt-2 text-sm text-neutral-500">Track current shipment dispatches or review past purchase history.</p>
    </div>
  );
}
