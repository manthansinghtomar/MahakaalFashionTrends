"use client";

import React, { useState, useEffect } from 'react';

/**
 * OfferFormModal component reused for creating/editing promotional campaigns.
 * Implements strict date comparisons, discount range checks, and preserves public_id.
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
    discountPercentage: '',
    startDate: '',
    endDate: '',
    imageUrl: '', // Mapped to bannerImage.url
    status: 'active',
  });

  const [error, setError] = useState(null);

  // Formats date to YYYY-MM-DD input string consistently
  const formatInputDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().substring(0, 10);
  };

  // Sync state values when modal opens or shifts modes
  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        discountPercentage: offer.discountPercentage ?? '',
        startDate: formatInputDate(offer.startDate),
        endDate: formatInputDate(offer.endDate),
        imageUrl: offer.bannerImage?.url || '',
        status: offer.status || 'active',
      });
    } else {
      // Default to today and tomorrow
      const todayStr = new Date().toISOString().substring(0, 10);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);
      const tomorrowStr = tomorrow.toISOString().substring(0, 10);

      setFormData({
        title: '',
        description: '',
        discountPercentage: '',
        startDate: todayStr,
        endDate: tomorrowStr,
        imageUrl: '',
        status: 'active',
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate empty required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.imageUrl.trim() || formData.discountPercentage === '' || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const discountNum = Number(formData.discountPercentage);
    const startVal = new Date(formData.startDate);
    const endVal = new Date(formData.endDate);

    // 1. Validate discount range
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      setError('Discount percentage must be a valid number between 0 and 100.');
      return;
    }

    // 2. Validate date chronological logic
    if (endVal < startVal) {
      setError('End Date must be on or after Start Date.');
      return;
    }

    // 3. Image schema mapping & public_id preservation
    const isEditingOriginalImage = offer && formData.imageUrl.trim() === offer.bannerImage?.url;
    const publicId = isEditingOriginalImage
      ? offer.bannerImage.public_id
      : `offer_img_${Date.now()}`;

    const bannerImagePayload = {
      public_id: publicId,
      url: formData.imageUrl.trim(),
    };

    const offerPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      discountPercentage: discountNum,
      startDate: startVal.toISOString(),
      endDate: endVal.toISOString(),
      bannerImage: bannerImagePayload,
      status: formData.status,
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

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Offer Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Diwali Premium Sales"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Discount Percentage (%) *</label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              min="0"
              max="100"
              placeholder="e.g. 25"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Banner Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="e.g. https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Offer Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-xs font-semibold capitalize"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Detailed Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe this promotional campaign detail..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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

export default OfferFormModal;
