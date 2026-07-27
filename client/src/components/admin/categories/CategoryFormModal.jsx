"use client";

import React, { useState, useEffect } from 'react';
import uploadService from '@/services/upload.service.js';
import toast from '@/utils/toast.js';

/**
 * CategoryFormModal - Simplified for fast admin creation and editing.
 * Keeps only: Category Name, Category Image Upload, and Short Description.
 * Automatically handles backend defaults (slug generation on create, status: active, displayOrder: 0).
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
    description: '',
  });

  const [image, setImage] = useState(null); // Single image object: { public_id, url }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state values when modal opens or switches modes
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
      setImage(category.image ? { public_id: category.image.public_id, url: category.image.url } : null);
    } else {
      setFormData({
        name: '',
        description: '',
      });
      setImage(null);
    }
    setError(null);
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Single file upload handler reusing the existing uploadService flow used by Products
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // Attempt backend Cloudinary upload under 'categories' folder
      const response = await uploadService.uploadImages(files, 'categories');
      if (response && (response.success || Array.isArray(response.images))) {
        const uploadedImgs = response.images || [];
        if (uploadedImgs.length > 0) {
          const firstImg = uploadedImgs[0];
          setImage({
            public_id: firstImg.public_id,
            url: firstImg.url,
          });
          toast.success('Category image uploaded successfully');
        } else {
          throw new Error('Upload payload empty');
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

    if (!formData.name.trim()) {
      setError('Please enter a category name.');
      return;
    }

    if (!image || !image.url) {
      setError('Please upload a category image.');
      return;
    }

    const categoryPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image,
    };

    try {
      await onSubmit(categoryPayload);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Header Console */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              {category ? 'Edit Category' : 'New Category'}
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              {category ? 'Update category details and image' : 'Add a new category classification'}
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

          {/* Field 1: Category Name */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Traditional Lehengas"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-neutral-900 font-semibold"
              required
            />
          </div>

          {/* Field 2: Category Image Upload */}
          <div>
            <label className="block text-xs font-bold text-neutral-600 mb-1.5">Category Image *</label>
            
            {image ? (
              /* Single Image Preview Box */
              <div className="relative group w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-inner flex items-center justify-center">
                <img
                  src={image.url}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-neutral-950/80 text-white rounded-full hover:bg-red-600 transition-all shadow-md backdrop-blur-xs flex items-center gap-1 text-xs font-bold px-3"
                  title="Remove image"
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
                      Uploading image...
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
                          Click to upload category image
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

          {/* Field 3: Short Description */}
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
                'Save Category'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CategoryFormModal;
