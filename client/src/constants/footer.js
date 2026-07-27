/**
 * Centralized configurable footer placeholder settings.
 * Allows changes to categories list, social buttons, and addresses
 * without updating structural HTML markup.
 */

export const FOOTER_CATEGORIES = [
  { label: 'Polo T-Shirts', href: '/products?category=polo-t-shirts' },
  { label: 'Casual & Formal Shirts', href: '/products?category=shirts' },
  { label: 'Denim Jeans', href: '/products?category=jeans' },
  { label: 'Trousers', href: '/products?category=trousers' },
  { label: 'Lowers & Joggers', href: '/products?category=lowers' },
  { label: 'Belts & Accessories', href: '/products?category=belts' },
  { label: 'Kids Wear', href: '/products?category=kids-wear' },
];

export const FOOTER_CONTACT = {
  email: 'mahakaalfashiontrends@gmail.com',
  phone: '+91 74892 16281, +91 79872 55913',
  address: 'House no.164 Line no.1 Birla Nagar Hazira, Gwalior, Madhya Pradesh, India',
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
