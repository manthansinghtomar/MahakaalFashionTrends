import React from 'react';

/**
 * Editorial header for the User Profile dashboard.
 */
export const ProfileHeader = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-12 max-w-2xl mx-auto">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
        MY ACCOUNT
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
        Personal Profile
      </h1>
      <p className="text-sm text-neutral-500 leading-relaxed">
        Manage your security credentials, view personal details, and configure order tracking preferences.
      </p>
    </div>
  );
};

export default ProfileHeader;
