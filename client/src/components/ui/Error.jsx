import React from 'react';
import Button from './Button.jsx';

/**
 * Reusable Error display card component with optional retry buttons.
 */
export const Error = ({ message = 'An unexpected error occurred.', retry, className = '' }) => {
  return (
    <div className={`my-8 flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 text-center shadow-sm max-w-lg mx-auto ${className}`}>
      <svg
        className="h-10 w-10 text-red-500 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-red-800 mb-1">Execution Error</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {retry && (
        <Button variant="danger" size="sm" onClick={retry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;
