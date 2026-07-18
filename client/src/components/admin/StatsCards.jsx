import React from 'react';

/**
 * Summary Stats Cards displaying products, categories, active offers, and unread contacts.
 * Renders growth percentages dynamically only when provided by backend query metrics.
 */
export const StatsCards = ({ overview = {} }) => {
  const { products = {}, categories = {}, offers = {}, messages = {} } = overview;

  // Formatting growth metrics safely (checking values like +15% or -5%)
  const renderGrowth = (growthStr) => {
    if (!growthStr || growthStr === '+0%' || growthStr === '0%') return null;
    const isNegative = growthStr.startsWith('-');
    
    return (
      <span 
        className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md ${
          isNegative 
            ? 'bg-red-50 text-red-600 border border-red-100' 
            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}
      >
        {growthStr}
      </span>
    );
  };

  const cardsList = [
    {
      title: 'Total Products',
      count: products.totalProducts ?? 0,
      growth: products.productGrowth,
      helperText: 'Items registered in catalog',
      icon: (
        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Total Categories',
      count: categories.totalCategories ?? 0,
      growth: categories.categoryGrowth,
      helperText: 'Bespoke collections divisions',
      icon: (
        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Active Offers',
      count: offers.activeOffers ?? 0,
      growth: offers.offerGrowth,
      helperText: 'Private promotions currently running',
      icon: (
        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Unread Inquiries',
      count: messages.unreadMessages ?? 0,
      growth: messages.messageGrowth,
      helperText: 'Pending customer contacts',
      icon: (
        <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardsList.map((card, idx) => (
        <div 
          key={idx} 
          className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs flex flex-col space-y-4 hover:shadow-sm transition-all duration-300 relative overflow-hidden group"
        >
          {/* Accent golden hover bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              {card.title}
            </span>
            <div className="p-2.5 bg-neutral-50 rounded-xl">
              {card.icon}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {card.count}
            </span>
            {renderGrowth(card.growth)}
          </div>

          <div className="text-xs text-neutral-400 font-semibold leading-relaxed">
            {card.helperText}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
