import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import ErrorAnalysisCard from '../components/ErrorAnalysisCard';
import ErrorAnalysisEnhanced from '../components/ErrorAnalysisEnhanced';
import HistorySidebar from '../components/HistorySidebar';
import FollowUpChips from '../components/FollowUpChips';
import ModelToggle from '../components/ModelToggle';
import TrialBanner from '../components/TrialBanner';
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
  History,
  CheckCircle,
  Globe,
  Lock,
  Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { subscriptionService, SubscriptionData } from '../services/subscription';
import { sendFollowUp, ConversationInfo, FollowUpResponse } from '../services/chatService';
import SmartUpgradeBanner from '../components/subscription/SmartUpgradeBanner';
import SuccessFeedback from '../components/SuccessFeedback';

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
  conversation?: ConversationInfo;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  chips?: string[];
}

const DashboardPage: React.FC = () => {
  // Load subscription data
  async function loadSubscription() {
      try {
        setSubscriptionLoading(true);
        const res = await subscriptionService.getSubscription();
        if (res && (res as any).user) {
          setSubscription(res as any as SubscriptionData);
        } else if (res && (res as any).success && (res as any).data) {
          setSubscription((res as any).data as SubscriptionData);
        } else {
          setSubscription(null);
          console.warn('No subscription data returned', res);
        }
    } catch (error) {
      console.error('Failed to load subscription:', error);
      setSubscription(null);
    } finally {
      setSubscriptionLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    const sessionId = params.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled');
    }

    if (paymentStatus) {
      window.history.replaceState({}, '', '/dashboard');
    }

    loadSubscription();
  }, []);

  async function verifyPayment(sessionId: string) {
    try {
      toast.loading('Verifying payment...');
      await subscriptionService.verifyPayment(sessionId);
      toast.dismiss();
      toast.success('Subscription activated! ');
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
  const [isFocused, setIsFocused] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showRecentAnalyses, setShowRecentAnalyses] = useState(true);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recentAnalysesRef = useRef<HTMLDivElement>(null);
  
  // New conversation state
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([]);
  const [suggestedChips, setSuggestedChips] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [followUpsRemaining, setFollowUpsRemaining] = useState(3);
  const [maxFollowUps, setMaxFollowUps] = useState(3);
  const [canFollowUp, setCanFollowUp] = useState(true);
  const [isFollowingUp, setIsFollowingUp] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('auto');

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/subscription', '/profile', '/settings'];
    const authRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

    const handleNavigation = (direction: 'back' | 'forward') => {
      if (direction === 'back') {
        window.history.back();
        setTimeout(() => {
          const newPath = window.location.pathname;
          if (authRoutes.includes(newPath)) {
            window.history.forward();
          }
        }, 100);
      } else {
        window.history.forward();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigation('back');
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigation('forward');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.errors.history}?limit=5`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data.history || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent solutions:', error);
    }
  };

  const handleNewChat = () => {
    setConversationMessages([]);
    setSuggestedChips([]);
    setConversationId(null);
    setFollowUpsRemaining(maxFollowUps);
    setCanFollowUp(true);
    setAnalysis(null);
    setErrorInput('');
    toast.success('New conversation started!');
  };

  const scrollToRecentAnalyses = () => {
    if (showRecentAnalyses) {
      setShowRecentAnalyses(false);
      setSelectedRecentAnalysis(null);
    } else {
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
          model: selectedModel,
          conversationHistory: conversationMessages.slice(-5).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to find solution');
      }

      const data = await response.json();
      
      // Handle new conversation data from backend
      const newAnalysis: ErrorAnalysis = {
        id: data.id || Date.now().toString(),
        errorMessage: errorInput,
        explanation: data.explanation || '',
        solution: data.solution || '',
        codeExample: data.codeExample,
        confidence: data.confidence || 85,
        category: data.category || 'General',
        createdAt: new Date().toISOString(),
        conversation: data.conversation
      };

      setAnalysis(newAnalysis);
      
      // Set conversation state from response
      if (data.conversation) {
        setConversationId(data.conversation.id);
        setSuggestedChips(data.conversation.suggestedQuestions || []);
        setFollowUpsRemaining(data.conversation.followUpsRemaining);
        setMaxFollowUps(data.conversation.maxFollowUps);
        setCanFollowUp(data.conversation.canFollowUp);
      }
      
      // Add to conversation history
      setConversationMessages(prev => [
        ...prev,
        { role: 'user', content: errorInput },
        { role: 'assistant', content: `${data.explanation}\n\n${data.solution}`, chips: data.conversation?.suggestedQuestions }
      ]);

      toast.success('Solution found!');
      fetchRecentAnalyses();
    } catch (error: any) {
      console.error('Solution error:', error);
      toast.error(error.message || 'Failed to find solution');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFollowUp = async (message: string) => {
    if (!conversationId || !canFollowUp || isFollowingUp) return;
    
    setIsFollowingUp(true);
    setErrorInput('');
    
    // Add user message immediately
    setConversationMessages(prev => [...prev, { role: 'user', content: message }]);
    
    try {
      const response = await sendFollowUp(conversationId, message);
      
      // Add assistant response
      setConversationMessages(prev => [
        ...prev,
        { role: 'assistant', content: response.response, chips: response.suggestedChips }
      ]);
      
      // Update chips and limits
      setSuggestedChips(response.suggestedChips || []);
      setFollowUpsRemaining(response.conversation.followUpsRemaining);
      setCanFollowUp(response.conversation.canContinue);
      
      toast.success('Follow-up answered!');
    } catch (error: any) {
      toast.error(error.message);
      // Remove the user message if follow-up failed
      setConversationMessages(prev => prev.slice(0, -1));
    } finally {
      setIsFollowingUp(false);
    }
  };

  const handleChipClick = (chip: string) => {
    handleFollowUp(chip);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (analysis && conversationId && canFollowUp) {
        handleFollowUp(errorInput);
      } else {
        handleAnalyze();
      }
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
    reader.onerror = () => toast.error('Failed to read file');
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedSection(null), 2000);
    }).catch(() => toast.error('Failed to copy'));
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

  // Quick example errors for non-technical users
  const quickExamples = [
    { label: ' Payment Failed', text: 'Payment declined. Error code: 1001. Your transaction could not be completed.' },
    { label: ' Page Not Found', text: 'This site cannot be reached. ERR_CONNECTION_TIMED_OUT. Check your internet connection.' },
    { label: ' App Crash', text: 'Instagram keeps crashing on my iPhone whenever I try to upload a photo.' },
    { label: ' Login Issue', text: '403 Forbidden - You don\'t have permission to access this page.' },
    { label: ' Streaming Error', text: 'Netflix error NW-2-5. We\'re having trouble playing this title right now.' },
    { label: ' Gaming Problem', text: 'Steam Error: Content file locked. Unable to update game files.' },
  ];

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
          setAnalysis({
            id: error.id,
            errorMessage: error.errorMessage,
            explanation: error.explanation || 'Loading...',
            solution: error.solution || '',
            codeExample: error.codeExample,
            sources: error.sources,
            confidence: error.confidence,
            category: error.category,
            createdAt: error.createdAt,
          });
          setShowHistorySidebar(false);
        }}
      />

      {/* Smart Upgrade Banner - E1: Contextual upgrade prompts */}
      <SmartUpgradeBanner context="dashboard" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .result-card { animation: fadeIn 0.3s ease-out; }
          .input-wrapper:focus-within { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
          textarea::-webkit-scrollbar { width: 6px; }
          textarea::-webkit-scrollbar-track { background: transparent; }
          textarea::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.3); border-radius: 3px; }
          textarea::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.5); }
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
          .error-input-textarea { min-height: 100px; max-height: 300px; }
          .confidence-bar { transition: width 0.5s ease; }
        `}</style>

        <div className="flex flex-col min-h-screen pb-8 px-4 pt-20">
          {/* Trial Banner - Show for free users */}
          <div className="max-w-4xl mx-auto w-full mb-4">
            <TrialBanner onTrialStarted={() => loadSubscription()} />
          </div>

          {/* Welcome Message - Only show when no analysis */}
          {!analysis && (
            <div className="max-w-3xl mx-auto mb-auto text-center fade-in mt-10">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Welcome back, {user?.username || 'there'}!
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Paste any error message from any app, website, or software to get instant solutions in plain English
              </p>

              {/* Trust Badges - Updated for universal appeal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                <div className="glass-card rounded-lg p-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-300">Works with any error</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <MessageSquare className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-300">Plain English</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <Lock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-300">No tech knowledge needed</div>
                </div>
                <div className="glass-card rounded-lg p-3">
                  <Shield className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
                  <div className="text-xs text-gray-300">Private & Secure</div>
                </div>
              </div>

              {/* Recent Problems Solved - Updated header */}
              {recentAnalyses.length > 0 && showRecentAnalyses && (
                <div ref={recentAnalysesRef} className="mt-16 max-w-[95vw] mx-auto mb-16 px-4 sm:px-6 lg:px-8">
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      Recent Problems Solved
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Your error history and solutions
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
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
                            {selectedRecentAnalysis?.id === recent.id && (
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                            )}
                            <div className="relative flex flex-col gap-3">
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
                              <p className="text-sm text-gray-200 font-medium leading-relaxed line-clamp-2">
                                {recent.errorMessage}
                              </p>
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

                    <div>
                      {selectedRecentAnalysis ? (
                        <ErrorAnalysisCard
                          queryId={selectedRecentAnalysis.id}
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
                              Select Any Previous Error
                            </h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                              Click on any item from your history to see the full explanation and step-by-step solution
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

          {/* Analysis Results */}
          {analysis && (
            <div className="max-w-4xl mx-auto w-full mb-6 result-card">
              <ErrorAnalysisCard
                queryId={analysis.id}
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
              
              {/* Follow-up Conversation Messages */}
              {conversationMessages.length > 2 && (
                <div className="mt-4 space-y-3">
                  {conversationMessages.slice(2).map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-blue-500/20 border border-blue-500/30 ml-8'
                          : 'bg-white/5 border border-white/10 mr-8'
                      }`}
                    >
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Follow-up Loading */}
              {isFollowingUp && (
                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 mr-8">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              
              {/* Follow-up Chips */}
              {suggestedChips.length > 0 && (
                <FollowUpChips
                  chips={suggestedChips}
                  onChipClick={handleChipClick}
                  isLoading={isFollowingUp}
                  followUpsRemaining={followUpsRemaining}
                  maxFollowUps={maxFollowUps}
                  canFollowUp={canFollowUp}
                  onUpgrade={() => navigate('/pricing')}
                />
              )}
              
              <div className="mt-6">
                <ErrorAnalysisEnhanced errorMessage={analysis.errorMessage} />
              </div>

              {/* Success Feedback - F2: Was this helpful? */}
              <SuccessFeedback
                queryId={analysis.id}
                errorMessage={analysis.errorMessage}
              />
            </div>
          )}

          {/* Input Card */}
          <div className="max-w-4xl mx-auto w-full mt-auto">
            <div className="glass-card rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="relative">
                <textarea
                  value={errorInput}
                  onChange={(e) => setErrorInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={analysis && canFollowUp 
                    ? 'Ask a follow-up question...' 
                    : 'Paste any error message here...\nExamples: "Payment declined", "Page not found", "App keeps crashing"'}
                  className="w-full px-6 py-5 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-base leading-relaxed error-input-textarea"
                  maxLength={5000}
                />
                {errorInput.length > 0 && (
                  <div className="absolute bottom-2 right-6 text-xs text-gray-500">
                    {errorInput.length}/5000
                  </div>
                )}
              </div>

              {/* Quick Examples Section - Only show when no analysis */}
              {!errorInput && !analysis && (
                <div className="px-6 py-3 border-t border-white/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Not sure what to paste? Try:</span>
                    {quickExamples.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setErrorInput(example.text)}
                        className="px-3 py-1.5 text-xs bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40 text-blue-300 rounded-full transition-all duration-200"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="px-3 sm:px-6 py-3 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-2 flex-wrap">`n                  {/* Model Toggle - For Pro/Team users */}
                  <ModelToggle 
                    compact={true} 
                    onModelChange={setSelectedModel}
                  />
                  
                  {conversationMessages.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg text-xs text-blue-300">
                      <MessageSquare className="h-3 w-3" />
                      <span>{Math.floor(conversationMessages.length / 2)} turn{conversationMessages.length > 2 ? 's' : ''}</span>
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
                  {conversationMessages.length > 0 && (
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
                  onClick={() => {
                    if (analysis && conversationId && canFollowUp && errorInput.trim()) {
                      handleFollowUp(errorInput);
                    } else {
                      handleAnalyze();
                    }
                  }}
                  disabled={(isAnalyzing || isFollowingUp) || errorInput.length < 10}
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing || isFollowingUp ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{isFollowingUp ? 'Sending...' : 'Finding Solution...'}</span>
                    </>
                  ) : analysis && canFollowUp ? (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </>
                  ) : (
                    <>
                      <span>Find Solution</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-xs">Enter</kbd> to {analysis && canFollowUp ? 'send' : 'find solution'},
                <kbd className="ml-1 px-2 py-0.5 bg-white/10 rounded text-gray-400 font-mono text-xs">Shift + Enter</kbd> for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;


