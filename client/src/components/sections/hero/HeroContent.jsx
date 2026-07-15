import React from 'react';

/**
 * Editorial Content block inside the Hero section.
 * Renders labels, titles, and descriptions dynamically based on layout options.
 */
export const HeroContent = ({
  label,
  title,
  description,
  alignment = 'left',
  theme = 'light',
  className = '',
}) => {
  // Map configuration alignment properties to Tailwind layout utility classes
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  // Map configuration theme properties to text colors
  const labelColor = theme === 'dark' ? 'text-secondary' : 'text-secondary font-semibold';
  const titleColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const descColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600';

  return (
    <div className={`flex flex-col space-y-6 max-w-xl ${alignmentClasses[alignment] || alignmentClasses.left} ${className}`}>
      
      {/* Editorial Tracking Label */}
      {label && (
        <span className={`text-xs uppercase tracking-[0.25em] ${labelColor}`}>
          {label}
        </span>
      )}

      {/* Main Hero Header */}
      {title && (
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${titleColor}`}>
          {title}
        </h1>
      )}

      {/* Detailed Hero Description */}
      {description && (
        <p className={`text-base sm:text-lg leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}

    </div>
  );
};

export default HeroContent;
