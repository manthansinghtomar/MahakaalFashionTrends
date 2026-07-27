import React from 'react';
import Container from '@/components/ui/Container.jsx';
import SectionTitle from '@/components/ui/SectionTitle.jsx';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Harsh Singh Tomar',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    name: 'Rishi Singh Tomar',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    name: 'Pradeep Singh Tomar',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 4,
    name: 'Narayan Singh Bhadoriya',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
  },
];

/**
 * BrandStory component.
 * Rendered as a React Server Component (static, no client-side hooks).
 * Details the brand history and introduces team members.
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
          subtitle="Serving Gwalior with Quality Fashion at Affordable Prices" 
          center={true} 
        />

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-12">
          
          {/* Left Column: Story Copy */}
          <div className="space-y-6 text-neutral-600 text-base sm:text-lg leading-relaxed">
            <p>
              Mahakaal Fashion Trends is a trusted men's fashion store located in Birla Nagar, Gwalior. We offer a wide range of clothing for kids, teenagers, and adults, making it easy for every customer to find stylish outfits for daily wear, office wear, college, festivals, and special occasions.
            </p>
            <p>
              Our goal is simple — provide quality products, affordable prices, and a comfortable shopping experience. From T-shirts, shirts, jeans, lowers, and formal wear to belts and fashion accessories, we regularly update our collection to match the latest trends.
            </p>
            <p>
              Whether you visit our showroom or shop online, our team is committed to helping you find the right style, size, and value for your budget.
            </p>
          </div>

          {/* Right Column: Team Gallery Card */}
          <div className="relative flex items-center justify-center p-4 sm:p-8 lg:p-12">
            {/* Offset Gold Border Frame */}
            <div className="absolute inset-0 border border-secondary/20 rounded-2xl transform translate-x-3 translate-y-3 pointer-events-none" />
            
            {/* Main Content card */}
            <div className="relative w-full bg-neutral-50 rounded-2xl border border-neutral-100 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 z-10">
              <div className="space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
                  OUR PEOPLE
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
                  Meet Our Team
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  A glimpse of the people behind Mahakaal Fashion Trends.
                </p>
              </div>

              {/* 2x2 Team Gallery Grid */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                {TEAM_MEMBERS.map((member) => (
                  <div
                    key={member.id}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-xs bg-neutral-200 border border-neutral-200/60"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Bottom gradient overlay with name */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3">
                      <span className="text-white font-bold text-xs sm:text-sm leading-tight drop-shadow-xs">
                        {member.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </Container>
    </section>
  );
};

export default BrandStory;
