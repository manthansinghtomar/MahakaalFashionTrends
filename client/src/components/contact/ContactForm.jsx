'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Textarea from '@/components/ui/Textarea.jsx';
import contactService from '@/services/contact.service.js';
import { handleApiError } from '@/utils/apiErrorHandler.js';
import toast from '@/utils/toast.js';

/**
 * ContactForm component (Client Component).
 * Renders contact fields, validates input values, submits inquiries via contactService,
 * and handles UI loading/error/success feedback states.
 */
export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error as they type
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // 1. Client-side Validations (matching project validation style)
    const newErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = 'Full Name is required';
    }
    if (!trimmedEmail) {
      newErrors.email = 'Email Address is required';
    } else if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      // Reusing standard email checker without introducing new regex schemas
      newErrors.email = 'Please enter a valid email address';
    }
    if (!trimmedSubject) {
      newErrors.subject = 'Subject is required';
    }
    if (!trimmedMessage) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please correct the validation errors in the form.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await contactService.submitInquiry({
        name: trimmedName,
        email: trimmedEmail,
        phone: formData.phone.trim() || undefined,
        subject: trimmedSubject,
        message: trimmedMessage,
      });

      if (response && (response.data?.success || response.success)) {
        toast.success(response.data?.message || 'Your inquiry has been submitted successfully.');
        setSuccess(true);
        // Clear all form inputs
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error('Failed to submit message. Please try again.');
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error(errorMsg);
      // Map general or specific validation failures to the UI
      setErrors({
        submit: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold tracking-tight text-neutral-900">
          Send an Inquiry
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          Fill out the form below and our style advisors will assist you.
        </p>
      </div>

      {/* Success Notification Banner */}
      {success && (
        <div 
          className="p-4 rounded-xl bg-secondary/5 border border-secondary/15 flex items-start gap-3 text-left animate-fade-in"
          role="alert"
        >
          <div className="flex-shrink-0 text-secondary mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-secondary">Inquiry Received</h4>
            <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
              Thank you for reaching out. A store coordinator has been assigned to your query and will reply via email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Submission Error Banner */}
      {errors.submit && (
        <div 
          className="p-4 rounded-xl bg-red-50 border border-red-150 flex items-start gap-3 text-left animate-fade-in"
          role="alert"
        >
          <div className="flex-shrink-0 text-red-500 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-800">Submission Failure</h4>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              {errors.submit}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name field */}
        <Input
          label="Full Name *"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={submitting}
          placeholder="Enter your name"
          required
        />

        {/* Email & Phone side-by-side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={submitting}
            placeholder="name@example.com"
            required
          />
          <Input
            label="Phone Number (Optional)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            disabled={submitting}
            placeholder="Enter contact number"
          />
        </div>

        {/* Subject field */}
        <Input
          label="Subject *"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          disabled={submitting}
          placeholder="e.g. Custom Fit Order, Sizing Inquiry"
          required
        />

        {/* Message field */}
        <Textarea
          label="Message *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
          disabled={submitting}
          placeholder="Type your detailed inquiry here..."
          required
          rows={5}
        />

        {/* Submit button */}
        <div className="pt-2">
          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold uppercase tracking-wider text-xs py-3.5"
          >
            Send Inquiry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
