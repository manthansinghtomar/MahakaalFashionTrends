import React from 'react';
import { HERO_CONFIG } from '@/constants/index.js';
import HeroContent from './HeroContent.jsx';
import HeroButtons from './HeroButtons.jsx';
import HeroImage from './HeroImage.jsx';

/**
 * Reusable Home Hero Section.
 * Coordinates headings, actions, and graphic banners.
 * Mobile (< lg): Title -> Image -> Description -> CTA Buttons sequence.
 * Desktop (>= lg): 2-Column Split Layout.
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

  const titleColor = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const descColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-600';
  const labelColor = theme === 'dark' ? 'text-secondary' : 'text-secondary font-semibold';

  // Support custom grid order swaps for desktop
  const isRightAligned = alignment === 'right';
  const isCentered = alignment === 'center';

  return (
    <section className={`w-full py-12 sm:py-20 lg:py-28 overflow-hidden transition-colors duration-500 ${bgClasses}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {isCentered ? (
          // Center-Aligned full width banner layout
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
          <>
            {/* 1. Mobile View Layout (< lg): Title -> Image -> Description -> CTA Buttons */}
            <div className="flex flex-col space-y-6 lg:hidden">
              {/* Header Title */}
              <div className="space-y-3 text-left">
                {label && (
                  <span className={`text-xs uppercase tracking-[0.25em] ${labelColor} block`}>
                    {label}
                  </span>
                )}
                {title && (
                  <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${titleColor}`}>
                    {title}
                  </h1>
                )}
              </div>

              {/* Hero Image (positioned right below Title on mobile) */}
              {image?.src && (
                <div className="w-full py-2">
                  <HeroImage src={image.src} alt={image.alt} badge={badge} />
                </div>
              )}

              {/* Hero Description (positioned right below Image on mobile) */}
              {description && (
                <p className={`text-base sm:text-lg leading-relaxed ${descColor}`}>
                  {description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <HeroButtons
                  primaryCta={primaryCta}
                  secondaryCta={secondaryCta}
                  alignment="left"
                />
              </div>
            </div>

            {/* 2. Desktop View Layout (>= lg): Symmetrical Two-Column Split */}
            <div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
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
          </>
        )}

      </div>
    </section>
  );
};

export default HeroSection;
