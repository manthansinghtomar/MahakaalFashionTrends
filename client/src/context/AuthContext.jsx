'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setUser(res.user);
    }
    return res;
  };

  const adminLogin = async (credentials) => {
    const res = await authService.adminLogin(credentials);
    if (res && res.success && res.admin) {
      setUser({ ...res.admin, role: res.admin.role || 'admin' });
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res && res.success && res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res && res.success) {
      if (res.user) {
        setUser(res.user);
      } else if (res.admin) {
        setUser({ ...res.admin, role: res.admin.role || 'admin' });
      }
    }
    return res;
  };

  const changePassword = async (passwordData) => {
    return await authService.changePassword(passwordData);
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
