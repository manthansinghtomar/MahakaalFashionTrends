"use client";

import React, { useState } from 'react';
import { formatRupees } from '@/utils/currency.js';

/**
 * Dedicated Admin Product Details Preview Modal.
 * Includes dynamic color box fill with white text for color badges.
 */
export const ViewProductModal = ({
  isOpen,
  onClose,
  product = null,
  onEdit = null,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [{ url: 'https://placehold.co/400x500?text=No+Image' }];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Derive short summary description
  const shortSummary = product.description
    ? product.description.split('.')[0].trim() + '.'
    : `Crafted by ${product.brand || 'Mahakaal Fashion Trends'}`;

  // Universal helper to map any color string to rich background fill
  const getColorStyle = (colorName) => {
    if (!colorName) return { backgroundColor: '#1e293b', color: '#ffffff' };

    const raw = colorName.trim().toLowerCase();
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

    // Fallback for custom or multi-word CSS colors (e.g., "darkblue", "skyblue", "forestgreen")
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-sm">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0 bg-white">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-secondary">
            PRODUCT DETAILS PREVIEW
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl focus:outline-none transition-colors"
            aria-label="Close view modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Image Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs relative">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Thumbnails list if multiple images exist */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.public_id || idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-12 h-14 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                        selectedImageIndex === idx
                          ? 'border-amber-500 ring-2 ring-amber-500/30 scale-105'
                          : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Structured Reading Flow */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Product Name */}
              <div>
                <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                  {product.name}
                </h2>
                {/* Short Product Description */}
                <p className="text-xs text-neutral-500 font-medium mt-1 leading-relaxed">
                  {shortSummary}
                </p>
              </div>

              {/* Visually Emphasized Pricing Section */}
              <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/60 block">
                  Current Selling Price
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-neutral-950 tracking-tight">
                    ₹{formatRupees(product.price)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm font-semibold text-neutral-400 line-through">
                        ₹{formatRupees(product.originalPrice)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Product Information Grid */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                  Product Information
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-0.5">
                    <span className="text-neutral-400 font-medium block">Category</span>
                    <span className="font-extrabold text-neutral-900 block">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-0.5">
                    <span className="text-neutral-400 font-medium block">Brand</span>
                    <span className="font-extrabold text-neutral-900 block">
                      {product.brand || 'Mahakaal'}
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-0.5">
                    <span className="text-neutral-400 font-medium block">Stock Quantity</span>
                    <span className={`font-extrabold block ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {product.stock} units
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl space-y-0.5">
                    <span className="text-neutral-400 font-medium block">Status</span>
                    <span className="font-extrabold text-neutral-900 capitalize block">
                      {product.status || (product.isActive ? 'Active' : 'Inactive')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              {(Array.isArray(product.sizes) && product.sizes.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                    Available Sizes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <span key={s} className="px-3 py-1 bg-white text-neutral-900 rounded-lg text-xs font-bold border border-neutral-200 shadow-2xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Color Box Fill with White Text */}
              {(Array.isArray(product.colors) && product.colors.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                    Available Colors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => {
                      const style = getColorStyle(c);
                      return (
                        <span
                          key={c}
                          style={style}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize border shadow-2xs tracking-wide"
                        >
                          {c}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Marketing Badges */}
              {(product.featured || product.newArrival || product.bestSeller) && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-neutral-400 block">
                    Marketing Flags
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.featured && (
                      <span className="px-2.5 py-1 bg-amber-500 text-neutral-950 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-2xs">
                        Featured Item
                      </span>
                    )}
                    {product.newArrival && (
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100">
                        New Arrival
                      </span>
                    )}
                    {product.bestSeller && (
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
                        Bestseller
                      </span>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-neutral-100 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
          >
            Close
          </button>
          
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 rounded-xl transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Product
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ViewProductModal;
