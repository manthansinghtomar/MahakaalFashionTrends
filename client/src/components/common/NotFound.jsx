import React from 'react';

/**
 * Clean display page when routes or elements do not resolve.
 */
export const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 bg-white rounded-lg">
      <h2 className="text-4xl font-extrabold text-neutral-900 mb-2">404</h2>
      <p className="text-sm text-neutral-500 mb-6">Oops! The page or resource you are looking for does not exist.</p>
      <a
        href="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-neutral-950 hover:bg-neutral-850 focus:outline-none transition duration-200"
      >
        Go Home
      </a>
    </div>
  );
};

export default NotFound;
