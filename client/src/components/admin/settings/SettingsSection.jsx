import React from 'react';

/**
 * SettingsSection component.
 * Groups setting cards under headers.
 */
export const SettingsSection = ({ title, description, children }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;
