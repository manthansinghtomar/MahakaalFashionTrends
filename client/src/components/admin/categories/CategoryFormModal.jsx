"use client";

import React, { useState, useEffect } from 'react';

/**
 * Category form modal reused for Create/Edit category options.
 * Matches backend schemas and implements slug auto-generation helper states.
 */
export const CategoryFormModal = ({
  isOpen,
  onClose,
  category = null, // If passed, we are in Edit Mode
  onSubmit,
  submitting = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '', // Mapped to image.url
    displayOrder: '',
    status: 'active',
  });

  const [error, setError] = useState(null);

  // Sync state values when modal opens or switches modes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.image?.url || '',
        displayOrder: category.displayOrder ?? '0',
        status: category.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        displayOrder: '0',
        status: 'active',
      });
    }
    setError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  // Slug generator helper
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, name: nameVal };
      // Auto-generate slug on creation only, or if slug is currently empty or matches previous slug name
      if (!category) {
        updated.slug = slugify(nameVal);
      }
      return updated;
    });
  };

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

    // Validate inputs
    if (!formData.name.trim() || !formData.imageUrl.trim()) {
      setError('Please provide category Name and Image URL.');
      return;
    }

    const numOrder = Number(formData.displayOrder);
    if (isNaN(numOrder) || numOrder < 0) {
      setError('Display order must be a valid positive integer.');
      return;
    }

    // Format single image object
    const publicId = category?.image?.public_id || `cat_img_${Date.now()}`;
    const imagePayload = {
      public_id: publicId,
      url: formData.imageUrl.trim(),
    };

    const categoryPayload = {
      name: formData.name.trim(),
      slug: formData.slug.trim().toLowerCase() || slugify(formData.name),
      description: formData.description.trim(),
      image: imagePayload,
      displayOrder: numOrder,
      status: formData.status,
    };

    try {
      await onSubmit(categoryPayload);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header Console */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {category ? 'Edit Category' : 'Register New Category'}
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Configure name, slug routing, description, and display ordering.
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
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Traditional Lehengas"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Slug path (URL identifier) *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="e.g. traditional-lehengas"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all lowercase"
              required
            />
            <span className="text-[10px] text-neutral-400 font-semibold mt-1 block">
              Auto-generated from name. Change only to customize URL routing.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Image URL *</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Display Order (weight)</label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1.5">Category Status</label>
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
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe this category collection..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
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

export default CategoryFormModal;
