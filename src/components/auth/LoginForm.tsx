import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { OTPInput } from '../OTPInput';
import { resendLoginOTP, resendVerification } from '../../services/auth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpTimer, setOtpTimer] = useState(600);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const { loginStep1, loginStep2, otpSent, isLoading, error: storeError, resetOtpState } = useAuthStore();
  const navigate = useNavigate();

  // Debug: Log otpSent changes
  useEffect(() => {
    console.log('🔔 otpSent changed:', otpSent);
  }, [otpSent]);

  useEffect(() => {
    if (otpSent && otpTimer > 0) {
      const timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, otpTimer]);

  useEffect(() => {
    if (storeError) {
      setError(storeError);
    }
  }, [storeError]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setRequiresVerification(false);
    setVerificationMessage('');

    console.log('🔐 Step 1: Submitting login...');
    const result = await loginStep1(email, password);
    console.log('📨 Step 1 result:', result);
    console.log('📬 OTP sent state:', otpSent);
    
    if (result.success) {
      console.log('✅ Login Step 1 successful, OTP should be sent');
      setOtpTimer(600);
      setCanResendOtp(false);
    } else if (result.error) {
      const errorMessage = result.error.toLowerCase();
      if (errorMessage.includes('email not verified') || 
          errorMessage.includes('verify your email') ||
          errorMessage.includes('verification')) {
        setRequiresVerification(true);
        setVerificationEmail(email);
      }
      setError(result.error);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setVerificationMessage('');
    setError('');

    try {
      await resendVerification();
      setVerificationMessage('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  const handleStep2Submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    console.log('🔐 Verifying OTP:', otp);
    
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    const result = await loginStep2(otp);
    if (result.success) {
      console.log('✅ OTP verified! Redirecting to dashboard...');
      navigate('/dashboard');
    } else if (result.error) {
      console.log('❌ OTP verification failed:', result.error);
      setError(result.error);
    }
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && otpSent) {
      console.log('🚀 Auto-verifying OTP...');
      handleStep2Submit();
    }
  }, [otp]);

  const handleResendOtp = async () => {
    setError('');
    setCanResendOtp(false);

    try {
      await resendLoginOTP(email);
      setOtpTimer(600);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
      setCanResendOtp(true);
    }
  };

  const handleBackToLogin = () => {
    resetOtpState();
    setOtp('');
    setError('');
    setOtpTimer(600);
    setCanResendOtp(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  console.log('🎨 LoginForm rendering, otpSent:', otpSent);

  if (otpSent) {
    return (
      <form onSubmit={handleStep2Submit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-400 px-4 py-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 className="font-semibold mb-1">Check Your Email!</h3>
              <p className="text-sm">
                We've sent a 6-digit OTP to <strong>{email}</strong>
              </p>
            </div>
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Enter OTP
            </label>
            <OTPInput
              length={6}
              onComplete={(code) => {
                console.log('✅ OTP Complete callback received:', code);
                setOtp(code);
              }}
            />
          </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {otpTimer > 0 ? (
              <>Time remaining: <span className="text-cyan-400 font-semibold">{formatTime(otpTimer)}</span></>
            ) : (
              <span className="text-red-400">OTP expired</span>
            )}
          </span>
          {canResendOtp && (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Resend OTP
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors"
        >
           Back to login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleStep1Submit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {requiresVerification && (
        <div className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 px-4 py-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Email Not Verified</h3>
              <p className="text-sm mb-3">
                Please verify your email address before logging in. We sent a verification link to <strong>{verificationEmail}</strong>.
              </p>
              
              {verificationMessage && (
                <div className="bg-green-500/20 text-green-400 px-3 py-2 rounded mb-3 text-sm">
                  {verificationMessage}
                </div>
              )}
              
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="text-sm bg-yellow-500/20 hover:bg-yellow-500/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendingVerification ? (
                  <>
                    <span className="inline-block animate-spin mr-2"></span>
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/10/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      <div className="flex items-center justify-end">
        <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

