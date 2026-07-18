import React from 'react';

/**
 * Header for the Curated Categories Listing page.
 */
export const CategoriesPageHeader = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-16 max-w-2xl mx-auto">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
        CURATED COLLECTIONS
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
        Shop by Category
      </h1>
      <p className="text-base text-neutral-500 leading-relaxed">
        Discover premium ethnic kurtas, bespoke wedding sherwanis, and contemporary designer jackets tailored for the modern gentleman.
      </p>
    </div>
  );
};

export default CategoriesPageHeader;
