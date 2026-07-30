"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button.jsx';
import authService from '@/services/auth.service.js';
import toast from '@/utils/toast.js';

/**
 * Premium Multistep Forgot Password Flow Component.
 * Generic & Private for Customer & Admin accounts.
 * Features 6-digit auto-focus numeric OTP input, 60s resend timer, and password reset.
 */
export const ForgotPasswordClient = () => {
  const router = useRouter();

  // Active step: 1 = Email, 2 = Verify OTP, 3 = New Password
  const [step, setStep] = useState(1);

  // Form field states
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & timer states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // OTP input refs for auto-focus navigation
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // 60-second Countdown Timer for Resend OTP
  useEffect(() => {
    let timer = null;
    if (step === 2 && countdown > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (step === 2 && countdown === 0) {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Focus first OTP input when stepping into OTP verification
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 100);
    }
  }, [step]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setError(null);

    const sanitizedEmail = email.trim().toLowerCase();
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!sanitizedEmail || !emailRegex.test(sanitizedEmail)) {
      const msg = 'Please enter a valid email address.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      await authService.forgotPassword(sanitizedEmail);
      toast.success('OTP sent successfully. Please check your registered email.');
      setStep(2);
      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Resend OTP trigger
  const handleResendOtp = async () => {
    if (!canResend || submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      await authService.forgotPassword(email.trim().toLowerCase());
      toast.success('A new OTP has been sent to your email.');
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      setTimeout(() => {
        otpInputRefs[0].current?.focus();
      }, 50);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend OTP. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // OTP 6-Digit Auto-Focus Handlers
  const handleOtpChange = (index, value) => {
    // Only accept numeric digits
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1); // Take single digit
    setOtpDigits(newOtp);
    if (error) setError(null);

    // Auto-advance focus to next input box if digit entered
    if (value && index < 5) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Move to previous box on Backspace if current box is empty
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Pasted text must be a 6-digit numeric OTP');
      return;
    }

    const digits = pastedData.split('');
    setOtpDigits(digits);
    if (error) setError(null);
    otpInputRefs[5].current?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setError(null);

    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6 || !/^\d{6}$/.test(fullOtp)) {
      const msg = 'Please enter all 6 numeric digits of the OTP.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const response = await authService.verifyOtp(email.trim().toLowerCase(), fullOtp);
      const token = response.data?.resetToken || response.resetToken;

      if (!token) {
        throw new Error('Verification failed. Invalid reset token.');
      }

      setResetToken(token);
      toast.success('OTP verified successfully.');
      setStep(3);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      const msg = 'Please provide both new password and password confirmation.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (newPassword.length < 8) {
      const msg = 'Password must be at least 8 characters long.';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (newPassword !== confirmPassword) {
      const msg = 'Passwords do not match.';
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      await authService.resetPassword({
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword,
        confirmPassword,
      });

      toast.success('Password updated successfully. Please login with your new password.');
      setTimeout(() => {
        router.push('/login');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update password. Session may have expired.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Step Title */}
      <div className="space-y-1 text-center sm:text-left">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-secondary block mb-1">
          SECURITY & RECOVERY
        </span>
        <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
          {step === 1 && 'Reset Your Password'}
          {step === 2 && 'Verify One-Time Password'}
          {step === 3 && 'Set New Password'}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {step === 1 && 'Enter your registered email address to receive a secure 6-digit verification OTP.'}
          {step === 2 && `Enter the 6-digit OTP code sent to ${email}. Valid for 10 minutes.`}
          {step === 3 && 'Create a strong new password with a minimum of 8 characters.'}
        </p>
      </div>

      {/* Inline Error Notice */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: EMAIL REQUEST FORM */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Registered Email Address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="name@example.com"
              disabled={submitting}
              required
              className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl uppercase tracking-wider text-xs font-bold py-3.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending OTP...</span>
              </>
            ) : (
              'Send OTP'
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
              </svg>
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: 6-DIGIT OTP VERIFICATION FORM */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-6" noValidate>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block text-center sm:text-left">
              6-Digit Security OTP
            </label>

            {/* Auto-focus 6 individual numeric input boxes */}
            <div className="flex items-center justify-between gap-2 sm:gap-3" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={otpInputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  disabled={submitting}
                  className="w-11 h-13 sm:w-13 sm:h-14 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-xl font-bold text-neutral-900 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all duration-200 disabled:opacity-50"
                  aria-label={`OTP Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Countdown & Resend Option */}
          <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
            <span>
              {countdown > 0 ? (
                <span className="font-medium text-neutral-400">
                  Resend available in <strong className="text-neutral-900">{countdown}s</strong>
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold">Resend available now</span>
              )}
            </span>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || submitting}
              className="font-bold text-secondary hover:text-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Resend OTP
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={submitting || otpDigits.join('').length !== 6}
              className="w-full rounded-xl uppercase tracking-wider text-xs font-bold py-3.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying OTP...</span>
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
              }}
              className="w-full text-center text-xs font-bold text-neutral-400 hover:text-neutral-700 transition-colors py-1"
            >
              Change Email Address
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD FORM */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
          {/* New Password */}
          <div className="space-y-1.5">
            <label htmlFor="reset-new-password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              New Password (Min. 8 Chars)
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter at least 8 characters"
                disabled={submitting}
                required
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-4 pr-11 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
              >
                {showNewPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="reset-confirm-password" className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Re-enter your new password"
                disabled={submitting}
                required
                className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-4 pr-11 py-3 text-sm outline-none placeholder:text-neutral-400 focus:border-secondary focus:bg-white transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors focus:outline-none"
              >
                {showConfirmPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.04 10.04 0 012.122-.063c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl uppercase tracking-wider text-xs font-bold py-3.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Updating Password...</span>
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordClient;
