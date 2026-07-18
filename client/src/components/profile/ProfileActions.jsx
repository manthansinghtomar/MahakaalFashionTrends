"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import toast from '@/utils/toast.js';
import { handleApiError } from '@/utils/apiErrorHandler.js';

/**
 * Renders actions (Edit profile dialog, change password dialog, and Logout).
 */
export const ProfileActions = () => {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Modal display states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Loading states
  const [editLoading, setEditLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const isCustomer = currentUser && currentUser.role !== 'admin' && currentUser.role !== 'superadmin';

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setLoggingOut(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      fullName: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
    });
    setIsEditOpen(true);
  };

  const openPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsPasswordOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      toast.error('Please enter a valid full name');
      return;
    }

    if (!editForm.email.trim()) {
      toast.error('Email address is required');
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(editForm.email.trim().toLowerCase())) {
      toast.error('Please enter a valid email address');
      return;
    }

    setEditLoading(true);
    try {
      const payload = { 
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
      };
      const res = await updateProfile(payload);
      if (res && res.success) {
        toast.success('Profile updated successfully!');
        setIsEditOpen(false);
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error(errorMsg);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Confirm password does not match new password');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      toast.error('New password cannot be the same as the current password');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      if (res && res.success) {
        toast.success('Password changed successfully!');
        setIsPasswordOpen(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (err) {
      const errorMsg = handleApiError(err);
      toast.error(errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-end mt-8">
      {/* Edit Profile */}
      <Button
        variant="outline"
        onClick={openEditModal}
        className="w-full sm:w-auto rounded-xl uppercase tracking-wider text-xs font-semibold px-6 py-3 border-neutral-200 text-neutral-855 hover:bg-neutral-50 transition"
        aria-label="Edit Profile Details"
      >
        Edit Profile
      </Button>

      {/* Change Password */}
      <Button
        variant="outline"
        onClick={openPasswordModal}
        className="w-full sm:w-auto rounded-xl uppercase tracking-wider text-xs font-semibold px-6 py-3 border-neutral-200 text-neutral-855 hover:bg-neutral-50 transition"
        aria-label="Change Account Password"
      >
        Change Password
      </Button>

      {/* Logout Button */}
      <Button
        variant="danger"
        onClick={handleLogout}
        loading={loggingOut}
        disabled={loggingOut}
        className="w-full sm:w-auto rounded-xl bg-red-600 text-white hover:bg-red-700 font-bold uppercase tracking-wider text-xs px-6 py-3 transition-all duration-300"
      >
        Sign Out
      </Button>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all animate-fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-6 relative text-neutral-900">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">Edit Profile Details</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
              />
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={editLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all animate-fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-6 relative text-neutral-900">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">Change Account Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setIsPasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={passwordLoading}>
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileActions;
