import React from 'react';

/**
 * Console toolbar containing search, category filters, status selectors, sorting, and add triggers.
 */
export const ProductsToolbar = ({
  search = '',
  onSearchChange,
  categoryFilter = '',
  onCategoryFilterChange,
  categories = [],
  statusFilter = '',
  onStatusFilterChange,
  sortBy = 'createdAt-desc',
  onSortChange,
  onRefresh,
  onAddProduct,
}) => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-6">
      
      {/* 1. Search and Refresh */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, SKU or brand..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
        </div>
        
        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2.5 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all"
          title="Refresh products list"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v8" />
          </svg>
        </button>
      </div>

      {/* 2. Filters & Actions Panel */}
      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="outofstock">Out of Stock</option>
        </select>

        {/* Sort option */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={onAddProduct}
          className="px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 border border-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </button>
      </div>

    </div>
  );
};

export default ProductsToolbar;
