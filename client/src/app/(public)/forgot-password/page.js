import React from 'react';
import { generatePageMetadata } from '@/utils/metadata.js';
import AuthLayout from '@/components/auth/AuthLayout.jsx';
import ForgotPasswordClient from '@/components/auth/ForgotPasswordClient.jsx';

export const metadata = generatePageMetadata({
  title: 'Forgot Password',
  description: 'Reset your password securely using Email OTP verification for Mahakaal Fashion Trends.',
  keywords: ['forgot password', 'reset password', 'otp verification'],
});

export default function ForgotPasswordPage() {
  return (
    <AuthLayout type="login">
      <ForgotPasswordClient />
    </AuthLayout>
  );
}
