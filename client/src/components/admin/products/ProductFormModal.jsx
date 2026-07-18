"use client";

import React, { useState, useEffect } from 'react';

/**
 * Premium Modal wrapper for creating and editing ethnic wear products.
 * Exposes only backend-supported schema properties and avoids rigid image transformations.
 */
export const ProductFormModal = ({
  isOpen,
  onClose,
  product = null, // If passed, we are in Edit Mode
  categories = [],
  onSubmit,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    imageUrl: '', // Mapped to images array url
    sizes: '', // Parsed as comma-separated list
    colors: '', // Parsed as comma-separated list
    material: '',
    fit: '',
    fabric: '',
    careInstructions: '',
    tags: '', // Parsed as comma-separated list
    featured: false,
    newArrival: false,
    bestSeller: false,
    status: 'active',
  });

  const [error, setError] = useState(null);

  // Populate data when modal opens or shifts modes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        brand: product.brand || '',
        category: typeof product.category === 'object' ? product.category._id : product.category || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice ?? '',
        stock: product.stock ?? '',
        imageUrl: product.images?.[0]?.url || '',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        material: product.material || '',
        fit: product.fit || '',
        fabric: product.fabric || '',
        careInstructions: product.careInstructions || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        featured: !!product.featured,
        newArrival: !!product.newArrival,
        bestSeller: !!product.bestSeller,
        status: product.status || 'active',
      });
    } else {
      // Clear fields for new item creation
      setFormData({
        name: '',
        sku: '',
        description: '',
        brand: '',
        category: categories[0]?._id || '',
        price: '',
        originalPrice: '',
        stock: '0',
        imageUrl: '',
        sizes: 'S, M, L, XL, XXL',
        colors: '',
        material: '',
        fit: '',
        fabric: '',
        careInstructions: '',
        tags: '',
        featured: false,
        newArrival: false,
        bestSeller: false,
        status: 'active',
      });
    }
    setError(null);
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic local validations before submission
    if (!formData.name.trim() || !formData.sku.trim() || !formData.category || !formData.imageUrl.trim() || formData.price === '') {
      setError('Please provide product Name, SKU, Category, Price, and Main Image URL.');
      return;
    }

    // Convert values
    const numPrice = Number(formData.price);
    const numOriginalPrice = formData.originalPrice !== '' ? Number(formData.originalPrice) : numPrice;
    const numStock = Number(formData.stock);

    if (isNaN(numPrice) || numPrice < 0) {
      setError('Price must be a valid positive number.');
      return;
    }
    if (isNaN(numOriginalPrice) || numOriginalPrice < 0) {
      setError('Original Price must be a valid positive number.');
      return;
    }
    if (isNaN(numStock) || numStock < 0) {
      setError('Stock must be a valid positive integer.');
      return;
    }

    // Map image url to backend images array model
    const publicId = product?.images?.[0]?.public_id || `img_${Date.now()}`;
    const imagesPayload = [
      {
        public_id: publicId,
        url: formData.imageUrl.trim(),
      },
    ];

    // Helper to split comma-separated items safely
    const splitCommaValues = (str) => {
      if (!str) return [];
      return str.split(',').map((item) => item.trim()).filter(Boolean);
    };

    const productPayload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      description: formData.description.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      price: numPrice,
      originalPrice: numOriginalPrice,
      stock: numStock,
      images: imagesPayload,
      sizes: splitCommaValues(formData.sizes),
      colors: splitCommaValues(formData.colors),
      material: formData.material.trim(),
      fit: formData.fit.trim(),
      fabric: formData.fabric.trim(),
      careInstructions: formData.careInstructions.trim(),
      tags: splitCommaValues(formData.tags),
      featured: formData.featured,
      newArrival: formData.newArrival,
      bestSeller: formData.bestSeller,
      status: formData.status,
    };

    try {
      await onSubmit(productPayload);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Console */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {product ? 'Edit Ethnic Wear' : 'Register New Ethnic Wear'}
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Configure product details, prices, classifications, and imagery properties.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl focus:outline-none transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6 text-sm">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Section 1: Basic specifications */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Basic Specifications
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Mahakaal Premium Traditional Kurta"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Unique SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g. SKU-1784106"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all uppercase"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Product Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Brand Designer</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Mahakaal"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing details */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Pricing details
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Selling Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1500"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Original Price ($) *</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 2000"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Media & Imagery */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Media & Imagery
            </span>
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Main Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="e.g. https://images.unsplash.com/... or /images/..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                required
              />
            </div>
          </div>

          {/* Section 4: Specifications details */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Attributes & Specifications
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Sizes (Comma-separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="e.g. S, M, L, XL"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Colors (Comma-separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="e.g. Red, Blue, Gold"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Tags (Comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. silk, festival, kurta"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Material Composition</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g. Raw Silk"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Fit Description</label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit}
                  onChange={handleInputChange}
                  placeholder="e.g. Slim Fit"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleInputChange}
                  placeholder="e.g. Banarasi Silk"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Care Instructions</label>
                <input
                  type="text"
                  name="careInstructions"
                  value={formData.careInstructions}
                  onChange={handleInputChange}
                  placeholder="e.g. Dry clean only"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5">Product Status Code</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-xs font-semibold capitalize"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="outofstock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Detailed Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Provide a detailed overview of the garment design..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                required
              />
            </div>
          </div>

          {/* Section 5: Promotions & Marketing flags */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Promotions & Marketing flags
            </span>
            <div className="flex flex-wrap gap-8 items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-secondary border-neutral-300 focus:ring-secondary"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as Featured</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-secondary border-neutral-300 focus:ring-secondary"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as New Arrival</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-secondary border-neutral-300 focus:ring-secondary"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as Bestseller</span>
              </label>
            </div>
          </div>

          {/* Form Actions Footer (inside scroll area for safety) */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 flex-shrink-0 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 rounded-xl transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductFormModal;
