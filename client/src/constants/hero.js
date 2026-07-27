/**
 * Centralized configurable Home Hero Section settings.
 * Allows customizing titles, descriptions, buttons, images, alignments,
 * and visual theme styles without modifying component React structure.
 */

export const HERO_CONFIG = {
  // Editorial label shown at the top
  label: "MEN'S FASHION STORE • GWALIOR",
  
  // Editorial main header text
  title: "Trendy Men's Wear At Affordable Prices",
  
  // Detailed description copy
  description: 'Discover stylish Polo T-Shirts, Shirts, Jeans, Trousers, Lowers, Belts and Kids Wear at Mahakaal Fashion Trends. Visit our store in Birla Nagar, Gwalior for quality products at affordable prices.',
  
  // Primary CTA Button options
  primaryCta: {
    label: 'SHOP NOW',
    href: '/products',
  },
  
  // Secondary CTA Button options
  secondaryCta: {
    label: 'VIEW CATEGORIES',
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
