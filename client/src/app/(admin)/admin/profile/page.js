import React from 'react';
import AdminProfileClient from '@/components/admin/profile/AdminProfileClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Console Profile',
  description: 'Manage administrator details, credentials, and console profile configuration details.',
  keywords: ['admin console profile', 'security credentials', 'account settings'],
});

export default function AdminProfilePage() {
  return (
    <AdminProfileClient />
  );
}
