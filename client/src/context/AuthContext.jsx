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
      if (res && res.success && res.user) {
        setUser(res.user);
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

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, logout, checkAuth }}>
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
