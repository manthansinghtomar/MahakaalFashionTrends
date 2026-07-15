import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';

export const metadata = generatePageMetadata({
  title: 'Register',
  description: 'Create a new account at Mahakaal Fashion Trends to enjoy tailored ethnic recommendations, shopping cart saving, and order tracking.',
  keywords: ['register', 'sign up', 'join portal', 'customer registration'],
});

export default function RegisterPage() {
  return (
    <div className="p-8 text-center max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800">Register</h1>
      <p className="mt-2 text-sm text-neutral-500">Create a new customer account.</p>
    </div>
  );
}
