import React from 'react';
import { ROUTES } from '../../constants/index.js';

/**
 * AdminTopbar layout header template component.
 */
export const AdminTopbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
      <div className="text-sm font-semibold text-neutral-700">Administrator Console</div>
      <div>
        <a href={ROUTES.HOME} className="text-xs text-neutral-500 hover:underline">
          Back to Store
        </a>
      </div>
    </header>
  );
};


export default AdminTopbar;
