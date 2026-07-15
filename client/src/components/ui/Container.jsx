import React from 'react';

/**
 * Reusable Container component to enforce central content width constraints.
 */
export const Container = ({ children, className = '', ...props }) => {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Container;
