import React from 'react';

/**
 * Reusable vertical column component for Footers.
 */
export const FooterColumn = ({ title, children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-6 ${className}`}>
      <h3 className="text-base font-semibold uppercase tracking-wider text-black">
        {title}
      </h3>
      <div className="flex flex-col space-y-3.5">
        {children}
      </div>
    </div>
  );
};

export default FooterColumn;
