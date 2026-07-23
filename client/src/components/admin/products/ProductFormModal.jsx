"use client";

import React, { useState, useEffect } from 'react';
import uploadService from '@/services/upload.service.js';
import toast from '@/utils/toast.js';

/**
 * Fast & Interactive Product Form Modal for Admin UX.
 * Smoothly scrolls & redirects focus to missing inputs with toast alerts.
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
    description: '',
    brand: 'Mahakaal',
    category: '',
    price: '',
    originalPrice: '',
    stock: '10',
    sizes: 'S, M, L, XL, XXL',
    colors: '',
    featured: false,
    newArrival: false,
    bestSeller: false,
  });

  // Uploaded images state: Array of { public_id, url }
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [missingFieldId, setMissingFieldId] = useState(null);

  // Populate data when modal opens or shifts modes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        brand: product.brand || 'Mahakaal',
        category: typeof product.category === 'object' ? product.category._id : product.category || '',
        price: product.price ?? '',
        originalPrice: product.originalPrice !== product.price ? product.originalPrice ?? '' : '',
        stock: product.stock ?? '10',
        sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : 'S, M, L, XL, XXL',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        featured: !!product.featured,
        newArrival: !!product.newArrival,
        bestSeller: !!product.bestSeller,
      });
      setImages(Array.isArray(product.images) ? product.images : []);
    } else {
      // Clear fields for new item creation
      setFormData({
        name: '',
        description: '',
        brand: 'Mahakaal',
        category: categories[0]?._id || '',
        price: '',
        originalPrice: '',
        stock: '10',
        sizes: 'S, M, L, XL, XXL',
        colors: '',
        featured: false,
        newArrival: false,
        bestSeller: false,
      });
      setImages([]);
    }
    setError(null);
    setMissingFieldId(null);
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError(null);
    if (missingFieldId) setMissingFieldId(null);
  };

  // Helper to focus & scroll smoothly to missing field
  const highlightMissingField = (fieldId, errorMessage) => {
    setError(errorMessage);
    toast.error(errorMessage);
    setMissingFieldId(fieldId);

    const el = document.getElementById(fieldId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        el.focus();
      }, 150);
    }
  };

  // Image Upload Handler with robust fallback
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Attempt backend Cloudinary upload
      const response = await uploadService.uploadImages(files, 'products');
      if (response && (response.success || Array.isArray(response.images))) {
        const uploadedImgs = response.images || [];
        if (uploadedImgs.length > 0) {
          setImages((prev) => [...prev, ...uploadedImgs]);
          toast.success(`${uploadedImgs.length} image(s) uploaded successfully`);
        } else {
          throw new Error('Upload payload empty');
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.warn('Cloudinary upload error, using local FileReader fallback:', err);
      // Fallback: Read files locally as Data URLs so user experience never fails
      const localReadPromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            resolve({
              public_id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              url: evt.target.result,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      const loadedLocalImages = await Promise.all(localReadPromises);
      setImages((prev) => [...prev, ...loadedLocalImages]);
      toast.success(`${loadedLocalImages.length} image(s) loaded`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Remove single image from list
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMissingFieldId(null);

    // Interactive Field Validations & Redirects
    if (!formData.name.trim()) {
      highlightMissingField('field-product-name', 'Product Name is missing! Please enter item title.');
      return;
    }

    if (!formData.category) {
      highlightMissingField('field-product-category', 'Category is missing! Please select a category.');
      return;
    }

    if (formData.price === '' || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      highlightMissingField('field-selling-price', 'Selling Price is missing or invalid! Please enter price.');
      return;
    }

    if (images.length === 0) {
      highlightMissingField('field-product-images', 'Product Images are missing! Upload at least one image.');
      return;
    }

    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      highlightMissingField('field-stock-quantity', 'Stock Quantity is missing or invalid! Enter valid stock.');
      return;
    }

    const numPrice = Number(formData.price);
    const numOriginalPrice = formData.originalPrice !== '' ? Number(formData.originalPrice) : numPrice;
    const numStock = Number(formData.stock || 0);

    // Helper to split comma-separated items safely
    const splitCommaValues = (str) => {
      if (!str) return [];
      return str.split(',').map((item) => item.trim()).filter(Boolean);
    };

    // Construct backend payload
    const productPayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || `${formData.name.trim()} - Premium ethnic wear selection by ${formData.brand.trim() || 'Mahakaal'}.`,
      brand: formData.brand.trim() || 'Mahakaal',
      category: formData.category,
      price: numPrice,
      originalPrice: numOriginalPrice,
      stock: numStock,
      images: images.map((img) => ({
        public_id: img.public_id || `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url: img.url,
      })),
      sizes: splitCommaValues(formData.sizes),
      colors: splitCommaValues(formData.colors),
      featured: formData.featured,
      newArrival: formData.newArrival,
      bestSeller: formData.bestSeller,
    };

    try {
      await onSubmit(productPayload);
    } catch (err) {
      const msg = err.message || 'An error occurred while saving product details.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header Console */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0 bg-white">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary">
              INTERACTIVE CATALOG EDITOR
            </span>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {product ? 'Edit Ethnic Wear' : 'Register New Ethnic Wear'}
            </h3>
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
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-3 animate-shake">
              <svg className="w-5 h-5 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Basic Information
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Product Name *</label>
                <input
                  id="field-product-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Mahakaal Royal Silk Wedding Sherwani"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                    missingFieldId === 'field-product-name'
                      ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/20'
                      : 'border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Product Category *</label>
                <select
                  id="field-product-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                    missingFieldId === 'field-product-category'
                      ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/20'
                      : 'border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary'
                  }`}
                >
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Brand</label>
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
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Stock Quantity *</label>
                <input
                  id="field-stock-quantity"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                    missingFieldId === 'field-stock-quantity'
                      ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/20'
                      : 'border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Pricing
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Selling Price (₹) *</label>
                <input
                  id="field-selling-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1499"
                  className={`w-full px-4 py-2.5 rounded-xl border font-semibold transition-all ${
                    missingFieldId === 'field-selling-price'
                      ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/20'
                      : 'border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Original Price (₹) <span className="text-neutral-400 font-normal">(Optional)</span></label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1999 (Leave blank if no discount)"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Upload Product Images */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
                Product Images *
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                {images.length} image{images.length !== 1 ? 's' : ''} uploaded
              </span>
            </div>

            {/* Drag & Drop Local File Upload Dropzone */}
            <div 
              id="field-product-images"
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all group cursor-pointer ${
                missingFieldId === 'field-product-images'
                  ? 'border-red-500 bg-red-50/30 ring-2 ring-red-500/20'
                  : 'border-neutral-200 hover:border-amber-500/60 bg-neutral-50/50 hover:bg-neutral-50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />

              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                {uploading ? (
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs py-2">
                    <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading images...
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-neutral-900 group-hover:text-amber-600 transition-colors">
                        Click or drag images to upload
                      </span>
                      <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                        Supports JPG, PNG, WEBP from your device
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Preview Thumbnails Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={img.public_id || idx} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-xs">
                    <img 
                      src={img.url} 
                      alt={`Product thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 transition-all shadow-md z-20"
                      title="Remove image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-neutral-950/80 text-white">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Product Description */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Description
            </span>
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe the garment quality, style highlights, or design details..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Section 5: Attributes (Sizes & Colors) */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Attributes
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Sizes (Comma-separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  placeholder="e.g. S, M, L, XL, XXL"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">Colors (Comma-separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  placeholder="e.g. Royal Blue, Gold, Red"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Marketing Flags */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">
              Marketing Flags
            </span>
            <div className="flex flex-wrap gap-8 items-center pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 border-neutral-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as Featured</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 border-neutral-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as New Arrival</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-amber-600 border-neutral-300 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-neutral-700">Mark as Bestseller</span>
              </label>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-100 flex-shrink-0 bg-white sticky bottom-0 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-500 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md hover:shadow-lg active:scale-95"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Product...
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductFormModal;
