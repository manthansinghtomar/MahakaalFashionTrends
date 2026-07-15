/**
 * Centralized configurable Home Hero Section settings.
 * Allows customizing titles, descriptions, buttons, images, alignments,
 * and visual theme styles without modifying component React structure.
 */

export const HERO_CONFIG = {
  // Editorial label shown at the top
  label: "Premium Men's Collection",
  
  // Editorial main header text
  title: 'Premium Ethnic Wear For The Modern Gentleman',
  
  // Detailed description copy
  description: 'Discover premium kurtas, sherwanis, Nehru jackets and ethnic wear crafted for weddings, festivals and every special occasion.',
  
  // Primary CTA Button options
  primaryCta: {
    label: 'Shop Collection',
    href: '/products',
  },
  
  // Secondary CTA Button options
  secondaryCta: {
    label: 'Explore Categories',
    href: '/categories',
  },
  
  // Default image asset configurations (supports local and remote/Cloudinary URLs)
  image: {
    src: '/images/hero-placeholder.png',
    alt: 'Mahakaal Fashion Trends Editorial Collection Banner',
  },

  // Optional promotional badge overlay (e.g. 'NEW', 'LIMITED EDITION', 'BESTSELLER')
  // Keep it null or empty to hide by default
  badge: null,
  
  // Layout customization options
  alignment: 'left', // Supported values: 'left' | 'right' | 'center'
  theme: 'light',     // Supported values: 'light' | 'dark'
};
