import { API_ENDPOINTS } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import { User, Mail, Calendar, Shield, Trash2, Edit3, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  memberSince: string;
}

interface UserStats {
  totalQueries: number;
  thisMonthQueries: number;
  subscriptionTier: string;
}

const ProfilePage: React.FC = () => {
  const { token, updateUser, logout } = useAuthStore();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.profile, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setStats(data.stats);
        setEditData({
          username: data.user.username,
          email: data.user.email
        });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.profile, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: editData.username,
          email: editData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        updateUser(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('https://errorwise-backend-production.up.railway.app/api/users/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch('https://errorwise-backend-production.up.railway.app/api/users/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          password: passwordData.currentPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account deleted successfully');
        logout();
      } else {
        toast.error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Navigation />
        <div className="md:pl-64 pt-16 md:pt-0 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation />
      <div className="md:pl-64 pt-16 md:pt-0 py-8">
        <div className="max-w-[896px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20">
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/20">
            <h1 className="text-3xl font-bold text-white">
              Account{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Settings
              </span>
            </h1>
            <p className="text-gray-300 mt-2">Manage your profile and account preferences</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-cyan-500/50 rounded-full text-sm font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 backdrop-blur-sm transition-all duration-300"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateProfile}
                          disabled={isSaving}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditData({
                              username: profile?.username || '',
                              email: profile?.email || ''
                            });
                          }}
                          className="inline-flex items-center px-4 py-2 border border-white/30 rounded-full text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Username */}
                    <div>
                      <label htmlFor="username-input" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                      {isEditing ? (
                        <input
                          id="username-input"
                          type="text"
                          value={editData.username}
                          onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          className="block w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Enter your username"
                          aria-label="Username"
                        />
                      ) : (
                        <div className="flex items-center bg-white/5 rounded-xl px-4 py-3">
                          <User className="h-5 w-5 text-cyan-400 mr-2" />
                          <span className="text-white">{profile?.username}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email-input" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          id="email-input"
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="block w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Enter your email"
                          aria-label="Email"
                        />
                      ) : (
                        <div className="flex items-center bg-white/5 rounded-xl px-4 py-3">
                          <Mail className="h-5 w-5 text-cyan-400 mr-2" />
                          <span className="text-white">{profile?.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Member Since */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Member Since</label>
                      <div className="flex items-center bg-white/5 rounded-xl px-4 py-3">
                        <Calendar className="h-5 w-5 text-cyan-400 mr-2" />
                        <span className="text-white">
                          {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Password & Security</h2>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="inline-flex items-center px-4 py-2 border border-cyan-500/50 rounded-full text-sm font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 backdrop-blur-sm transition-all duration-300"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="current-password-input" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                        <input
                          id="current-password-input"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="block w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Enter your current password"
                          aria-label="Current password"
                        />
                      </div>
                      <div>
                        <label htmlFor="new-password-input" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                        <input
                          id="new-password-input"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="block w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Enter your new password"
                          aria-label="New password"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirm-password-input" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                        <input
                          id="confirm-password-input"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="block w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                          placeholder="Confirm your new password"
                          aria-label="Confirm new password"
                        />
                      </div>
                      <button
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-full text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        {isChangingPassword ? 'Changing...' : 'Update Password'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mt-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-red-400">Delete Account</h2>
                      <p className="text-sm text-red-300/90">Permanently delete your account and all data</p>
                    </div>
                      <button
                        onClick={() => setShowDeleteForm(!showDeleteForm)}
                        className="inline-flex items-center px-4 py-2 border border-red-500/50 rounded-full text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 backdrop-blur-sm transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </button>
                    </div>
  
                    {showDeleteForm && (
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="delete-confirmation-input" className="block text-sm font-medium text-red-300 mb-1">
                            Type "DELETE" to confirm
                          </label>
                          <input
                            id="delete-confirmation-input"
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            className="block w-full border border-red-500/50 rounded-xl px-4 py-2 bg-red-500/10 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm"
                            placeholder="DELETE"
                            aria-label="Type DELETE to confirm account deletion"
                          />
                        </div>
                      <div>
                        <label htmlFor="delete-password-input" className="block text-sm font-medium text-red-300 mb-1">Password</label>
                        <input
                          id="delete-password-input"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="block w-full border border-red-500/50 rounded-xl px-4 py-2 bg-red-500/10 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400 backdrop-blur-sm"
                          placeholder="Enter your password"
                          aria-label="Password for account deletion"
                        />
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Sidebar */}
              <div>
                <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-lg">
                  <h2 className="text-xl font-semibold text-white mb-6">Account Stats</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-400">Total Queries</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">{stats?.totalQueries || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">This Month</p>
                      <p className="text-3xl font-bold text-cyan-400">{stats?.thisMonthQueries || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Plan</p>
                      <p className="text-lg font-semibold text-white capitalize">
                        {stats?.subscriptionTier || 'free'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;



