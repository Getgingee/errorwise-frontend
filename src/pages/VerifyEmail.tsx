import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { verifyEmail as verifyEmailService, resendVerification } from '../services/auth';
import { CheckCircle, XCircle, Loader2, Mail, Sparkles } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  
  const email = location.state?.email || '';
  const token = searchParams.get('token');
  
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token found');
    }
  }, [token]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await verifyEmailService(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. Token may be expired.');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResendLoading(false);
    }
  };

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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .bounce-animation {
          animation: bounce 1s ease-in-out infinite;
        }

        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .pulse-delay-200 {
          animation-delay: 0.2s;
        }

        .pulse-delay-400 {
          animation-delay: 0.4s;
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

        {/* Status Card */}
        <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8">
          {status === 'verifying' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 border-4 border-blue-500/50 backdrop-blur-sm">
                  <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Verifying Email...</h2>
              <p className="text-gray-300">Please wait while we verify your email address.</p>
              <div className="mt-6 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full pulse-animation"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full pulse-animation" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full pulse-animation" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500/50 backdrop-blur-sm bounce-animation">
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Email Verified!</h2>
              <p className="text-gray-300 mb-4">{message}</p>
              <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">Redirecting to dashboard...</span>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-4 border-red-500/50 backdrop-blur-sm">
                  <XCircle className="h-10 w-10 text-red-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Verification Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              
              {email && (
                <div className="space-y-4">
                  <button
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" />
                        <span>Resend Verification Email</span>
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-400">
                    Sent to: <span className="text-cyan-400">{email}</span>
                  </p>
                </div>
              )}

              <Link 
                to="/login"
                className="mt-6 inline-block text-gray-300 hover:text-cyan-400 transition-colors duration-300"
              >
                 Return to Login
              </Link>
            </div>
          )}
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
