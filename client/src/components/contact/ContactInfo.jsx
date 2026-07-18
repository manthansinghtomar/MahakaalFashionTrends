import React from 'react';
import { FOOTER_CONTACT } from '@/constants/index.js';

/**
 * ContactInfo component.
 * Rendered as a React Server Component.
 * Displays brand contact details (email, phone, address, and business hours) in a clean list layout.
 */
export const ContactInfo = () => {
  const contactDetails = [
    {
      label: 'Email Inquiries',
      value: FOOTER_CONTACT.email,
      href: `mailto:${FOOTER_CONTACT.email}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      label: 'Phone Concierge',
      value: FOOTER_CONTACT.phone,
      href: `tel:${FOOTER_CONTACT.phone.replace(/\s+/g, '')}`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.806-5.194-4.178-7-7l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.11-1.008H5.036a2.25 2.25 0 00-2.25 2.25v1.356z" />
        </svg>
      ),
    },
    {
      label: 'Flagship Atelier',
      value: FOOTER_CONTACT.address,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
        </svg>
      ),
    },
    {
      label: 'Business Hours',
      value: FOOTER_CONTACT.businessHours,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Contact Details
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Connect with us via any of our digital or physical touchpoints. Our team replies to email inquiries within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {contactDetails.map((detail, idx) => (
          <div 
            key={idx}
            className="group relative bg-white p-5 rounded-xl border border-neutral-200/60 hover:border-secondary/20 shadow-xs transition-all duration-300"
          >
            {/* Soft gold border on card hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-xl origin-left" />

            <div className="flex items-start space-x-3.5">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neutral-50 text-neutral-900 group-hover:bg-secondary/10 group-hover:text-secondary border border-neutral-100 flex items-center justify-center transition-colors">
                {detail.icon}
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {detail.label}
                </span>
                {detail.href ? (
                  <a 
                    href={detail.href} 
                    className="block text-sm font-semibold text-neutral-900 hover:text-secondary hover:underline transition-all"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <span className="block text-sm font-semibold text-neutral-800 leading-normal">
                    {detail.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactInfo;
