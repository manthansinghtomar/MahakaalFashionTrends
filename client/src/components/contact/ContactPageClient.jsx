'use client';

import React from 'react';
import ContactForm from './ContactForm.jsx';
import Container from '@/components/ui/Container.jsx';

/**
 * ContactPageClient component (Client Component).
 * Coordinates the responsive grid container, rendering the static contact information
 * and location cards alongside the interactive contact inquiry form.
 */
export const ContactPageClient = ({ contactInfo, contactMap }) => {
  return (
    <Container className="py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Contact details and maps (Server Components) */}
        <div className="space-y-8">
          {contactInfo}
          {contactMap}
        </div>

        {/* Right Column: Submission Form (Client Component) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/60 shadow-xs">
          <ContactForm />
        </div>
      </div>
    </Container>
  );
};

export default ContactPageClient;
