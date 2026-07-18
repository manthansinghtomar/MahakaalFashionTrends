import React from 'react';

/**
 * SettingsCard component.
 * Displays key-value diagnostic configurations in read-only format.
 */
export const SettingsCard = ({ label, value, icon }) => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-xs flex items-start gap-4">
      {icon && (
        <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xl text-neutral-500 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="block font-extrabold text-neutral-850 text-sm leading-tight break-all">
          {value || 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default SettingsCard;
