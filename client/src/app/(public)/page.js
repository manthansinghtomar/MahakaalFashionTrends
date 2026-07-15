import React from 'react';
import HeroSection from '@/components/sections/HeroSection.jsx';
import CategoriesSection from '@/components/sections/CategoriesSection.jsx';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection.jsx';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Home',
  description: 'Welcome to Mahakaal Fashion Trends. Shop the latest ethnic designer Kurtas and clothing collections.',
  keywords: ['fashion', 'ethnic wear', 'designer kurtas', 'indian clothing'],
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
    </>
  );
}
