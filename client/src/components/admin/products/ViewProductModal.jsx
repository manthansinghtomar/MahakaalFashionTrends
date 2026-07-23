"use client";

import React, { useState } from 'react';

/**
 * Dedicated Admin View Modal to preview product details inside the Admin Panel.
 * Keeps admin within the console workspace and displays pricing in Rupees (₹).
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

  const formatRupees = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/65 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-sm">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0 bg-white">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-secondary">
                CATALOG PREVIEW
              </span>
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              {product.name}
            </h3>
          </div>
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

        {/* Modal Scrollable Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Image Gallery Preview */}
            <div className="md:col-span-5 space-y-3">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs relative">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
                {product.featured && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500 text-neutral-950 shadow-xs">
                    Featured
                  </span>
                )}
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

            {/* Right Column: Key Details & Pricing */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Pricing Box in Rupees */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-neutral-950">
                  ₹{formatRupees(product.price)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm font-semibold text-neutral-400 line-through">
                      ₹{formatRupees(product.originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white border border-neutral-100 rounded-xl space-y-0.5">
                  <span className="text-neutral-400 font-medium block">Category</span>
                  <span className="font-extrabold text-neutral-900 block">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </div>

                <div className="p-3 bg-white border border-neutral-100 rounded-xl space-y-0.5">
                  <span className="text-neutral-400 font-medium block">Brand</span>
                  <span className="font-extrabold text-neutral-900 block">
                    {product.brand || 'Mahakaal'}
                  </span>
                </div>

                <div className="p-3 bg-white border border-neutral-100 rounded-xl space-y-0.5">
                  <span className="text-neutral-400 font-medium block">Stock Level</span>
                  <span className={`font-extrabold block ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock} units available
                  </span>
                </div>

                <div className="p-3 bg-white border border-neutral-100 rounded-xl space-y-0.5">
                  <span className="text-neutral-400 font-medium block">Status</span>
                  <span className="font-extrabold text-neutral-900 capitalize block">
                    {product.status || (product.isActive ? 'Active' : 'Inactive')}
                  </span>
                </div>
              </div>

              {/* Sizes & Colors */}
              {(Array.isArray(product.sizes) && product.sizes.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Available Sizes</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sizes.map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-bold border border-neutral-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(Array.isArray(product.colors) && product.colors.length > 0) && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Available Colors</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((c) => (
                      <span key={c} className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg text-xs font-bold border border-amber-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketing Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {product.newArrival && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100">
                    New Arrival
                  </span>
                )}
                {product.bestSeller && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-lg border border-amber-100">
                    Bestseller
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">Description</span>
            <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              {product.description || 'No description provided for this product item.'}
            </p>
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
