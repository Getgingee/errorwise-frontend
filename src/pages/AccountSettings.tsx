import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';
import Navigation from '../components/Navigation';
import { EmailChangeDialog } from '../components/auth/EmailChangeDialog';
import { SessionManagement } from '../components/auth/SessionManagement';
import { AccountDeletionDialog } from '../components/auth/AccountDeletionDialog';

export const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation />
      <div className="md:pl-64 pt-16 md:pt-0 py-8">
        <div className="max-w-[896px] mx-auto px-4 space-y-6">
          <h1 className="text-3xl font-bold mb-8 text-white">
            Account <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Settings</span>
          </h1>

          {/* Account Info */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Account Information</h2>
              <EmailChangeDialog currentEmail={user?.email || ''} />
            </div>
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
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl p-6">
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
                  <span className="text-yellow-400 font-medium"> Not Verified</span>
                )}
              </div>
            </div>
          </div>

          {/* Session Management */}
          <SessionManagement onSessionRevoked={() => console.log('Session revoked')} />

          {/* Danger Zone */}
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>

            <div className="bg-yellow-500/20 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg">
              <p className="text-sm text-yellow-300">
                <strong>Warning:</strong> Deleting your account will cancel subscriptions, disable access, 
                and schedule permanent data deletion in 30 days. You can restore within 30 days.
              </p>
            </div>

            <AccountDeletionDialog 
              onDeleted={() => {
                console.log('Account deleted');
                navigate('/login');
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
