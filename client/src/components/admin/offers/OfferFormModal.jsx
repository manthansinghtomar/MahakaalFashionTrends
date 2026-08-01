"use client";

import React, { useState, useEffect } from 'react';
import uploadService from '@/services/upload.service.js';
import productService from '@/services/product.service.js';
import toast from '@/utils/toast.js';

/**
 * OfferFormModal component - Simplified for Admin UX.
 * Fields kept:
 * - Offer Title
 * - Discount Percentage (1 to 100%)
 * - Start Date
 * - End Date
 * - Banner Image Upload (Local file select, single image, preview, remove button)
 * - Offer Description
 * 
 * Auto-calculates status on backend (Upcoming, Active, Expired).
 */
export const OfferFormModal = ({
  isOpen,
  onClose,
  offer = null, // If passed, we are in Edit Mode
  onSubmit,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productId: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [image, setImage] = useState(null); // Single banner image object: { public_id, url }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Formats date to YYYY-MM-DD input string consistently
  const formatInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().substring(0, 10);
  };

  // Sync state values when modal opens or shifts modes
  useEffect(() => {
    const fetchProductsList = async () => {
      try {
        setLoadingProducts(true);
        const res = await productService.getAllProducts({ limit: 100 });
        if (res && res.products) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products list for offer selection:', err);
      } finally {
        setLoadingProducts(false);
      }
    };

    if (isOpen) {
      fetchProductsList();
    }

    if (offer) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        productId: offer.product?._id || offer.product || '',
        discountPercentage: offer.discountPercentage ?? '',
        startDate: formatInputDate(offer.startDate),
        endDate: formatInputDate(offer.endDate),
      });
      setImage(offer.bannerImage ? { public_id: offer.bannerImage.public_id, url: offer.bannerImage.url } : null);
    } else {
      // Default to today and 7 days later
      const todayStr = new Date().toISOString().substring(0, 10);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().substring(0, 10);

      setFormData({
        title: '',
        description: '',
        productId: '',
        discountPercentage: '',
        startDate: todayStr,
        endDate: nextWeekStr,
      });
      setImage(null);
    }
    setError(null);
  }, [offer, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Single file upload handler reusing uploadService.uploadImages
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Attempt Cloudinary upload under 'offers' folder
      const response = await uploadService.uploadImages(files, 'offers');
      if (response && (response.success || Array.isArray(response.images))) {
        const uploadedImgs = response.images || [];
        if (uploadedImgs.length > 0) {
          const firstImg = uploadedImgs[0];
          setImage({
            public_id: firstImg.public_id,
            url: firstImg.url,
          });
          toast.success('Banner image uploaded successfully');
        } else {
          throw new Error('Upload response empty');
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.warn('Cloudinary upload fallback to FileReader:', err);
      // Fallback: Read file locally as Data URL so UX never breaks in dev
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (evt) => {
        setImage({
          public_id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          url: evt.target.result,
        });
        toast.success('Image loaded locally');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Validate product selection
    if (!formData.productId) {
      setError('Please select a product.');
      return;
    }

    // 2. Validate product existence in active products list
    if (products.length > 0) {
      const selectedProd = products.find((p) => String(p._id || p.id) === String(formData.productId));
      if (!selectedProd) {
        setError('Ye product Products me nahi hai. Pehle isko Products me add karo, phir Offer create karo.');
        return;
      }
    }

    // Validate empty required fields
    if (!formData.title.trim() || !formData.description.trim() || formData.discountPercentage === '' || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!image || !image.url) {
      setError('Please upload a banner image.');
      return;
    }

    const discountNum = Number(formData.discountPercentage);
    const startVal = new Date(formData.startDate);
    const endVal = new Date(formData.endDate);

    // 3. Validate discount range (1 to 100)
    if (isNaN(discountNum) || discountNum < 1 || discountNum > 100) {
      setError('Discount percentage must be between 1 and 100.');
      return;
    }

    // 4. Validate date chronological logic
    if (endVal < startVal) {
      setError('End Date must be on or after Start Date.');
      return;
    }

    const offerPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      product: formData.productId,
      discountPercentage: discountNum,
      startDate: startVal.toISOString(),
      endDate: endVal.toISOString(),
      bannerImage: image,
    };

    try {
      await onSubmit(offerPayload);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the offer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header Console */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {offer ? 'Edit Campaign Offer' : 'Register New Campaign Offer'}
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Configure promotional details, discount values, and valid date spans.
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
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-5 text-sm">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-semibold leading-relaxed flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {/* Field 1: Offer Title */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Offer Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Festive Sale 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-neutral-900"
              required
            />
          </div>

          {/* Field: Select Target Product */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Target Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-neutral-900 bg-white"
              required
            >
              <option value="">-- Select Product for Offer --</option>
              {products.map((prod) => (
                <option key={prod._id || prod.id} value={prod._id || prod.id}>
                  {prod.name} {prod.price ? `(₹${prod.price})` : ''}
                </option>
              ))}
            </select>
            {loadingProducts && (
              <p className="text-[11px] text-amber-600 font-medium mt-1">Loading products catalogue...</p>
            )}
          </div>

          {/* Field 2: Discount Percentage */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Discount Percentage (%) *</label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              min="1"
              max="100"
              placeholder="e.g. 25"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-semibold text-neutral-900"
              required
            />
          </div>

          {/* Field 3 & 4: Start Date and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900"
                required
              />
            </div>
          </div>

          {/* Field 5: Banner Image Upload */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Banner Image *</label>
            
            {image ? (
              /* Single Image Preview Box */
              <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-inner flex items-center justify-center">
                <img
                  src={image.url}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-neutral-950/80 text-white rounded-full hover:bg-red-600 transition-all shadow-md backdrop-blur-xs flex items-center gap-1 text-xs font-bold px-3"
                  title="Remove banner image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
              </div>
            ) : (
              /* Drop Zone / Upload Button */
              <div className="relative group border-2 border-dashed border-neutral-200 hover:border-amber-500/60 rounded-2xl p-6 transition-all duration-300 bg-neutral-50/50 hover:bg-amber-50/30 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  {uploading ? (
                    <div className="flex items-center gap-2 text-amber-600 font-bold text-xs py-2">
                      <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading banner...
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
                          Click to upload offer banner image
                        </span>
                        <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                          Supports JPG, PNG, WEBP from local device
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Field 6: Offer Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Offer Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe this promotional campaign detail..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-neutral-900"
              required
            />
          </div>

          {/* Form Actions Footer */}
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
              disabled={submitting || uploading}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-neutral-950 hover:bg-neutral-900 border border-neutral-950 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Save Offer'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OfferFormModal;
