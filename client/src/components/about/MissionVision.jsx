import React from 'react';
import Container from '@/components/ui/Container.jsx';

/**
 * MissionVision component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Renders the brand's mission and vision in responsive, premium cards.
 */
export const MissionVision = () => {
  return (
    <section 
      className="w-full bg-neutral-50 py-20 border-b border-neutral-100"
      aria-label="Mission and Vision"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Our Mission */}
          <div 
            className="group relative flex flex-col justify-between h-full bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200/50 hover:border-secondary/20 shadow-xs hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
            role="article"
          >
            {/* Top gold micro accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl origin-left" />

            <div className="space-y-6">
              {/* Mission Icon: Compass / Target */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-50 text-neutral-900 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-500 border border-neutral-100 group-hover:border-secondary/20">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Compass / Path Finder */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10l1 2-2 1 1-3z" />
                </svg>
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition-colors duration-300">
                  Our Mission
                </h3>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  To safeguard, champion, and modernise the traditional textile crafts of India. We aim to supply modern gentlemen with luxury attire that respects ancestral techniques, ensuring master weavers receive the recognition and support they deserve while our clients receive impeccable, bespoke garments.
                </p>
              </div>
            </div>

            {/* Decorative detail bottom border */}
            <div className="mt-8 pt-4 border-t border-neutral-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span>Sartorial Purpose</span>
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div 
            className="group relative flex flex-col justify-between h-full bg-white p-8 sm:p-10 rounded-2xl border border-neutral-200/50 hover:border-secondary/20 shadow-xs hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1"
            role="article"
          >
            {/* Top gold micro accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-2xl origin-left" />

            <div className="space-y-6">
              {/* Vision Icon: Eye / Globe Expansion */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-50 text-neutral-900 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-500 border border-neutral-100 group-hover:border-secondary/20">
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Eye / Insight */}
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 group-hover:text-secondary transition-colors duration-300">
                  Our Vision
                </h3>
                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  To become the premier global name for luxury Indian heritage fashion. We aspire to build an international community where quality, cultural depth, and sartorial precision are celebrated, ensuring classical Indian tailoring is permanently woven into the fabric of global luxury menswear.
                </p>
              </div>
            </div>

            {/* Decorative detail bottom border */}
            <div className="mt-8 pt-4 border-t border-neutral-50 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span>Future Outlook</span>
              <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default MissionVision;
