import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';
import ProductPrice from './ProductPrice.jsx';

/**
 * Universal helper to map any color string to rich background fill.
 * Matches Admin Dashboard ViewProductModal design.
 */
const getColorStyle = (colorName) => {
  if (!colorName) return { backgroundColor: '#1e293b', color: '#ffffff' };

  const raw = String(colorName).trim().toLowerCase();
  const normalized = raw.replace(/[-_]/g, ' ');

  // Extensive fashion & ethnic wear color dictionary
  const colorMap = {
    // Blues
    blue: '#2563eb',
    'dark blue': '#1e3a8a',
    'light blue': '#38bdf8',
    'sky blue': '#0ea5e9',
    'royal blue': '#1d4ed8',
    'navy blue': '#0f172a',
    navy: '#0f172a',
    'midnight blue': '#020617',
    'baby blue': '#7dd3fc',
    cyan: '#06b6d4',
    teal: '#0d9488',
    turquoise: '#14b8a6',

    // Reds & Pinks
    red: '#dc2626',
    'dark red': '#7f1d1d',
    'light red': '#f87171',
    'royal red': '#991b1b',
    wine: '#4c0519',
    'wine red': '#4c0519',
    maroon: '#701a75',
    burgundy: '#581c87',
    pink: '#ec4899',
    'light pink': '#fbcfe8',
    'baby pink': '#fce7f3',
    'hot pink': '#db2777',
    'rose pink': '#f43f5e',
    magenta: '#d946ef',
    peach: '#fb923c',

    // Greens
    green: '#16a34a',
    'dark green': '#14532d',
    'bottle green': '#052e16',
    'light green': '#4ade80',
    'emerald green': '#047857',
    emerald: '#047857',
    'olive green': '#3f6212',
    olive: '#3f6212',
    mint: '#6ee7b7',
    'mint green': '#6ee7b7',
    lime: '#65a30d',

    // Yellows & Golds & Oranges
    yellow: '#ca8a04',
    'light yellow': '#fde047',
    'mustard yellow': '#b45309',
    mustard: '#b45309',
    gold: '#b45309',
    golden: '#b45309',
    'metallic gold': '#a16207',
    orange: '#ea580c',
    'dark orange': '#c2410c',
    rust: '#9a3412',
    copper: '#7c2d12',

    // Purples
    purple: '#9333ea',
    'dark purple': '#581c87',
    lavender: '#c084fc',
    violet: '#7c3aed',
    indigo: '#4338ca',

    // Neutrals & Earth Tones
    black: '#0f172a',
    'charcoal grey': '#1e293b',
    'charcoal gray': '#1e293b',
    charcoal: '#1e293b',
    grey: '#475569',
    gray: '#475569',
    'dark grey': '#334155',
    'light grey': '#94a3b8',
    silver: '#64748b',
    brown: '#78350f',
    'dark brown': '#451a03',
    beige: '#d97706',
    cream: '#fef08a',
    ivory: '#fef08a',
    'off white': '#f8fafc',
    white: '#ffffff',
  };

  if (colorMap[normalized]) {
    const hex = colorMap[normalized];
    if (normalized === 'white' || normalized === 'off white' || normalized === 'cream' || normalized === 'ivory') {
      return {
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        borderColor: '#cbd5e1',
      };
    }
    return {
      backgroundColor: hex,
      color: '#ffffff',
      borderColor: 'transparent',
    };
  }

  const noSpace = normalized.replace(/\s+/g, '');

  if (normalized.includes('white') || normalized.includes('cream')) {
    return {
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      borderColor: '#cbd5e1',
    };
  }

  return {
    backgroundColor: noSpace,
    color: '#ffffff',
    borderColor: 'transparent',
  };
};

/**
 * ProductInfo component.
 * Renders storefront product metadata in strict user-requested sequence with dynamic color badges matching Admin view.
 */
export const ProductInfo = ({ product }) => {
  if (!product) return null;

  const {
    name,
    category,
    stock = 0,
    price,
    originalPrice,
    discountPercentage,
    description,
    sizes = [],
    colors = [],
  } = product;

  // Safe category retrieval
  const categoryName = typeof category === 'object' && category ? category.name : (typeof category === 'string' ? category : null);

  // Availability status
  const isInStock = typeof stock === 'number' ? stock > 0 : Boolean(stock);

  // Data presence checks for strict conditional section rendering
  const hasDescription = typeof description === 'string' && description.trim().length > 0;
  
  const validSizes = Array.isArray(sizes) 
    ? sizes.filter(s => s && (typeof s === 'string' ? s.trim() !== '' : true)) 
    : [];
  const hasSizes = validSizes.length > 0;

  const validColors = Array.isArray(colors) 
    ? colors.filter(c => c && (typeof c === 'string' ? c.trim() !== '' : true)) 
    : [];
  const hasColors = validColors.length > 0;

  return (
    <div className="space-y-5 text-neutral-900">
      
      {/* 1. Top Header Row: Category Tag (Left) & Availability Badge (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {categoryName ? (
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-secondary bg-secondary/5 border border-secondary/15 px-3 py-1 rounded-md">
            {categoryName}
          </span>
        ) : <div />}

        {isInStock ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Available in Store</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-neutral-400" />
            <span>Currently Unavailable</span>
          </div>
        )}
      </div>

      {/* 2. Product Name / Title */}
      {name && (
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-neutral-900">
          {name}
        </h1>
      )}

      {/* 3. Product Description (directly under Product Name) */}
      {hasDescription && (
        <div className="pt-0.5">
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl whitespace-pre-line">
            {description.trim()}
          </p>
        </div>
      )}

      {/* 4. Selling Price, Original Price, Discount Badge (directly under Description) */}
      <ProductPrice
        price={price}
        originalPrice={originalPrice}
        discountPercentage={discountPercentage}
      />

      {/* 5. Available Sizes (only rendered if actual data exists) */}
      {hasSizes && (
        <div className="space-y-2.5 pt-3 border-t border-neutral-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Available Sizes
          </h3>
          <div className="flex flex-wrap gap-2">
            {validSizes.map((sz, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 border border-neutral-200/80 rounded-lg shadow-2xs"
              >
                {typeof sz === 'object' ? (sz.name || sz.size || JSON.stringify(sz)) : String(sz)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. Available Colors (only rendered if actual data exists) */}
      {hasColors && (
        <div className="space-y-2.5 pt-3 border-t border-neutral-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Available Colors
          </h3>
          <div className="flex flex-wrap gap-2">
            {validColors.map((col, idx) => {
              const colorLabel = typeof col === 'object' ? (col.name || col.color || JSON.stringify(col)) : String(col);
              const styleObj = getColorStyle(colorLabel);
              return (
                <span
                  key={idx}
                  style={styleObj}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-2xs border"
                >
                  {colorLabel}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Store Information Card */}
      <div className="mt-8 p-5 rounded-2xl bg-neutral-50 border border-neutral-200/70 space-y-3">
        <h4 className="text-sm font-bold text-neutral-900">
          Available at Mahakaal Fashion Trends
        </h4>
        <div className="text-xs sm:text-sm text-neutral-600 space-y-1.5 leading-relaxed">
          <p className="flex items-center gap-2">
            <span>📍</span>
            <span className="font-medium text-neutral-800">Birla Nagar, Hazira, Gwalior</span>
          </p>
          <p className="flex items-center gap-2">
            <span>🕘</span>
            <span className="font-medium text-neutral-800">Open Daily: 10:00 AM – 8:00 PM</span>
          </p>
        </div>
        <p className="text-xs text-neutral-500 pt-1 border-t border-neutral-200/50">
          Visit our store to check product availability, sizes, and explore more collections.
        </p>
      </div>

      {/* 8. Call-to-Action Button */}
      <div className="pt-2">
        <Link href="/contact" passHref className="inline-block w-full sm:w-auto">
          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Visit Our Store</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default ProductInfo;
