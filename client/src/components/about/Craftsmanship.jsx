import React from 'react';
import Container from '@/components/ui/Container.jsx';
import SectionTitle from '@/components/ui/SectionTitle.jsx';

/**
 * Craftsmanship component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Details the brand's tailoring quality, premium fabrics, and attention to detail.
 */
export const Craftsmanship = () => {
  const details = [
    {
      title: 'Bespoke Tailoring',
      description: 'Our tailoring processes follow rigorous geometric modeling to flatter the male form. Pattern pieces are individual works of art, drafted on card stock before fabric cutting.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Scissors & Ruler outline */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 21h6m-6-4h6m-6-4h6M9 9h6M9 5h6M4 12h16M4 18h16M4 6h16" />
        </svg>
      ),
      bullets: ['Mathematically Drafted Cuts', 'Structured Shoulder Profiles', 'Individual Patterning'],
    },
    {
      title: 'Premium Fabrics',
      description: 'We source only premium silks, organic linens, and breathable long-staple cottons. Each weave is inspected for tensile strength, drape, color fastness, and weight.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Loom/Threads Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v18M18 3v18M3 6h18M3 18h18M3 12h18" />
        </svg>
      ),
      bullets: ['Mulberry Silk Blends', 'Pure Handloomed Linen', 'Long-Staple Combed Cotton'],
    },
    {
      title: 'Meticulous Details',
      description: 'Every seam is double-reinforced for durability. We pride ourselves on custom embroidery alignment, matched stripes/motifs at junctions, and hand-selected brass buttons.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Sparkles / Precise Focus Icon */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-1.813-5.096L2.091 15 7.187 13.187 9 8l1.813 5.187L16 15l-6.187.904zM19.071 4.929l-1.414 1.414m0 0l-1.414-1.414m1.414 1.414l1.414 1.414m-1.414-1.414l-1.414 1.414" />
        </svg>
      ),
      bullets: ['Double-Stitched Seams', 'Precision Pattern Alignment', 'Custom Casted hardware'],
    },
  ];

  return (
    <section 
      className="w-full bg-white py-20 border-b border-neutral-100"
      aria-labelledby="craftsmanship-title"
    >
      <Container>
        {/* Section Header */}
        <SectionTitle 
          title="The Art of Craftsmanship" 
          subtitle="Where ancestral technique meets bespoke engineering." 
          center={true} 
        />

        {/* 3-Column Detailed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          {details.map((item, index) => (
            <div 
              key={index}
              className="group bg-neutral-50 rounded-2xl border border-neutral-100 p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Icon wrapper with hover gold background shift */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-neutral-900 group-hover:bg-secondary group-hover:text-white transition-all duration-500 border border-neutral-100 shadow-xs">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold tracking-tight text-neutral-900">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Precise Bullets list */}
              <ul className="space-y-2.5 pt-4 border-t border-neutral-200/50">
                {item.bullets.map((bullet, bulletIdx) => (
                  <li 
                    key={bulletIdx}
                    className="flex items-center space-x-2.5 text-xs sm:text-sm font-medium text-neutral-700"
                  >
                    {/* Small Gold checkmark circle */}
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Craftsmanship;
