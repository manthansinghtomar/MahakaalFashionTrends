/**
 * Centralized configurable footer placeholder settings.
 * Allows changes to categories list, social buttons, and addresses
 * without updating structural HTML markup.
 */

export const FOOTER_CATEGORIES = [
  { label: 'Designer Kurtas', href: '/products?category=designer-kurtas' },
  { label: 'Sherwanis & Suits', href: '/products?category=sherwanis-suits' },
  { label: 'Traditional Kurtis', href: '/products?category=traditional-kurtis' },
  { label: 'Ethnic Nehru Jackets', href: '/products?category=nehru-jackets' },
  { label: 'Festive Accessories', href: '/products?category=accessories' },
];

export const FOOTER_CONTACT = {
  email: 'care@mahakaalfashiontrends.com',
  phone: '+91 98765 43210',
  address: '108, Lord Shiva Enclave, Ujjain, Madhya Pradesh, India',
  businessHours: 'Mon - Sat: 10:00 AM - 8:00 PM (IST)',
};

export const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/mahakaalfashiontrends',
    icon: 'Instagram',
    isEnabled: true,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/mahakaalfashiontrends',
    icon: 'Facebook',
    isEnabled: true,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/mahakaalfashiontrends',
    icon: 'YouTube',
    isEnabled: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/mahakaalfashiontrends',
    icon: 'LinkedIn',
    isEnabled: true,
  },
];
