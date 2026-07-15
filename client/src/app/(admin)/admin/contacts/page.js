import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Customer Inquiries',
  description: 'Review and manage contact submissions, support feedback, and queries.',
  keywords: ['contacts manager', 'user feedback', 'admin inquiry panel'],
});

export default function AdminContactsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-800">Customer Inquiries</h1>
      <p className="mt-2 text-sm text-neutral-500">Manage message logs submitted through the support portal.</p>
    </div>
  );
}
