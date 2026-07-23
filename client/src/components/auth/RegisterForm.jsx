"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext.jsx';
import Button from '@/components/ui/Button.jsx';
import toast from '@/utils/toast.js';

/**
 * RegisterForm Client Component.
 * Supports credentials forms, password show/hide, password match confirmations, and redirects.
 */
export const RegisterForm = () => {
  const { register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect target URL from search params
  const redirect = searchParams.get('redirect') || '/';

  // Form field states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Redirection guard if already logged in
  useEffect(() => {
    if (user) {
      router.push(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // 1. Client-side field validations
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      const msg = 'Please fill in all required fields.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please check fields.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });

      if (res && res.success) {
        setSuccess(true);
        // Redirection triggers automatically through useEffect above
      } else {
        const msg = res?.message || 'Registration failed. Please check input parameters.';
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.message || 'An error occurred. Please verify your fields and try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* 1. Header Details */}
      <div className="space-y-1 text-center sm:text-left">
        <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
          Create Account
        </h3>
        <p className="text-sm text-neutral-400">
          Join us and explore premium bespoke ethnic collections.
        </p>
      </div>

      {/* 2. Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="reg-name" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Full Name *
          </label>
          <input
            id="reg-name"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter your full name"
            disabled={submitting}
            required
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
          />
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Email Address *
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter your email address"
            disabled={submitting}
            required
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
          />
        </div>

        {/* Phone Number Input (Optional backend lookup) */}
        <div className="space-y-1.5">
          <label htmlFor="reg-phone" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Phone Number
          </label>
          <input
            id="reg-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter your contact number"
            disabled={submitting}
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
          />
        </div>

        {/* Password Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Password *
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Password"
                disabled={submitting}
                required
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-4 pr-10 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={submitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-confirm" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Confirm Password *
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Confirm password"
              disabled={submitting}
              required
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Validation Errors block */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-500 animate-fade-in text-left leading-relaxed">
            {error}
          </div>
        )}

        {/* Success block */}
        {success && (
          <div className="p-3.5 bg-secondary/5 border border-secondary/15 rounded-xl text-xs font-semibold text-secondary text-center animate-fade-in">
            Account created successfully. Logging in...
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
            Create Account
          </Button>
        </div>
      </form>

      {/* 3. Link to login page */}
      <div className="text-center text-xs text-neutral-500">
        Already have a customer account?{' '}
        <Link 
          href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} 
          className="font-bold text-neutral-900 hover:text-secondary transition-colors"
        >
          Sign In
        </Link>
      </div>

    </div>
  );
};

export default RegisterForm;
