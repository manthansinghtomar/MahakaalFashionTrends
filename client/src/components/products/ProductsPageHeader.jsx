import React from 'react';

/**
 * Editorial header for the Products Listing page.
 * Dynamically updates its title when a category filter is active.
 */
export const ProductsPageHeader = ({ activeCategoryName }) => {
  const displayTitle = activeCategoryName 
    ? `${activeCategoryName} Collection` 
    : 'Shop Collection';

  const displayDescription = activeCategoryName
    ? `Explore our curated selection of premium men's ethnic wear in the ${activeCategoryName.toLowerCase()} range, designed for luxury and fit.`
    : "Discover our full catalog of premium men's ethnicwear, wedding sherwanis, elegant Nehru jackets, and designer kurtas handcrafted for the modern gentleman.";

  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-12 max-w-3xl mx-auto">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
        ESTABLISHED ELEGANCE
      </span>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
        {displayTitle}
      </h1>
      <p className="text-sm sm:text-base text-neutral-500 leading-relaxed max-w-2xl">
        {displayDescription}
      </p>
    </div>
  );
};

export default ProductsPageHeader;
