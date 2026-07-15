import React from 'react';

/**
 * Reusable SectionTitle component for standard header and optional subtitle description.
 */
export const SectionTitle = ({ title, subtitle, className = '', center = false, ...props }) => {
  return (
    <div className={`mb-8 ${center ? 'text-center mx-auto' : ''} ${className}`} {...props}>
      <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-lg text-neutral-500 ${center ? 'mx-auto' : ''} max-w-2xl`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
