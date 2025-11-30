import React, { useState } from 'react';
import { Sparkles, MessageCircle, Crown } from 'lucide-react';
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
 * Prompts Free users to upgrade
 */
export const ErrorAnalysisEnhanced: React.FC<ErrorAnalysisEnhancedProps> = ({
  errorMessage,
  onClose,
}) => {
  const [showChat, setShowChat] = useState(false);
  const currentTier = useCurrentTier();
  const navigate = useNavigate();

  const getButtonClasses = () => {
    const base = 'w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base flex-shrink-0';
    if (currentTier === 'free') {
      return `${base} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg`;
    }
    return `${base} bg-blue-600 hover:bg-blue-700 text-white`;
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
              {currentTier !== 'free' && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                  {currentTier.toUpperCase()}
                </span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 line-clamp-1 sm:line-clamp-none">
              {currentTier === 'free'
                ? 'Upgrade to Pro for Universal AI Assistant - ask anything!'
                : 'Ask any question - errors, tutorials, facts, or latest news'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (currentTier === 'free') {
              navigate('/pricing');
            } else {
              setShowChat(!showChat);
            }
          }}
          className={getButtonClasses()}
        >
          {currentTier === 'free' ? (
            <>
              <Crown className="w-4 h-4" />
              <span>Try Pro</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4" />
              <span>{showChat ? 'Close' : 'Chat'}</span>
            </>
          )}
        </button>
      </div>

      {/* Conversational Chat - Tier-gated */}
      {showChat && currentTier !== 'free' && (
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
