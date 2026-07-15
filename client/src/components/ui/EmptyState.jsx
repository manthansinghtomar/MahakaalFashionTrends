import React from 'react';

/**
 * Reusable EmptyState component displaying clean illustrations and placeholder text
 * when queries return zero results.
 */
export const EmptyState = ({
  title = 'No records found',
  description = 'Try adjusting your search filters or add a new entry.',
  icon,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50 max-w-md mx-auto my-8 ${className}`}>
      {icon ? (
        <div className="text-neutral-400 mb-3">{icon}</div>
      ) : (
        <svg
          className="mx-auto h-12 w-12 text-neutral-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m4 4h.01m3.99 0h.01M16 16h.01"
          />
        </svg>
      )}
      <h3 className="text-sm font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 mb-4">{description}</p>
      {children}
    </div>
  );
};

export default EmptyState;
