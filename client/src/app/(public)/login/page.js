import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import LoginForm from '@/components/auth/LoginForm.jsx';

export const metadata = generatePageMetadata({
  title: 'Login',
  description: 'Log in to your Mahakaal Fashion Trends customer account to track orders and save your favorite ethnic wears.',
  keywords: ['sign in', 'user login', 'account portal'],
});

export default function LoginPage() {
  return (
    <AuthLayout type="login">
      <LoginForm />
    </AuthLayout>
  );
}
