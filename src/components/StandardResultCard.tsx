import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, ExternalLink, Lock, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useTierAccess } from './TierGate';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { submitResultFeedback } from '../services/feedbackService';
import { useAuthStore } from '../store/authStore';

declare const gtag: (...args: any[]) => void;

interface StandardResultCardProps {
  queryId?: string;
  category: string;
  confidence: number;
  explanation: string;
  fixSteps: string[];
  learnMoreUrl?: string;
  learnMoreTitle?: string;
  onFeedbackChange?: (type: 'up' | 'down') => void;
  initialFeedback?: 'up' | 'down' | null;
}

/**
 * B2: Consistent, Structured Result Card
 * 
 * Standard layout:
 * - Category + confidence pill (header)
 * - 1-2 sentence explanation
 * - Fix steps (Pro only, blurred for free)
 * - "Learn more" doc link (Pro only)
 * - Feedback controls: thumbs up/down
 */
export const StandardResultCard: React.FC<StandardResultCardProps> = ({
  queryId,
  category,
  confidence,
  explanation,
  fixSteps,
  learnMoreUrl,
  learnMoreTitle,
  onFeedbackChange,
  initialFeedback,
}) => {
  const isPro = useTierAccess('pro');
  const { token } = useAuthStore();
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<'up' | 'down' | null>(initialFeedback || null);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  // Determine confidence color
  const getConfidenceColor = () => {
    if (confidence >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (confidence >= 60) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (confidence >= 40) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (localFeedback === type || feedbackLoading) return;
    
    setFeedbackLoading(true);
    setLocalFeedback(type);
    
    // Track with gtag
    if (typeof gtag !== 'undefined') {
      gtag('event', 'result_feedback', {
        event_category: 'engagement',
        event_label: type === 'up' ? 'helpful' : 'not_helpful',
        query_id: queryId,
        category: category,
      });
    }
    
    // Submit feedback to backend
    if (queryId && token) {
      try {
        await submitResultFeedback(queryId, { type }, token);
        toast.success(type === 'up' ? 'Thanks for your feedback!' : "Sorry to hear that. We'll improve!");
        onFeedbackChange?.(type);
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        toast.error('Failed to save feedback');
        setLocalFeedback(initialFeedback || null);
      }
    } else {
      toast.success(type === 'up' ? 'Thanks for your feedback!' : "Sorry to hear that. We'll improve!");
      onFeedbackChange?.(type);
    }
    
    setFeedbackLoading(false);
  };

  const copyStep = async (step: string, index: number) => {
    await navigator.clipboard.writeText(step);
    setCopiedStep(index);
    setTimeout(() => setCopiedStep(null), 2000);
    toast.success('Step copied!');
  };

  // For free users, show only first step, blur the rest
  const visibleSteps = isPro ? (showAllSteps ? fixSteps : fixSteps.slice(0, 3)) : fixSteps.slice(0, 1);
  const hiddenSteps = isPro ? [] : fixSteps.slice(1);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="relative p-6 space-y-5">
        {/* Header: Category + Confidence Pill + Feedback */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {/* Category Pill */}
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold rounded-lg">
              {category}
            </span>
            {/* Confidence Pill */}
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${getConfidenceColor()}`}>
              {confidence}% confidence
            </span>
          </div>
          
          {/* Feedback Controls */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 mr-1">Was this helpful?</span>
            <button
              onClick={() => handleFeedback('up')}
              disabled={feedbackLoading}
              className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                localFeedback === 'up'
                  ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-green-500/20 hover:text-green-400 border border-white/10'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              disabled={feedbackLoading}
              className={`p-2 rounded-lg transition-all duration-200 disabled:opacity-50 ${
                localFeedback === 'down'
                  ? 'bg-red-500/30 text-red-400 border border-red-500/50'
                  : 'bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 border border-white/10'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Explanation (1-2 sentences) */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">What's happening</h4>
          <p className="text-white text-base leading-relaxed">{explanation}</p>
        </div>

        {/* Fix Steps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">How to fix it</h4>
            {!isPro && fixSteps.length > 1 && (
              <span className="flex items-center gap-1 text-xs text-blue-400">
                <Lock className="w-3 h-3" />
                {fixSteps.length - 1} more step{fixSteps.length > 2 ? 's' : ''} (Pro)
              </span>
            )}
          </div>
          
          {/* Visible Steps */}
          <div className="space-y-2">
            {visibleSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 group hover:border-green-500/30 transition-all"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <p className="flex-1 text-gray-300 text-sm leading-relaxed">{step}</p>
                <button
                  onClick={() => copyStep(step, index)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all"
                  title="Copy step"
                >
                  {copiedStep === index ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Blurred/Locked Steps for Free Users */}
          {!isPro && hiddenSteps.length > 0 && (
            <div className="relative">
              <div className="space-y-2 filter blur-sm pointer-events-none select-none">
                {hiddenSteps.slice(0, 2).map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-sm font-semibold">
                      {visibleSteps.length + index + 1}
                    </span>
                    <p className="flex-1 text-gray-300 text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              {/* Upgrade Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-xl backdrop-blur-[2px]">
                <Link
                  to="/subscription"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg"
                >
                  <Lock className="w-4 h-4" />
                  Unlock all steps - Upgrade to Pro
                </Link>
              </div>
            </div>
          )}

          {/* Show More/Less for Pro users with many steps */}
          {isPro && fixSteps.length > 3 && (
            <button
              onClick={() => setShowAllSteps(!showAllSteps)}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showAllSteps ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show all {fixSteps.length} steps
                </>
              )}
            </button>
          )}
        </div>

        {/* Learn More Link (Pro Only) */}
        {learnMoreUrl && (
          <div className="pt-3 border-t border-white/10">
            {isPro ? (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                {learnMoreTitle || 'Learn more in documentation'}
              </a>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Documentation links available for Pro users</span>
                <Link to="/subscription" className="text-blue-400 hover:text-blue-300 underline">
                  Upgrade
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardResultCard;
