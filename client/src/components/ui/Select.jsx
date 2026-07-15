import React from 'react';

/**
 * Reusable Form Select component mapping options array { value, label } and error text.
 */
export const Select = ({
  label,
  name,
  options = [],
  error,
  placeholder,
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
      <select
        id={name}
        name={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 transition duration-200 text-sm ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-neutral-300 focus:border-neutral-900 focus:ring-neutral-900'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
