import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/auth';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8">
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email!</h2>
              <p className="text-gray-300 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg text-sm mb-6">
                <p className="font-semibold mb-2">📧 Next Steps:</p>
                <ol className="list-decimal list-inside text-left space-y-1">
                  <li>Check your email inbox</li>
                  <li>Click the reset password link</li>
                  <li>Enter your new password</li>
                  <li>Login with new credentials</li>
                </ol>
              </div>
              <p className="text-gray-400 text-sm mb-4">Didn't receive the email? Check your spam folder.</p>
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password?</h2>
            <p className="text-gray-300">Enter your email to receive reset instructions</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 px-6 rounded-full hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
