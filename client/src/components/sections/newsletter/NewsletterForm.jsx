"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button.jsx';

/**
 * Interactive Newsletter subscription form (Client Component).
 * Keeps the input form visible upon success, clearing the input and displaying an inline success alert.
 */
export const NewsletterForm = ({ config }) => {
  const { placeholder, buttonText, successMessage } = config;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedEmail = email.trim();

    // Basic lightweight validation checks
    if (!trimmedEmail) {
      setError('Please provide an email address.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // On success, reset input field and display success banner
      setEmail('');
      setSuccess(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full" noValidate>
        {/* Input container */}
        <div className="flex-grow">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null); // Clear errors dynamically on type
            }}
            placeholder={placeholder}
            disabled={submitting}
            required
            className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-full px-6 py-3.5 text-sm outline-none placeholder:text-neutral-500 focus:border-secondary focus:ring-1 focus:ring-secondary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Subscribe Button */}
        <div className="flex-shrink-0">
          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="w-full sm:w-auto rounded-full bg-secondary text-neutral-950 hover:bg-white hover:text-neutral-950 font-bold uppercase tracking-wider text-xs px-8 py-3.5 active:scale-98 transition-all duration-300"
          >
            {buttonText}
          </Button>
        </div>
      </form>

      {/* Validation / Submission Error block */}
      {error && (
        <p className="text-red-400 text-xs text-left mt-2.5 px-4 font-medium animate-fade-in">
          {error}
        </p>
      )}

      {/* Inline success display container */}
      {success && (
        <div 
          className="mt-4 p-4 rounded-xl bg-secondary/5 border border-secondary/15 flex items-start gap-3 text-left animate-fade-in"
          role="alert"
        >
          {/* Checkmark Icon */}
          <div className="flex-shrink-0 text-secondary mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-secondary leading-snug">
            {successMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;
