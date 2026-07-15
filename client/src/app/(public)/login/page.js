import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Login',
  description: 'Log in to your Mahakaal Fashion Trends customer account to track orders and save your favorite ethnic wears.',
  keywords: ['sign in', 'user login', 'account portal'],
});

export default function LoginPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Login</h1>
      <p className="mt-2 text-sm text-neutral-500">Access your Mahakaal Fashion Trends account.</p>
    </div>
  );
}
