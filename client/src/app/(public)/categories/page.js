import React from 'react';
import CategoriesClient from '@/components/categories/CategoriesClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Categories',
  description: 'Explore the full catalog of ethnic wear sorted by curated collections and category divisions.',
  keywords: ['ethnic categories', 'traditional collections', 'trending kurtas'],
});

export default function CategoriesPage() {
  return (
    <CategoriesClient />
  );
}
