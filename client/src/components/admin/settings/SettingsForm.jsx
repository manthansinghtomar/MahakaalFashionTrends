"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext.jsx';

/**
 * SettingsForm component.
 * Allows managing user preferences (e.g. Dark Mode) by hooking directly into the global ThemeContext.
 */
export const SettingsForm = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-neutral-900 tracking-tight">
          Interface Customizations
        </h4>
        <p className="text-xs text-neutral-400 font-semibold leading-relaxed">
          Local layouts are locked to the default luxury light theme.
        </p>
      </div>
    </div>
  );
};

export default SettingsForm;
