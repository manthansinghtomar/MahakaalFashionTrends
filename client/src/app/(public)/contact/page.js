import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Reach out to customer support at Mahakaal Fashion Trends for help with orders and styles.',
  keywords: ['customer support line', 'support email', 'office coordinates'],
});

export default function ContactPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Contact Us</h1>
      <p className="mt-2 text-sm text-neutral-500">Reach out to our customer support office.</p>
    </div>
  );
}
