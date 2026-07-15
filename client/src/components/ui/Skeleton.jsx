import React from 'react';

/**
 * Reusable Skeleton loader component to structure skeleton layouts and cards during fetch states.
 */
export const Skeleton = ({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  ...props
}) => {
  const baseStyle = 'animate-pulse bg-neutral-200 rounded';

  const variants = {
    text: 'h-4 my-2',
    circular: 'rounded-full aspect-square',
    rectangular: 'h-24',
  };

  const style = {
    width,
    ...(height && { height }),
  };

  return (
    <div
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
