import React from 'react';
import Link from 'next/link';

/**
 * Bottom section of the Footer containing copyright, legal links, and development credits.
 */
export const FooterBottom = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-neutral-100 py-6 mt-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[13px] text-neutral-600">
        
        {/* Left: Copyright */}
        <div>
          <p>&copy; {currentYear} Mahakaal Fashion Trends. All rights reserved.</p>
        </div>

        {/* Center: Legal Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/privacy-policy"
            className="text-neutral-600 hover:text-secondary transition duration-300 focus:outline-none focus:underline font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-conditions"
            className="text-neutral-600 hover:text-secondary transition duration-300 focus:outline-none focus:underline font-medium"
          >
            Terms & Conditions
          </Link>
        </div>

        {/* Right: Credits */}
        <div>
          <p>
            Designed & Developed by{' '}
            <span className="text-neutral-800 font-semibold">Mahakaal Fashion Trends</span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default FooterBottom;
