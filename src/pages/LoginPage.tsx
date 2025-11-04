import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
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
          <h2 className="mt-6 text-3xl font-bold text-white dark:text-white">Welcome back</h2>
          <p className="mt-2 text-gray-300 dark:text-gray-300">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl p-8">
          <LoginForm />
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors duration-300">
          ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
