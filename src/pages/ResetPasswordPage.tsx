import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/auth';
import { CheckCircle, XCircle, Loader2, Lock, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({ token: token, newPassword: password });
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 group">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white dark:text-white">ErrorWise</span>
            </Link>
          </div>

          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-4 border-red-500/50 backdrop-blur-sm mb-6">
              <XCircle className="h-10 w-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Invalid Reset Link</h2>
            <p className="text-gray-300 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Request New Link
              </button>
            </Link>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-300">
               Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
        <style>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .bounce-animation {
            animation: bounce 1s ease-in-out infinite;
          }
        `}</style>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center space-x-2 group">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white dark:text-white">ErrorWise</span>
            </Link>
          </div>

          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500/50 backdrop-blur-sm mb-6 bounce-animation">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Password Reset Successfully!</h2>
            <p className="text-gray-300 mb-6">
              Your password has been reset. Redirecting to login...
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
              <Loader2 className="h-4 w-4 text-green-400 animate-spin" />
              <span className="text-sm text-green-300">Redirecting...</span>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-300">
               Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 group">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white dark:text-white">ErrorWise</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white dark:text-white">Reset Your Password</h2>
          <p className="mt-2 text-gray-300 dark:text-gray-300">Enter your new password below</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                <XCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Reset Password</span>
                </>
              )}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-gray-300 dark:text-gray-300 hover:text-cyan-400 dark:hover:text-cyan-400 transition-colors duration-300">
                 Back to Login
              </Link>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-300">
             Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
