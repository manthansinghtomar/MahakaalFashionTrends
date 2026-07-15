/**
 * Centralized configurable Home Categories settings.
 * Allows managing categories array mapping (names, slugs, descriptions, display orders)
 * without editing React markup.
 */

export const CATEGORIES_CONFIG = [
  {
    id: 'kurtas',
    name: 'Designer Kurtas',
    slug: 'designer-kurtas',
    image: '/images/category-kurtas.png',
    description: 'Elegant kurtas for festive occasions and casual celebrations.',
    displayOrder: 1,
  },
  {
    id: 'sherwanis',
    name: 'Wedding Sherwanis',
    slug: 'wedding-sherwanis',
    image: '/images/category-sherwanis.png',
    description: 'Bespoke sherwanis designed for grooms and wedding events.',
    displayOrder: 2,
  },
  {
    id: 'jackets',
    name: 'Nehru Jackets',
    slug: 'nehru-jackets',
    image: '/images/category-jackets.png',
    description: 'Sophisticated Nehru jackets to elevate any ethnic outfit.',
    displayOrder: 3,
  },
  {
    id: 'suits',
    name: 'Indo-Western & Suits',
    slug: 'indo-western-suits',
    image: '/images/category-suits.png',
    description: 'Contemporary fusion suits blending tradition and modern cuts.',
    displayOrder: 4,
  },
];
