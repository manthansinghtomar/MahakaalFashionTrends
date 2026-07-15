import React from 'react';

/**
 * Placeholder component for rendering individual categories in catalog collections.
 */
export const CategoryCard = ({ category }) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 hover:shadow-md transition text-center">
      <h3 className="text-lg font-bold text-neutral-800">{category?.name || 'Category Name'}</h3>
      <p className="mt-2 text-xs text-neutral-500">{category?.description || 'Description placeholder'}</p>
    </div>
  );
};

export default CategoryCard;
