import React from 'react';

/**
 * Reusable Button component supporting variants (primary, secondary, outline, danger, text),
 * sizes (sm, md, lg), loading spinners, disabled states, and dynamic Tailwind styling.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-300 transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border border-transparent',
    secondary: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm border border-transparent',
    outline: 'bg-transparent text-neutral-950 border border-neutral-300 hover:bg-neutral-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent',
    text: 'bg-transparent text-neutral-900 hover:underline',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
