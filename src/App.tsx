import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  LandingPage,
  SubscriptionPage,
  ProfilePage
} from './pages';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { VerifyEmail } from './pages/VerifyEmail';
import { AccountSettings } from './pages/AccountSettings';
import MockPaymentPage from './pages/MockPaymentPage';
import TeamVideoChat from './pages/team/TeamVideoChat';
import TeamDashboard from './pages/team/TeamDashboard';
import TeamAnalyses from './pages/team/TeamAnalyses';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { PricingPage } from './pages/PricingPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { checkAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  // Check authentication status and initialize theme on app load
  useEffect(() => {
    checkAuth();
    initializeTheme();
  }, [checkAuth, initializeTheme]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Email Verification Routes - Public */}
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Mock Payment Route - Public (for development) */}
          <Route path="/subscription/mock-payment" element={<MockPaymentPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            {/* Error Analysis redirects to Dashboard (same functionality) */}
            <Route path="/error-analysis" element={<Navigate to="/dashboard" replace />} />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          } />

          <Route path="/pricing" element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          } />

          {/* Team Dashboard Route */}
          <Route path="/teams" element={
            <ProtectedRoute>
              <TeamDashboard />
            </ProtectedRoute>
          } />

          {/* Team Analyses Route */}
          <Route path="/team/analyses" element={
            <ProtectedRoute>
              <TeamAnalyses />
            </ProtectedRoute>
          } />

          {/* Team Video Chat Route */}
          <Route path="/team/:teamId/video/:sessionId" element={
            <ProtectedRoute>
              <TeamVideoChat />
            </ProtectedRoute>
          } />

          {/* Legal Pages - Public */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;



