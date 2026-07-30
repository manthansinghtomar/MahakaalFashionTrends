import React from 'react';

/**
 * Console toolbar for category actions.
 * Exposes search, status filters, refresh, and add triggers.
 * Responsive across mobile, tablet, and desktop viewports.
 */
export const CategoriesToolbar = ({
  search = '',
  onSearchChange,
  statusFilter = '',
  onStatusFilterChange,
  onRefresh,
  onAddCategory,
}) => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-6 w-full min-w-0">
      
      {/* Search Input & Refresh */}
      <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
        <div className="relative flex-1 w-full max-w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          onClick={onRefresh}
          className="p-2.5 text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50 rounded-xl transition-all shrink-0"
          title="Refresh categories list"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v8" />
          </svg>
        </button>
      </div>

      {/* Filters and Actions */}
      <div className="grid grid-cols-1 sm:flex items-center gap-3 justify-end w-full sm:w-auto">
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        {/* Add Category Button */}
        <button
          type="button"
          onClick={onAddCategory}
          className="w-full sm:w-auto px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 border border-neutral-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

    </div>
  );
};

export default CategoriesToolbar;
