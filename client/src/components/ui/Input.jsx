import React from 'react';

/**
 * Reusable Form Input component with label definitions and validation error text styling.
 */
export const Input = ({
  label,
  name,
  type = 'text',
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 transition duration-200 text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
