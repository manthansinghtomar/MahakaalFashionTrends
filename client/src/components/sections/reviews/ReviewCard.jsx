import React from 'react';

/**
 * Premium Review Card component.
 * Displays user name, avatar/initials, star rating, comment, formatted date, and product reference.
 */
export const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { rating, comment, createdAt, user, product } = review;

  // Simple date formatter (e.g., "15 Jul 2026")
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Format as "Day Month Year" (e.g., 16 Jul 2026)
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return '';
    }
  };

  // Get initials for profile fallback
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const userName = user?.fullName || 'Anonymous Customer';
  const userAvatar = user?.profileImage;
  const productName = product?.name;

  return (
    <article 
      className="flex flex-col justify-between h-full bg-white p-6 sm:p-8 rounded-2xl border border-neutral-100 hover:border-neutral-200 shadow-xs hover:shadow-md transition-all duration-300 group"
      role="article"
    >
      <div className="space-y-4">
        {/* Star Rating & Date */}
        <div className="flex items-center justify-between gap-4">
          {/* Rating Stars */}
          <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? 'text-secondary fill-secondary' : 'text-neutral-200 fill-transparent'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Simple Formatted Date */}
          <time className="text-xs text-neutral-400 font-medium" dateTime={createdAt}>
            {formatDate(createdAt)}
          </time>
        </div>

        {/* Review Comment Text */}
        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed line-clamp-4 italic group-hover:text-neutral-800 transition-colors duration-300">
          &ldquo;{comment}&rdquo;
        </p>
      </div>

      {/* Footer Info: User & Product */}
      <div className="pt-6 mt-6 border-t border-neutral-50 flex items-center justify-between gap-4">
        {/* User profile */}
        <div className="flex items-center gap-3">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border border-neutral-100 shadow-xs"
              loading="lazy"
            />
          ) : (
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 text-secondary text-xs sm:text-sm font-bold flex items-center justify-center shadow-inner"
              aria-hidden="true"
            >
              {getInitials(userName)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-bold text-neutral-900 group-hover:text-secondary transition-colors duration-300">
              {userName}
            </span>
          </div>
        </div>

        {/* Product Reference */}
        {productName && (
          <div className="text-right max-w-[120px] sm:max-w-[150px]">
            <span className="block text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
              Product
            </span>
            <span className="block text-xs font-bold text-neutral-600 truncate hover:text-neutral-900 transition-colors duration-300">
              {productName}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default ReviewCard;
