import React from 'react';
import ContactsClient from '@/components/admin/contacts/ContactsClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Inquiries Management',
  description: 'Monitor and review support inquiries, customer feedback submissions, and queries.',
  keywords: ['customer inquiries logs', 'admin contacts console', 'message logs directory'],
});

export default function AdminContactsPage() {
  return (
    <ContactsClient />
  );
}
