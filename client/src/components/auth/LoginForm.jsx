"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.jsx';
import Button from '@/components/ui/Button.jsx';

/**
 * LoginForm Client Component.
 * Supports password show/hide, submit pending flags, errors, and URL-based redirect forwards.
 */
export const LoginForm = () => {
  const { login, adminLogin, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect target URL from search params
  const redirect = searchParams.get('redirect') || '/';

  // Toggle modes
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Form field states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // UI Placeholder state

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirection guard if already logged in
  useEffect(() => {
    if (user) {
      // If admin logging in, redirect to dashboard by default if no redirect param exists
      const targetRedirect = redirect === '/' && (user.role === 'admin' || user.role === 'superadmin')
        ? '/admin/dashboard'
        : redirect;
      router.push(targetRedirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);

    try {
      const res = isAdminMode
        ? await adminLogin({ email: email.trim(), password })
        : await login({ email: email.trim(), password });

      if (res && res.success) {
        setSuccess(true);
      } else {
        setError(res?.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'An error occurred. Please verify your credentials and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in">
      
      {/* Tab Switch Selector */}
      <div className="flex border-b border-neutral-100">
        <button
          type="button"
          onClick={() => {
            setIsAdminMode(false);
            setError(null);
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none ${
            !isAdminMode 
              ? 'border-secondary text-neutral-900' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Customer Portal
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdminMode(true);
            setError(null);
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 outline-none ${
            isAdminMode 
              ? 'border-secondary text-neutral-900' 
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Admin Console
        </button>
      </div>

      {/* 1. Header Details */}
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
          {isAdminMode ? 'Admin Console' : 'Welcome Back'}
        </h3>
        <p className="text-sm text-neutral-400">
          {isAdminMode 
            ? 'Sign in with your secure administrator credentials.' 
            : 'Please enter your credentials to access your customer account.'
          }
        </p>
      </div>

      {/* 2. Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder={isAdminMode ? 'admin@mahakaal.com' : 'Enter your email address'}
            disabled={submitting}
            required
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Password
            </label>
            {/* Forgot Password Link */}
            {!isAdminMode && (
              <Link 
                href="#" 
                onClick={(e) => e.preventDefault()}
                className="text-xs font-bold text-secondary hover:text-neutral-900 transition-colors"
              >
                Forgot password?
              </Link>
            )}
          </div>
          
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter your password"
              disabled={submitting}
              required
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
            />
            {/* Show/Hide Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={submitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Remember Me UI Options */}
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={submitting}
            className="w-4 h-4 rounded-sm border-neutral-300 text-secondary focus:ring-secondary focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="remember-me" className="ml-2 text-xs font-semibold text-neutral-500 select-none cursor-pointer">
            Remember me on this device
          </label>
        </div>

        {/* Validation / Request Failure Alerts */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-500 animate-fade-in text-left leading-relaxed">
            {error}
          </div>
        )}

        {/* Success Indicator */}
        {success && (
          <div className="p-3.5 bg-secondary/5 border border-secondary/15 rounded-xl text-xs font-semibold text-secondary text-center animate-fade-in">
            {isAdminMode ? 'Administrator verified. Redirecting...' : 'Redirecting to account dashboard...'}
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="w-full rounded-xl bg-secondary text-neutral-950 hover:bg-neutral-900 hover:text-white font-bold uppercase tracking-wider text-xs py-3.5"
          >
            {isAdminMode ? 'Console Sign In' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* 3. Link to Register page */}
      {!isAdminMode ? (
        <div className="text-center text-xs text-neutral-500">
          Don&apos;t have a customer account?{' '}
          <Link 
            href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} 
            className="font-bold text-neutral-900 hover:text-secondary transition-colors"
          >
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="text-center text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-105 rounded-xl p-3 leading-relaxed">
          ⚠️ Administrators cannot register from the public portal. Setup must be initiated by backend database seeding scripts.
        </div>
      )}

    </div>
  );
};

export default LoginForm;

