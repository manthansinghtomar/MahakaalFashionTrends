import React from 'react';

/**
 * Reusable PageWrapper component to provide unified padding, min-heights, and fade-in entries.
 */
export const PageWrapper = ({ children, className = '', ...props }) => {
  return (
    <main
      className={`min-h-screen py-8 bg-neutral-50 animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </main>
  );
};

export default PageWrapper;
