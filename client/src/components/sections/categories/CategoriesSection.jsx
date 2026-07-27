"use client";

import React, { useState, useEffect } from 'react';
import { CATEGORIES_CONFIG } from '@/constants/index.js';
import CategoriesGrid from './CategoriesGrid.jsx';
import categoryService from '@/services/category.service.js';

/**
 * Shop by Categories Section.
 * Displays editorial section title and maps responsive categories list.
 * Dynamically fetches categories from API with fallback to static constants.
 */
export const CategoriesSection = ({ categories: initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories || CATEGORIES_CONFIG);

  useEffect(() => {
    // If custom categories array was explicitly passed, don't overwrite
    if (initialCategories && initialCategories.length > 0) return;

    let active = true;
    const loadCategories = async () => {
      try {
        const response = await categoryService.getAllCategories({ page: 1, limit: 20 });
        if (active && response && response.success && response.categories && response.categories.length > 0) {
          setCategories(response.categories);
        }
      } catch (err) {
        // Quietly fallback to CATEGORIES_CONFIG on backend error / offline
      }
    };

    loadCategories();
    return () => {
      active = false;
    };
  }, [initialCategories]);

  return (
    <section className="w-full bg-white py-20 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            MEN'S FASHION COLLECTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Shop by Category
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            Browse our collection of Polo T-Shirts, Shirts, Jeans, Trousers, Lowers, Belts, and Kids Wear to find the perfect style for every day.
          </p>
        </div>

        {/* Categories grid */}
        <CategoriesGrid categories={categories} />

      </div>
    </section>
  );
};

export default CategoriesSection;
