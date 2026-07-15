'use client';

import React, { useEffect } from 'react';
import Error from '@/components/ui/Error.jsx';

export default function RootError({ error, reset }) {
  useEffect(() => {
    console.error('Root Layout error boundary caught an exception:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Error
        message={error?.message || 'A critical error occurred while rendering.'}
        retry={reset}
      />
    </div>
  );
}
