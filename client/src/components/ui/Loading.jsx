import React from 'react';

/**
 * Reusable Loading spinner component supporting standard block styles or full-screen overlays.
 */
export const Loading = ({ fullScreen = false, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-neutral-900 ${sizes[size]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
};

export default Loading;
