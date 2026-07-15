import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn more about Mahakaal Fashion Trends, our values, and designer ethnic wear legacy.',
  keywords: ['ethnic heritage', 'indian fashion history', 'traditional values'],
});

export default function AboutPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">About Us</h1>
      <p className="mt-2 text-sm text-neutral-500">Mahakaal Fashion Trends Brand legacy.</p>
    </div>
  );
}
