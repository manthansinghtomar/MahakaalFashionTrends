import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/constants/index.js';

/**
 * Dashboard Quick Actions Shortcuts panel.
 * Navigates only; CRUD operations are handled in their respective views.
 */
export const QuickActions = () => {
  const actions = [
    {
      label: 'Manage Products',
      href: ROUTES.ADMIN_PRODUCTS,
      description: 'Add new kurtas or update details',
      bgColor: 'bg-neutral-900',
      textColor: 'text-white',
      accentColor: 'text-secondary',
    },
    {
      label: 'Manage Categories',
      href: ROUTES.ADMIN_CATEGORIES,
      description: 'Manage seasonal designer divisions',
      bgColor: 'bg-white',
      textColor: 'text-neutral-900',
      accentColor: 'text-secondary',
    },
    {
      label: 'Manage Offers',
      href: ROUTES.ADMIN_OFFERS,
      description: 'Create active campaign banners',
      bgColor: 'bg-white',
      textColor: 'text-neutral-900',
      accentColor: 'text-secondary',
    },
    {
      label: 'Manage Inquiries',
      href: ROUTES.ADMIN_CONTACTS,
      description: 'Review and answer user contacts',
      bgColor: 'bg-white',
      textColor: 'text-neutral-900',
      accentColor: 'text-secondary',
    },
    {
      label: 'System Settings',
      href: ROUTES.ADMIN_SETTINGS,
      description: 'Configure layout branding parameters',
      bgColor: 'bg-white',
      textColor: 'text-neutral-900',
      accentColor: 'text-secondary',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
          WORKFLOW SHORTCUTS
        </span>
        <h3 className="text-xl font-bold tracking-tight text-neutral-900">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {actions.map((act, idx) => (
          <Link
            key={idx}
            href={act.href}
            className={`border border-neutral-100 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-md hover:border-neutral-200 hover:-translate-y-0.5 active:scale-99 ${act.bgColor} ${act.textColor}`}
          >
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold tracking-tight uppercase leading-none">
                {act.label}
              </h4>
              <p className="text-[11px] text-neutral-400 font-semibold leading-relaxed">
                {act.description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-widest text-secondary mt-2">
              Launch console
              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
