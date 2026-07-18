import React from 'react';
import CategoryCard from './CategoryCard.jsx';

/**
 * Categories Grid component.
 * Maps category items in a responsive grid.
 */
export const CategoriesGrid = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((category) => (
        <CategoryCard key={category._id || category.id || category.slug} category={category} />
      ))}
    </div>
  );
};

export default CategoriesGrid;
