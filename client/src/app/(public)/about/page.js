import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';
import {
  AboutHero,
  BrandStory,
  MissionVision,
  Craftsmanship,
  BrandValues,
  AboutCTA,
} from '@/components/about/index.js';

export const metadata = generatePageMetadata({
  title: 'About Us',
  description: 'Learn more about Mahakaal Fashion Trends, our values, and designer ethnic wear legacy.',
  keywords: ['ethnic heritage', 'indian fashion history', 'traditional values'],
});

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-neutral-50 min-h-screen">
      <AboutHero />
      <BrandStory />
      <MissionVision />
      <Craftsmanship />
      <BrandValues />
      <AboutCTA />
    </div>
  );
}

