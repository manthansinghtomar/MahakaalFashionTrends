import React from 'react';
import { CATEGORIES_CONFIG } from '@/constants/index.js';
import CategoriesGrid from './CategoriesGrid.jsx';

/**
 * Shop by Categories Section.
 * Displays editorial section title and maps responsive categories list.
 * Ready for dynamic backend category APIs.
 */
export const CategoriesSection = ({ categories = CATEGORIES_CONFIG }) => {
  return (
    <section className="w-full bg-white py-20 border-b border-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            Curated Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Shop by Category
          </h2>
          <p className="text-base text-neutral-500 leading-relaxed">
            Discover premium ethnic kurtas, bespoke wedding sherwanis, and contemporary designer jackets tailored for the modern gentleman.
          </p>
        </div>

        {/* Categories grid */}
        <CategoriesGrid categories={categories} />

      </div>
    </section>
  );
};

export default CategoriesSection;
