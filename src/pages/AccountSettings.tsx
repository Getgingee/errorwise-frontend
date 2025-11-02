import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, deleteAccount } from '../services/auth';
import Navigation from '../components/Navigation';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = getCurrentUser();

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you ABSOLUTELY sure? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await deleteAccount(deleteReason);
      alert('Account deleted successfully. We hope to see you again!');
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation />
      <div className="md:pl-64 pt-16 md:pt-0 py-8">
        <div className="max-w-[896px] mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white">Account <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Settings</span></h1>

        {/* Account Info */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <p className="font-medium text-white">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-300">Username</label>
              <p className="font-medium text-white">{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Verification Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Verification</span>
              {user?.isEmailVerified ? (
                <span className="text-green-400 font-medium"> Verified</span>
              ) : (
                <span className="text-yellow-400 font-medium"> Not Verified</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Phone Verification</span>
              {user?.isPhoneVerified ? (
                <span className="text-green-400 font-medium"> Verified</span>
              ) : (
                <span className="text-gray-400">Not Set</span>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
          
          <div className="bg-yellow-500/20 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
            <p className="text-sm text-yellow-300">
              <strong>Warning:</strong> Deleting your account will permanently remove all your data.
              If you recreate an account with the same email, you will be flagged as a returning user.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <textarea
                placeholder="Why are you leaving? (optional)"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                rows={3}
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
              />

              {error && (
                <div className="p-3 bg-red-500/20 border-l-4 border-red-400 text-red-300 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/10 text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};


