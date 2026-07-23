'use client';

import React, { useState, useEffect } from 'react';
import { toastEvents } from '@/utils/toast.js';

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastEvents.subscribe((type, message) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message }]);
    });
    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[9999] flex flex-col gap-3 w-[calc(100%-2rem)] sm:w-96 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 4.5 seconds
    const timer = setTimeout(() => {
      setExiting(true);
    }, 4500);

    // Call close callback after animation finishes
    const removeTimer = setTimeout(() => {
      onClose();
    }, 4800);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 200);
  };

  const icons = {
    success: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  // Glassmorphic borders matching gold, red, amber, and dark aesthetics
  const styles = {
    success: 'border-[#d9a05b]/30 shadow-[#d9a05b]/5',
    error: 'border-red-500/30 shadow-red-500/5',
    warning: 'border-amber-500/30 shadow-amber-500/5',
    info: 'border-neutral-800 shadow-black/20',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-neutral-950/95 backdrop-blur-md text-white shadow-lg transition-all duration-300 transform ${
        exiting
          ? 'opacity-0 translate-x-10 scale-95'
          : 'opacity-100 translate-x-0 scale-100 animate-slide-in'
      } ${styles[toast.type] || styles.info}`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type] || icons.info}</div>
      <div className="flex-1 text-xs font-medium tracking-wide text-neutral-200 pr-1 leading-relaxed">
        {toast.message}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-neutral-500 hover:text-white transition-colors p-0.5 rounded-lg hover:bg-neutral-900"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastContainer;
