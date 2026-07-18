import React, { useState, useEffect } from 'react';

/**
 * ProductsToolbar component.
 * Houses filtering inputs (search, category select, sort select) and results count.
 */
export const ProductsToolbar = ({
  totalProducts,
  categories = [],
  currentSearch = '',
  currentCategory = '',
  currentSort = '',
  onSearchChange,
  onCategoryChange,
  onSortChange,
}) => {
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearchChange(searchTerm);
  };

  const handleCategorySelect = (e) => {
    onCategoryChange(e.target.value);
  };

  const handleSortSelect = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="w-full bg-white border border-neutral-100 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-xs">
      
      {/* 1. Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex-grow max-w-md relative">
        <label htmlFor="toolbar-search" className="sr-only">
          Search products
        </label>
        <input
          id="toolbar-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products by title, description..."
          className="w-full bg-neutral-50/50 border border-neutral-200 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300"
        />
        {/* Search Icon */}
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </form>

      {/* 2. Dropdowns & Counters Row */}
      <div className="flex flex-wrap items-center gap-4 lg:justify-end flex-shrink-0">
        
        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="toolbar-category" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Category
          </label>
          <select
            id="toolbar-category"
            value={currentCategory}
            onChange={handleCategorySelect}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 outline-none focus:border-secondary cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat.slug || cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown - Limited ONLY to backend-supported sorting criteria */}
        <div className="flex items-center gap-2">
          <label htmlFor="toolbar-sort" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Sort
          </label>
          <select
            id="toolbar-sort"
            value={currentSort}
            onChange={handleSortSelect}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-medium text-neutral-800 outline-none focus:border-secondary cursor-pointer"
          >
            <option value="">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Count Indicator */}
        <div className="pl-2 border-l border-neutral-200 text-xs font-bold text-neutral-500 tracking-wider flex-shrink-0">
          {totalProducts} {totalProducts === 1 ? 'PRODUCT' : 'PRODUCTS'} FOUND
        </div>
      </div>
    </div>
  );
};

export default ProductsToolbar;
