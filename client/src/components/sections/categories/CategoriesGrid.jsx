import React from 'react';
import CategoryCard from './CategoryCard.jsx';

/**
 * Categories Grid component.
 * Maps category configurations and handles responsive columns.
 */
export const CategoriesGrid = ({ categories = [] }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="w-full text-center py-12 text-neutral-400">
        No categories available.
      </div>
    );
  }

  // Sort categories by displayOrder
  const sortedCategories = [...categories].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {sortedCategories.map((category) => (
        <CategoryCard key={category.id || category.slug} category={category} />
      ))}
    </div>
  );
};

export default CategoriesGrid;
