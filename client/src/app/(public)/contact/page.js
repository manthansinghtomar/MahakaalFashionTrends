import React from 'react';

import { generatePageMetadata } from '@/utils/metadata.js';
import {
  ContactHero,
  ContactInfo,
  ContactMap,
  ContactPageClient,
} from '@/components/contact/index.js';

export const metadata = generatePageMetadata({
  title: 'Contact Us',
  description: 'Reach out to customer support at Mahakaal Fashion Trends for help with orders and styles.',
  keywords: ['customer support line', 'support email', 'office coordinates'],
});

export default function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-neutral-50 min-h-screen">
      <ContactHero />
      <ContactPageClient
        contactInfo={<ContactInfo />}
        contactMap={<ContactMap />}
      />
    </div>
  );
}

