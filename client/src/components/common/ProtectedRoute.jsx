'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext.jsx';
import Loading from '../ui/Loading.jsx';

/**
 * Reusable client-side guard component to protect elements by authentication status and roles.
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const redirectUrl = window.location.pathname + window.location.search;
        router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.replace('/');
      }
    }
  }, [user, loading, router, allowedRoles]);

  const isAuthorized = user && (allowedRoles.length === 0 || allowedRoles.includes(user.role));

  if (loading || !isAuthorized) {
    return <Loading fullScreen />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

