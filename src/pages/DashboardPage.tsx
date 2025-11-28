import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import ErrorAnalysisCard from '../components/ErrorAnalysisCard';
import ErrorAnalysisEnhanced from '../components/ErrorAnalysisEnhanced';
import HistorySidebar from '../components/HistorySidebar';
import {
  Upload,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  FileText,
  Lightbulb,
  Code,
  Shield,
  Clock,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  Share2,
  Download,
  History
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { subscriptionService, SubscriptionData } from '../services/subscription';
// import { EdgePanelSubscription } from '../components/subscription/EdgePanelSubscription'; // Future feature - not yet deployed

interface ErrorAnalysis {
  id: string;
  errorMessage: string;
  explanation: string;
  solution: string;
  codeExample?: string;
  sources?: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  confidence: number;
  category: string;
  createdAt: string;
}

interface ConversationMessage {
  query: string;
  explanation: string;
  solution: string;
  category: string;
}

const DashboardPage: React.FC = () => {
  // Load subscription data
  async function loadSubscription() {
      try {
        setSubscriptionLoading(true);
        const res = await subscriptionService.getSubscription();
        // Backend returns data directly, not wrapped in success/data
        if (res && (res as any).user) {
          // Backend response has user, subscription, plan, usage fields directly
          setSubscription(res as any as SubscriptionData);
        } else if (res && (res as any).success && (res as any).data) {
          // Fallback for wrapped response
          setSubscription((res as any).data as SubscriptionData);
        } else {
          // No subscription - set null to show default free tier
          setSubscription(null);
          console.warn('No subscription data returned', res);
        }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      // On error, set null so UI doesn't crash
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }

  // Handle payment verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
    }

    // Clean up URL
    if (paymentStatus) {
      window.history.replaceState({}, '', '/dashboard');
    }

    // Load subscription on mount
    loadSubscription();
  }, []);

  async function verifyPayment(sessionId: string) {
    try {
      toast.loading('Verifying payment...');
      await subscriptionService.verifyPayment(sessionId);
      toast.dismiss();
      toast.success('Subscription activated! ≡ƒÄë');
      await loadSubscription();
    } catch (error) {
      toast.dismiss();
      toast.error('Payment verification failed');
      console.error('Payment verification error:', error);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      await subscriptionService.cancelSubscription();
      toast.success('Subscription cancelled');
      await loadSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
      console.error('Cancel subscription error:', error);
    }
  }

  async function handleUpgrade() {
    navigate('/pricing');
  }

  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [errorInput, setErrorInput] = useState('');
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ErrorAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<ErrorAnalysis[]>([]);
  const [selectedRecentAnalysis, setSelectedRecentAnalysis] = useState<ErrorAnalysis | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showRecentAnalyses, setShowRecentAnalyses] = useState(true);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recentAnalysesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  // Handle browser back/forward gestures and keyboard shortcuts
  useEffect(() => {
    // Protected routes that should be accessible
    const protectedRoutes = ['/dashboard', '/subscription', '/profile', '/settings'];
    
    // Auth routes that should be blocked from navigation
    const authRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

    const canNavigateBack = () => {
      // Check if there's history to go back to
      if (window.history.length <= 1) return false;
      
      // Get the previous URL from browser history (not directly accessible, so we'll track it)
      // For now, we'll just prevent going back if we're on a protected route
      const currentPath = window.location.pathname;
      return protectedRoutes.includes(currentPath);
    };

    const handleNavigation = (direction: 'back' | 'forward') => {
      if (direction === 'back') {
        // Check if navigation is safe
        if (canNavigateBack()) {
          // Save current route before navigating
          const currentPath = window.location.pathname;
          
          // Navigate back
          window.history.back();
          
          // After a small delay, check if we ended up on an auth page
          setTimeout(() => {
            const newPath = window.location.pathname;
            if (authRoutes.includes(newPath)) {
              // If we're on an auth page, go forward to return to dashboard
              window.history.forward();
            }
          }, 100);
        }
      } else {
        // Forward navigation is always allowed
        window.history.forward();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Left Arrow = Go Back (with restrictions)
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigation('back');
      }
      // Alt + Right Arrow = Go Forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigation('forward');
      }
    };

    const handleMouseButton = (e: MouseEvent) => {
      // Mouse button 3 (back button) = Go Back (with restrictions)
      if (e.button === 3) {
        e.preventDefault();
        handleNavigation('back');
      }
      // Mouse button 4 (forward button) = Go Forward
      if (e.button === 4) {
        e.preventDefault();
        handleNavigation('forward');
      }
    };

    // Touch gesture variables
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipeGesture();
    };

    const handleSwipeGesture = () => {
      const swipeThreshold = 50; // Minimum distance for a swipe
      const maxVerticalDistance = 100; // Maximum vertical movement allowed
      
      const horizontalDistance = touchEndX - touchStartX;
      const verticalDistance = Math.abs(touchEndY - touchStartY);
      
      // Check if it's a horizontal swipe (not vertical scroll)
      if (verticalDistance < maxVerticalDistance) {
        // Swipe Right = Go Back
        if (horizontalDistance > swipeThreshold) {
          handleNavigation('back');
        }
        // Swipe Left = Go Forward
        else if (horizontalDistance < -swipeThreshold) {
          handleNavigation('forward');
        }
      }
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mouseup', handleMouseButton);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mouseup', handleMouseButton);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.errors.history}?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent analyses:', error);
    }
  };

  const handleNewChat = () => {
    setConversationHistory([]);
    setAnalysis(null);
    setErrorInput('');
    toast.success('New conversation started!');
  };

  const handleBackNavigation = () => {
    const authRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
    const currentPath = window.location.pathname;
    
    // Only allow back navigation if we're on a protected route
    if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/subscription') || 
        currentPath.startsWith('/profile') || currentPath.startsWith('/settings')) {
      
      window.history.back();
      
      // Check after navigation to prevent landing on auth pages
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (authRoutes.includes(newPath)) {
          window.history.forward();
          toast('Cannot navigate back to login pages', { icon: 'Γä╣∩╕Å' });
        }
      }, 100);
    }
  };

  const handleForwardNavigation = () => {
    window.history.forward();
  };

  const scrollToRecentAnalyses = () => {
    if (showRecentAnalyses) {
      // If already showing, hide it
      setShowRecentAnalyses(false);
      setSelectedRecentAnalysis(null);
    } else {
      // If hidden, show it and scroll to it
      setShowRecentAnalyses(true);
      setTimeout(() => {
        recentAnalysesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleAnalyze = async () => {
    if (!errorInput.trim() || errorInput.length < 10) {
      toast.error('Please enter at least 10 characters');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch(API_ENDPOINTS.errors.analyze, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          errorMessage: errorInput,
          conversationHistory: conversationHistory.slice(-5) // Send last 5 messages for context
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      const newAnalysis: ErrorAnalysis = {
        id: data.id || Date.now().toString(),
        errorMessage: errorInput,
        explanation: data.explanation || '',
        solution: data.solution || '',
        codeExample: data.codeExample,
        confidence: data.confidence || 85,
        category: data.category || 'General',
        createdAt: new Date().toISOString()
      };
      
      setAnalysis(newAnalysis);
      
      // Add to conversation history for context retention
      setConversationHistory(prev => [
        ...prev,
        {
          query: errorInput,
          explanation: data.explanation || '',
          solution: data.solution || '',
          category: data.category || 'General'
        }
      ]);

      toast.success('Analysis complete!');
      fetchRecentAnalyses();
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setErrorInput(content);
      toast.success('File loaded successfully');
    };
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedSection(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      <Navigation 
        showRecentAnalyses={recentAnalyses.length > 0} 
        onRecentAnalysesClick={scrollToRecentAnalyses}
        onHistoryClick={() => setShowHistorySidebar(true)}
      />

      <HistorySidebar
        isOpen={showHistorySidebar}
        onClose={() => setShowHistorySidebar(false)}
        onSelectError={(error) => {
          // When user selects an error from history, display it
          setAnalysis({
            id: error.id,
            errorMessage: error.errorMessage,
            explanation: '',
            solution: '',
            confidence: error.confidence,
            category: error.category,
            createdAt: error.createdAt,
          });
          setShowHistorySidebar(false);
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
        {/* Subscription Section - Temporarily hidden for deployment */}
        {/* {!subscriptionLoading && subscription && (
          <EdgePanelSubscription
            subscription={subscription}
            onCancel={handleCancelSubscription}
            onUpgrade={handleUpgrade}
          />
        )} */}
        <style>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .result-card {
            animation: fadeIn 0.3s ease-out;
          }

          .input-wrapper:focus-within {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          textarea::-webkit-scrollbar {
            width: 6px;
          }

          textarea::-webkit-scrollbar-track {
            background: transparent;
          }

          textarea::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.3);
            border-radius: 3px;
          }

          textarea::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5);
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .glass-card:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(99, 102, 241, 0.3);
          }

          .error-input-textarea {
            min-height: 100px;
            max-height: 300px;
          }

          .confidence-bar {
            transition: width 0.5s ease;
          }
        `}</style>

        {/* Main Content Container */}
        <div className="flex flex-col min-h-screen pb-8 px-4 pt-20">
          {/* Welcome Message - Only show when no analysis */}
          {!analysis && (
            <div className="max-w-3xl mx-auto mb-auto text-center fade-in mt-20">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome back, {user?.username || 'Developer'}!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Paste your error message or code below to get instant AI-powered solutions
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="glass-card rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400">
                    <Sparkles className="h-6 w-6 inline" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">AI Powered</div>
                </div>
                <div className="glass-card rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    <Shield className="h-6 w-6 inline" />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Secure</div>
                </div>
              </div>

              {/* Recent Analyses - Enhanced Spacious Layout */}
              {recentAnalyses.length > 0 && showRecentAnalyses && (
                <div ref={recentAnalysesRef} className="mt-16 max-w-[95vw] mx-auto mb-16 px-4 sm:px-6 lg:px-8">
                  {/* Section Header */}
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      Recent Analyses
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Your recent error analyses and solutions
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
                    {/* Left: Recent Analyses List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                          History ({recentAnalyses.length})
                        </h3>
                      </div>
                      
                      <div className="space-y-3">
                        {recentAnalyses.map((recent) => (
                          <button
                            key={recent.id}
                            onClick={() => setSelectedRecentAnalysis(recent)}
                            className={`group relative overflow-hidden rounded-xl p-5 w-full text-left transition-all duration-300 hover:scale-[1.02] ${
                              selectedRecentAnalysis?.id === recent.id
                                ? 'bg-gradient-to-br from-blue-900/40 via-blue-800/30 to-cyan-900/40 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                            }`}
                          >
                            {/* Gradient overlay for selected state */}
                            {selectedRecentAnalysis?.id === recent.id && (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                            )}
                            
                            <div className="relative flex flex-col gap-3">
                              {/* Header with category and time */}
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-lg text-cyan-300 font-medium backdrop-blur-sm">
                                  {recent.category}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatTimeAgo(recent.createdAt)}
                                  </span>
                                  <div className="flex items-center gap-1 text-xs font-semibold">
                                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                                    <span className="text-white">{recent.confidence}%</span>
                                  </div>
                                </div>
                              </div>

                              {/* Error message preview */}
                              <p className="text-sm text-gray-200 font-medium leading-relaxed line-clamp-2">
                                {recent.errorMessage}
                              </p>

                              {/* Hover indicator */}
                              <div className={`mt-1 h-0.5 rounded-full transition-all duration-300 ${
                                selectedRecentAnalysis?.id === recent.id
                                  ? 'w-full bg-gradient-to-r from-blue-400 to-cyan-400'
                                  : 'w-0 bg-cyan-400 group-hover:w-full'
                              }`} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Selected Analysis Details */}
                    <div>
                      {selectedRecentAnalysis ? (
                        <ErrorAnalysisCard
                          explanation={selectedRecentAnalysis.explanation}
                          solution={selectedRecentAnalysis.solution}
                          category={selectedRecentAnalysis.category}
                          confidence={selectedRecentAnalysis.confidence}
                          codeExample={selectedRecentAnalysis.codeExample}
                          sources={selectedRecentAnalysis.sources}
                          errorMessage={selectedRecentAnalysis.errorMessage}
                          createdAt={selectedRecentAnalysis.createdAt}
                          onCopy={copyToClipboard}
                          copiedSection={copiedSection}
                          showActions={true}
                          showTimestamp={true}
                        />
                      ) : (
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                          <div className="relative p-16 text-center">
                            <div className="mb-6 inline-flex p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl">
                              <FileText className="h-16 w-16 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                              Select an Analysis
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                              Click on any recent analysis from the list to see the full explanation, solution, and code examples
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis Results - Shows above input when available */}
          {analysis && (
            <div className="max-w-4xl mx-auto w-full mb-6 result-card">
              <ErrorAnalysisCard
                explanation={analysis.explanation}
                solution={analysis.solution}
                category={analysis.category}
                confidence={analysis.confidence}
                codeExample={analysis.codeExample}
                sources={analysis.sources}
                errorMessage={analysis.errorMessage}
                createdAt={analysis.createdAt}
                onCopy={copyToClipboard}
                copiedSection={copiedSection}
                showActions={true}
                showTimestamp={true}
              />
              
              {/* Conversational AI - New Feature */}
              <div className="mt-6">
                <ErrorAnalysisEnhanced errorMessage={analysis.errorMessage} />
              </div>
            </div>
          )}

          {/* Input Card -- Always at bottom */}
          <div className="max-w-4xl mx-auto w-full mt-auto">
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="relative">
                <textarea
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Paste your error message, stack trace, or describe your coding issue..."
                  className="w-full px-6 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-base leading-relaxed error-input-textarea"
                  maxLength={5000}
                />
                  
                  {/* Character Count */}
                  {errorInput.length > 0 && (
                    <div className="absolute bottom-2 right-6 text-xs text-gray-500">
                      {errorInput.length}/5000
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Conversation Context Indicator */}
                    {conversationHistory.length > 0 && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
                        <MessageSquare className="h-3 w-3" />
                        <span>{conversationHistory.length} message{conversationHistory.length !== 1 ? 's' : ''} in context</span>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".txt,.log,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json"
                      className="hidden"
                      aria-label="Upload error log file"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Upload file"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="hidden sm:inline">Upload</span>
                    </button>
                    <button
                      onClick={() => setErrorInput('')}
                      disabled={!errorInput}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Clear input"
                    >
                      <FileText className="h-4 w-4" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                    {conversationHistory.length > 0 && (
                      <button
                        onClick={handleNewChat}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-lg transition-colors"
                        title="Start new conversation"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span className="hidden sm:inline">New Chat</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || errorInput.length < 10}
                    className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-xs">Enter</kbd> to analyze, 
                <kbd className="ml-1 px-2 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-xs">Shift + Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

export default DashboardPage;
    







