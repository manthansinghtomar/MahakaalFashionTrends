import React from 'react';
import Button from '@/components/ui/Button.jsx';

/**
 * Clean pagination control bar.
 * Renders previous/next buttons and page count indicators.
 */
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav 
      className="flex items-center justify-center gap-6 mt-16 pt-8 border-t border-neutral-100"
      aria-label="Product Catalog Pagination"
    >
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full px-5 py-2 font-semibold uppercase tracking-wider text-xs border-neutral-200 text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Go to previous page"
      >
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </span>
      </Button>

      {/* Page indicator */}
      <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
        Page <span className="text-neutral-900">{currentPage}</span> of <span className="text-neutral-900">{totalPages}</span>
      </span>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full px-5 py-2 font-semibold uppercase tracking-wider text-xs border-neutral-200 text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50"
        aria-label="Go to next page"
      >
        <span className="flex items-center gap-1.5">
          Next
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Button>
    </nav>
  );
};

export default Pagination;
