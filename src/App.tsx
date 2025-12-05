import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Eagerly loaded - critical path
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Lazy loaded - split into separate chunks
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const AccountSettings = lazy(() => import('./pages/AccountSettings').then(m => ({ default: m.AccountSettings })));
const MockPaymentPage = lazy(() => import('./pages/MockPaymentPage'));
const TeamVideoChat = lazy(() => import('./pages/team/TeamVideoChat'));
const TeamDashboard = lazy(() => import('./pages/team/TeamDashboard'));
const TeamAnalyses = lazy(() => import('./pages/team/TeamAnalyses'));
const TeamMeetingHub = lazy(() => import('./pages/team/TeamMeetingHub'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const PricingPage = lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Landing Page - Eagerly loaded */}
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

            {/* Error Library - Public (browse solutions without login) */}
            <Route path="/library" element={<LibraryPage />} />

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

            {/* Team Routes */}
            <Route path="/teams" element={
              <ProtectedRoute>
                <TeamDashboard />
              </ProtectedRoute>
            } />

            <Route path="/team/analyses" element={
              <ProtectedRoute>
                <TeamAnalyses />
              </ProtectedRoute>
            } />

            <Route path="/team/:teamId/meetings" element={
              <ProtectedRoute>
                <TeamMeetingHub />
              </ProtectedRoute>
            } />
            <Route path="/team/:teamId/video/:sessionId" element={
              <ProtectedRoute>
                <TeamVideoChat />
              </ProtectedRoute>
            } />

            {/* Legal Pages - Public */}
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Catch all - redirect to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

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



