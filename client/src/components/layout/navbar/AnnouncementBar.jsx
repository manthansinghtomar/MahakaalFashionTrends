'use client';

import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons.jsx';

/**
 * Announcement bar strip at the very top of the header page.
 * Supports offer rotations, custom colors, and dismiss controls.
 */
export const AnnouncementBar = ({
  announcements = [
    {
      id: 1,
      text: '🚚 Free Shipping above ₹999 | Easy Returns | Premium Quality',
      backgroundColor: 'bg-neutral-900',
      textColor: 'text-neutral-100',
      isClosable: true,
    },
    {
      id: 2,
      text: '✨ Festival Sale: Use code MAHAKAAL10 for 10% extra off!',
      backgroundColor: 'bg-secondary',
      textColor: 'text-neutral-900',
      isClosable: true,
    },
  ],
  rotationIntervalMs = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible || announcements.length <= 1 || !rotationIntervalMs) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, rotationIntervalMs);

    return () => clearInterval(timer);
  }, [announcements.length, isVisible, rotationIntervalMs]);

  if (!isVisible || announcements.length === 0) return null;

  const currentAnnouncement = announcements[currentIndex];
  const {
    text,
    backgroundColor = 'bg-neutral-900',
    textColor = 'text-white',
    isClosable = true,
  } = currentAnnouncement;

  return (
    <div
      className={`relative z-50 flex min-h-[36px] items-center justify-center px-8 py-2 text-center text-xs font-semibold tracking-wide transition-colors duration-500 ${backgroundColor} ${textColor}`}
      role="region"
      aria-label="Announcements"
    >
      <div className="mx-auto max-w-7xl">
        <p className="transition-all duration-300">{text}</p>
      </div>

      {isClosable && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 hover:bg-black/10 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-current"
          aria-label="Dismiss announcement"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default AnnouncementBar;
