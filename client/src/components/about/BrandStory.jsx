import React from 'react';
import Container from '@/components/ui/Container.jsx';
import SectionTitle from '@/components/ui/SectionTitle.jsx';

/**
 * BrandStory component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Details the brand history, inspirations, and integration of traditional craft with modern aesthetics.
 */
export const BrandStory = () => {
  return (
    <section 
      className="w-full bg-white py-20 border-b border-neutral-100"
      aria-labelledby="brand-story-title"
    >
      <Container>
        {/* Section Title */}
        <SectionTitle 
          title="Our Story" 
          subtitle="Resurrecting regal Indian heritage for the contemporary era." 
          center={true} 
        />

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-12">
          
          {/* Left Column: Story Copy */}
          <div className="space-y-6 text-neutral-600 text-base sm:text-lg leading-relaxed">
            <p>
              Mahakaal Fashion Trends was born out of a profound passion to preserve and elevate the regal splendor of traditional Indian menswear. Our journey began in historic textile clusters across India, where we partnered with master weavers who hold generations of knowledge in the intricate arts of handloom weaving, organic thread dyeing, and bespoke tailoring.
            </p>
            <p>
              Drawing deep inspiration from the architectural symmetry, royal courts, and rich wardrobe legacies of ancient Indian dynasties, we envisioned a sartorial label that respects its roots while looking forward. We realized that true luxury lies in details that cannot be replicated by machines—the subtle texture of hand-spun yarn, the rich weight of authentic silks, and the precision of hand-drafted cuts.
            </p>
            <p>
              By marrying these time-honored artisanal methods with contemporary silhouettes, sharp contours, and modern fashion parameters, we create garments that define character. We invite you to experience menswear that does not just adorn, but narrates a legacy of cultural pride and individual refinement.
            </p>
          </div>

          {/* Right Column: Premium CSS Graphic (No Placeholder Image) */}
          <div className="relative flex items-center justify-center p-8 lg:p-12">
            {/* Offset Gold Border Frame */}
            <div className="absolute inset-0 border border-secondary/20 rounded-2xl transform translate-x-3 translate-y-3 pointer-events-none" />
            
            {/* Main Content card */}
            <div className="relative w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-8 sm:p-10 shadow-xs flex flex-col justify-between space-y-8 z-10">
              <div className="space-y-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                  The Atelier Signature
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Time-Honored Handcrafting
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Every Mahakaal creation is an individual masterpiece, passing through the skilled hands of multiple specialized artisans before achieving completion.
                </p>
              </div>

              {/* Brand Milestones/Stats */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-neutral-200/60">
                <div className="space-y-1">
                  <span className="block text-3xl font-extrabold text-neutral-900">Est. 2018</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-400">Founding Year</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-3xl font-extrabold text-secondary">50+</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-400">Master Weavers</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-3xl font-extrabold text-neutral-900">100%</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-400">Hand-cut Patterns</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-3xl font-extrabold text-secondary">10k+</span>
                  <span className="block text-xs uppercase tracking-wider text-neutral-400">Custom Fits Delivered</span>
                </div>
              </div>

              {/* Advisory details */}
              <div className="flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-neutral-400">
                <span className="w-4 h-[1px] bg-neutral-300" />
                <span>Crafted for Modern Gentlemen</span>
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};

export default BrandStory;
