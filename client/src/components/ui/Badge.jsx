import React from 'react';

/**
 * Reusable Badge component for categorizing, status tagging, or marking items.
 */
export const Badge = ({
  children,
  variant = 'neutral',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide capitalize';

  const variants = {
    neutral: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-neutral-900 text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
