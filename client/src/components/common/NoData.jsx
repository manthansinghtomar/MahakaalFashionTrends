import React from 'react';

/**
 * Reusable clean layout element to inform user that zero data matches were returned.
 */
export const NoData = ({ message = 'No data available at this time.' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
      <svg
        className="h-10 w-10 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default NoData;
