'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import authService from '../services/auth.service.js';
import toast from '../utils/toast.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();



  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await authService.getCurrentUser();
      if (res && res.success) {
        if (res.user) {
          setUser(res.user);
        } else if (res.admin) {
          setUser({ ...res.admin, role: res.admin.role || 'admin' });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res && res.success && res.user) {
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
      }
      setUser(res.user);
      toast.success('Successfully logged in.');
    }
    return res;
  };

  const adminLogin = async (credentials) => {
    const res = await authService.adminLogin(credentials);
    if (res && res.success && res.admin) {
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
      }
      setUser({ ...res.admin, role: res.admin.role || 'admin' });
      toast.success('Successfully logged in.');
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res && res.success && res.user) {
      if (res.token && typeof window !== 'undefined') {
        localStorage.setItem('token', res.token);
      }
      setUser(res.user);
      toast.success('Successfully registered.');
    }
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore logout network errors
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
      toast.success('Logged out successfully.');
    }
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res && res.success) {
      if (res.user) {
        setUser(res.user);
      } else if (res.admin) {
        setUser({ ...res.admin, role: res.admin.role || 'admin' });
      }
      toast.success('Profile updated successfully!');
    }
    return res;
  };

  const changePassword = async (passwordData) => {
    const res = await authService.changePassword(passwordData);
    if (res && res.success) {
      toast.success('Password changed successfully!');
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        isAuthenticated: !!user,
        loading,
        login,
        adminLogin,
        logout,
        register,
        checkAuth,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
