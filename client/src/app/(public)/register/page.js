import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import RegisterForm from '@/components/auth/RegisterForm.jsx';

export const metadata = generatePageMetadata({
  title: 'Register',
  description: 'Create a new account at Mahakaal Fashion Trends to enjoy tailored ethnic recommendations, shopping cart saving, and order tracking.',
  keywords: ['register', 'sign up', 'join portal', 'customer registration'],
});

export default function RegisterPage() {
  return (
    <AuthLayout type="register">
      <RegisterForm />
    </AuthLayout>
  );
}
