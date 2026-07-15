import React from 'react';
import { HERO_CONFIG } from '@/constants/index.js';
import HeroContent from './HeroContent.jsx';
import HeroButtons from './HeroButtons.jsx';
import HeroImage from './HeroImage.jsx';

/**
 * Reusable Home Hero Section.
 * Coordinates headings, actions, and graphic banners.
 * Configured via HERO_CONFIG parameters to enable future-proof theme and order styling.
 */
export const HeroSection = ({ config = HERO_CONFIG }) => {
  const {
    label,
    title,
    description,
    primaryCta,
    secondaryCta,
    image,
    badge,
    alignment = 'left',
    theme = 'light',
  } = config;

  // Custom theme background styling
  const bgClasses =
    theme === 'dark'
      ? 'bg-neutral-950 text-white border-b border-neutral-900'
      : 'bg-gradient-to-tr from-neutral-50 via-white to-neutral-50/50 border-b border-neutral-100';

  // Support custom grid order swaps
  const isRightAligned = alignment === 'right';
  const isCentered = alignment === 'center';

  return (
    <section className={`w-full py-16 sm:py-20 lg:py-28 overflow-hidden transition-colors duration-500 ${bgClasses}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {isCentered ? (
          // 1. Center-Aligned full width banner layout
          <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
            <HeroContent
              label={label}
              title={title}
              description={description}
              alignment="center"
              theme={theme}
            />
            <HeroButtons
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
              alignment="center"
            />
            {image?.src && (
              <div className="w-full max-w-4xl mt-10">
                <HeroImage src={image.src} alt={image.alt} badge={badge} />
              </div>
            )}
          </div>
        ) : (
          // 2. Symmetrical Two-Column Split Layout (Left / Right)
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content block side */}
            <div className={`flex flex-col space-y-8 ${isRightAligned ? 'lg:order-last' : 'lg:order-first'}`}>
              <HeroContent
                label={label}
                title={title}
                description={description}
                alignment="left"
                theme={theme}
              />
              <HeroButtons
                primaryCta={primaryCta}
                secondaryCta={secondaryCta}
                alignment="left"
              />
            </div>

            {/* Image banner side */}
            <div className={`${isRightAligned ? 'lg:order-first' : 'lg:order-last'}`}>
              <HeroImage src={image?.src} alt={image?.alt} badge={badge} />
            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default HeroSection;
