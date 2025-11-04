import React, { useState } from 'react';
import { register, resendVerification } from '../../services/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess(result.message);
      setRegisteredEmail(formData.email);
      setShowVerification(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await resendVerification();
      setSuccess(result.message);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show verification pending state
  if (showVerification) {
    return (
      <div className="space-y-4">
        {/* Success Message */}
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold mb-1">Check Your Email!</h3>
              <p className="text-sm">
                We've sent a verification link to <strong>{registeredEmail}</strong>.
                Click the link in the email to verify your account and log in.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold mb-2">📧 What's next?</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Open your email inbox</li>
            <li>Find the email from ErrorWise</li>
            <li>Click the verification link</li>
            <li>You'll be automatically logged in</li>
          </ol>
          <p className="mt-3 text-xs text-blue-300">
            💡 Tip: Check your spam folder if you don't see the email within a few minutes.
          </p>
        </div>

        {/* Resend Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-gray-400 text-sm">Didn't receive the email?</span>
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={loading}
            className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Email'}
          </button>
        </div>

        {/* Error/Success for Resend */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && !error && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-2 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Back to Registration */}
        <button
          type="button"
          onClick={() => {
            setShowVerification(false);
            setError('');
            setSuccess('');
          }}
          className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
        >
          ← Register a different account
        </button>
      </div>
    );
  }

  // Registration form
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
          minLength={3}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create a password (min 8 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Password Strength Indicator */}
      {formData.password && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <div className={`h-1 w-full rounded ${
              formData.password.length >= 12 ? 'bg-green-500' :
              formData.password.length >= 8 ? 'bg-yellow-500' :
              'bg-red-500'
            }`} />
          </div>
          <p className="text-xs text-gray-400">
            {formData.password.length >= 12 ? '✓ Strong password' :
             formData.password.length >= 8 ? '✓ Good password' :
             '⚠ Password too short'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Info Text */}
      <p className="text-xs text-center text-gray-400 mt-4">
        By creating an account, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export default RegisterForm;
