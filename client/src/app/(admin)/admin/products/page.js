import React from 'react';
import ProductsClient from '@/components/admin/products/ProductsClient.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Products Management',
  description: 'Manage sales items, add traditional wears, customize sizing arrays, and coordinate retail pricing.',
  keywords: ['inventory management', 'admin products console', 'ethnic catalog settings'],
});

export default function AdminProductsPage() {
  return (
    <ProductsClient />
  );
}
