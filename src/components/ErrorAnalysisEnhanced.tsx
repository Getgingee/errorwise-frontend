import React, { useState } from 'react';
import { Sparkles, MessageCircle, Crown, Lock, ArrowRight, Zap } from 'lucide-react';
import ConversationalChat from './ConversationalChat';
import { TierGate, useCurrentTier } from './TierGate';
import { useNavigate } from 'react-router-dom';

interface ErrorAnalysisEnhancedProps {
  errorMessage?: string;
  onClose?: () => void;
}

/**
 * Enhanced Error Analysis with Conversational AI
 * Shows conversational AI chat for Pro/Team users
 * Prompts Free users to upgrade with clickable redirect to pricing
 */
export const ErrorAnalysisEnhanced: React.FC<ErrorAnalysisEnhancedProps> = ({
  errorMessage,
  onClose,
}) => {
  const [showChat, setShowChat] = useState(false);
  const currentTier = useCurrentTier();
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate('/pricing?trial=pro');
  };

  // For free users - show a prominent upgrade prompt that's fully clickable
  if (currentTier === 'free') {
    return (
      <div className="space-y-4">
        <div 
          onClick={handleUpgradeClick}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 sm:p-5 border border-purple-500/30 cursor-pointer hover:from-purple-500/20 hover:to-blue-500/20 hover:border-purple-500/50 transition-all group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleUpgradeClick()}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <div className="absolute -top-1 -right-1 p-1 bg-amber-500 rounded-full">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                <span>AI-Powered Conversational Assistant</span>
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                  PRO
                </span>
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Ask anything - errors, tutorials, tech facts, or get real-time answers
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">Universal AI</span>
                <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">Unlimited Queries</span>
                <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded-full">Follow-ups</span>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpgradeClick();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 group-hover:scale-105"
          >
            <Crown className="w-5 h-5" />
            <span>Upgrade to Pro</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // For Pro/Team users - show the chat functionality
  const getButtonClasses = () => {
    return 'w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white';
  };

  return (
    <div className="space-y-4">
      {/* Conversational AI Button - Responsive design */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2 flex-wrap">
              AI-Powered Conversational Analysis
              <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                {currentTier.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 sm:line-clamp-none">
              Ask any question - errors, tutorials, facts, or latest news
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowChat(!showChat)}
          className={getButtonClasses()}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{showChat ? 'Close Chat' : 'Start Chat'}</span>
        </button>
      </div>

      {/* Conversational Chat - Already tier-gated */}
      {showChat && (
        <TierGate requiredTier="pro">
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
            <div className="h-[400px] sm:h-[500px] lg:h-[600px]">
              <ConversationalChat
                initialQuery={errorMessage}
                onClose={() => setShowChat(false)}
              />
            </div>
          </div>
        </TierGate>
      )}
    </div>
  );
};

export default ErrorAnalysisEnhanced;
