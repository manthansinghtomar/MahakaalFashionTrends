import React from 'react';
import ProductDetailsClient from '@/components/product-details/ProductDetailsClient.jsx';
import productService from '@/services/product.service.js';
import { generatePageMetadata } from '@/utils/metadata.js';

/**
 * Dynamic metadata generator (Next.js Server Side).
 * Safely fetches product details to construct title, description, and keywords.
 * Includes catch blocks to prevent build failures if the database/backend is unavailable during compilation.
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await productService.getProductBySlug(slug);
    if (response && response.success && response.product) {
      const { name, description, brand, category } = response.product;
      const categoryName = typeof category === 'object' && category ? category.name : '';

      return generatePageMetadata({
        title: name,
        description: description ? description.substring(0, 160) : 'Premium ethnic clothing detail.',
        keywords: [brand, categoryName, 'traditional menswear', 'kurta fit'].filter(Boolean),
      });
    }
  } catch (err) {
    // Fail silently to prevent build failures during build-time dynamic routes scanning
  }

  // Fallback metadata
  return generatePageMetadata({
    title: 'Product Details',
    description: 'Detailed view of our selected ethnic kurtas and traditional designer outfits.',
    keywords: ['ethnic kurta fit', 'traditional sizing', 'care instructions'],
  });
}

/**
 * Product detail page server-side entry.
 * Awaits Next.js params and renders the ProductDetailsClient coordinator.
 */
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  return (
    <ProductDetailsClient slug={slug} />
  );
}
