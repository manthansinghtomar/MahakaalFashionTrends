import React from 'react';

/**
 * Visual card displaying user details (Initials, Full Name, Email, phone, role, creation date).
 */
export const ProfileInfoCard = ({ user }) => {
  if (!user) return null;

  const { fullName, email, phone, role, createdAt, profileImage } = user;

  // Extract name initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const initials = getInitials(fullName);

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-xs flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl mx-auto">
      
      {/* 1. Profile Avatar Panel */}
      <div className="flex-shrink-0">
        {profileImage ? (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-secondary/20 shadow-xs relative">
            <img
              src={profileImage}
              alt={fullName}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ) : (
          /* Gold Initials Fallback */
          <div 
            className="w-24 h-24 rounded-full bg-secondary/5 border-2 border-secondary/20 text-secondary flex items-center justify-center text-3xl font-extrabold tracking-wider"
            aria-label="User profile avatar fallback"
          >
            {initials}
          </div>
        )}
      </div>

      {/* 2. Text Details list */}
      <div className="flex-grow w-full space-y-4 text-center md:text-left">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Registered Member
          </span>
          <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight leading-none">
            {fullName}
          </h3>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm pt-2 border-t border-neutral-100">
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email Address</dt>
            <dd className="text-neutral-800 font-semibold mt-0.5">{email}</dd>
          </div>

          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Phone Number</dt>
            <dd className="text-neutral-800 font-semibold mt-0.5">{phone || 'Not Provided'}</dd>
          </div>

          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Account Role</dt>
            <dd className="text-neutral-800 font-semibold mt-0.5 capitalize">{role || 'User'}</dd>
          </div>

          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Member Since</dt>
            <dd className="text-neutral-800 font-semibold mt-0.5">{formatDate(createdAt)}</dd>
          </div>
        </dl>
      </div>

    </div>
  );
};

export default ProfileInfoCard;
