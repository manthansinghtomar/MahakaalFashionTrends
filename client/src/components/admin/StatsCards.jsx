import React from 'react';
import Link from 'next/link';

/**
 * Summary Stats Cards displaying products, categories, active offers, and unread contacts.
 * Restructured for premium visual hierarchy, interactive lift animations, and CTA navigation.
 */
export const StatsCards = ({ overview = {} }) => {
  const { products = {}, categories = {}, offers = {}, messages = {} } = overview;

  const cardsList = [
    {
      title: 'Total Products',
      count: products.totalProducts ?? 0,
      helperText: 'Items registered in catalog',
      href: '/admin/products',
      ctaText: 'Manage Products',
      icon: (
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Total Categories',
      count: categories.totalCategories ?? 0,
      helperText: 'Bespoke collections divisions',
      href: '/admin/categories',
      ctaText: 'Manage Categories',
      icon: (
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Active Offers',
      count: offers.activeOffers ?? 0,
      helperText: 'Private promotions currently running',
      href: '/admin/offers',
      ctaText: 'Manage Offers',
      icon: (
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Unread Inquiries',
      count: messages.unreadMessages ?? 0,
      helperText: 'Pending customer contacts',
      href: '/admin/contacts',
      ctaText: 'View Inquiries',
      icon: (
        <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardsList.map((card, idx) => (
        <Link 
          key={idx} 
          href={card.href}
          className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6 hover:shadow-md hover:border-neutral-200 hover:-translate-y-1.5 active:scale-[0.99] transition-all duration-200 cursor-pointer relative overflow-hidden group min-h-[220px]"
        >
          {/* Accent golden hover bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />

          {/* Top Row: Icon Badge */}
          <div className="flex items-center justify-between">
            <div className="p-3 bg-secondary/5 rounded-2xl group-hover:bg-secondary/10 transition-colors duration-200">
              {card.icon}
            </div>
          </div>

          {/* Middle: Large Numeric Value + Description */}
          <div className="space-y-2">
            <div className="text-4xl font-extrabold text-neutral-900 tracking-tight">
              {card.count}
            </div>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {card.title}
              </span>
              <p className="text-[10px] text-neutral-400 font-semibold leading-relaxed">
                {card.helperText}
              </p>
            </div>
          </div>

          {/* Bottom Row: CTA Link */}
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-secondary uppercase tracking-widest group-hover:text-neutral-900 transition-colors duration-200">
            <span>{card.ctaText}</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StatsCards;
