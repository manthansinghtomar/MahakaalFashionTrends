import React from 'react';
import CategoriesClient from '@/components/admin/categories/CategoriesClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Categories Management',
  description: 'Manage brand ethnic apparel categories, adjust list orders, and customize collection description directories.',
  keywords: ['catalog categorizations', 'admin categories console', 'collection directories configuration'],
});

export default function AdminCategoriesPage() {
  return (
    <CategoriesClient />
  );
}
