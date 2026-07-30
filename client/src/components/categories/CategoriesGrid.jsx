import React from 'react';
import CategoryCard from './CategoryCard.jsx';

/**
 * Categories Grid component.
 * Mobile (< 640px): 2-column zero-gap mobile layout where cards touch side-by-side.
 * Desktop: Preserved 4-column grid.
 */
export const CategoriesGrid = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-0 gap-y-3 sm:gap-6 lg:gap-8">
      {categories.map((category) => (
        <CategoryCard key={category._id || category.id || category.slug} category={category} />
      ))}
    </div>
  );
};

export default CategoriesGrid;
