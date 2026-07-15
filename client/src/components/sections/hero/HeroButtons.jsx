import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';

/**
 * Hero Action Buttons block.
 * Renders primary and secondary calls to action.
 */
export const HeroButtons = ({
  primaryCta,
  secondaryCta,
  alignment = 'left',
  className = '',
}) => {
  if (!primaryCta && !secondaryCta) return null;

  // Map alignment prop to flex-row alignment styles
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 ${alignmentClasses[alignment] || alignmentClasses.left} ${className}`}>
      
      {/* Primary Call to Action */}
      {primaryCta && primaryCta.label && (
        <Link href={primaryCta.href} passHref className="focus:outline-none">
          <Button
            variant="primary"
            size="lg"
            className="rounded-full px-8 py-3.5 tracking-widest uppercase text-xs shadow-md transition-all duration-300 hover:-translate-y-0.5 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            {primaryCta.label}
          </Button>
        </Link>
      )}

      {/* Secondary Call to Action */}
      {secondaryCta && secondaryCta.label && (
        <Link href={secondaryCta.href} passHref className="focus:outline-none">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-3.5 tracking-widest uppercase text-xs transition-all duration-300 hover:-translate-y-0.5 border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
          >
            {secondaryCta.label}
          </Button>
        </Link>
      )}

    </div>
  );
};

export default HeroButtons;
