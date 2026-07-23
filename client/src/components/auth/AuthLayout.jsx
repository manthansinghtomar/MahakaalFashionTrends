import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo.jsx';

/**
 * Premium Layout container for Auth pages (Login / Register).
 * Splits screen into 2 sections on large screens (luxury branded panel on left, interactive card on right).
 */
export const AuthLayout = ({ children, type = 'login' }) => {
  const isLogin = type === 'login';

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 text-neutral-900 font-sans">
      
      {/* 1. Left Editorial Panel (Hidden on Mobile/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 text-white flex-col justify-between p-16 overflow-hidden">
        
        {/* Glowing background highlights */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.003)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.003)_1px,_transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center focus:outline-none">
            <Logo variant="dark" imgSize="w-20 h-20 lg:w-24 lg:h-24" />
          </Link>
        </div>

        {/* Center Quote/Copy */}
        <div className="relative z-10 max-w-md my-auto space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
            AUTUMN / WINTER COLLECTION
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {isLogin 
              ? 'Wear your attitude, define your trend.' 
              : 'Join the circle of bespoke luxury.'}
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Experience our hand-tailored custom ethnic selections, wedding sherwanis, and elegant Nehru jackets designed to perfection.
          </p>
        </div>

        {/* Bottom copyright details */}
        <div className="relative z-10 text-xs text-neutral-500 font-medium">
          © {new Date().getFullYear()} Mahakaal Fashion Trends. All Rights Reserved.
        </div>
      </div>

      {/* 2. Right Interactive Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 relative">
        {/* Top Header Logo for mobile views */}
        <div className="lg:hidden mb-6">
          <Link href="/" className="inline-flex items-center focus:outline-none">
            <Logo variant="light" imgSize="w-20 h-20" />
          </Link>
        </div>

        {/* Content Card Wrapper */}
        <div className="w-full max-w-md bg-white border border-neutral-100 rounded-3xl p-8 sm:p-10 shadow-xs">
          {/* Centered Brand Emblem for Form Header */}
          <div className="flex justify-center mb-6">
            <Link href="/" className="inline-flex items-center focus:outline-none">
              <Logo variant="light" imgSize="w-20 h-20 sm:w-24 sm:h-24" showText={false} />
            </Link>
          </div>
          {children}
        </div>
      </div>
      
    </div>
  );
};

export default AuthLayout;
