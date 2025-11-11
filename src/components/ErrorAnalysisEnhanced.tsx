import React, { useState } from 'react';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import ConversationalChat from './ConversationalChat';
import { TierGate, useCurrentTier } from './TierGate';

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

  return (
    <div className="space-y-4">
      {/* Conversational AI Button - Always visible but tier-gated */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              AI-Powered Conversational Analysis
              {currentTier !== 'free' && (
                <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                  {currentTier.toUpperCase()}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentTier === 'free' 
                ? 'Upgrade to Pro for Universal AI Assistant - ask anything!' 
                : 'Ask any question - errors, tutorials, facts, or latest news'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowChat(!showChat)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            currentTier === 'free'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{showChat ? 'Close Chat' : currentTier === 'free' ? 'Try Pro' : 'Start Chat'}</span>
        </button>
      </div>

      {/* Conversational Chat - Tier-gated */}
      {showChat && (
        <TierGate requiredTier="pro">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="h-[600px]">
              <ConversationalChat
                initialQuery={errorMessage}
                onClose={() => setShowChat(false)}
              />
            </div>
          </div>
        </TierGate>
      )}

      {/* Feature highlights for Free users */}
      {currentTier === 'free' && showChat && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border-2 border-dashed border-blue-300 dark:border-blue-700">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Unlock Pro Features
              </h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 hover:bg-white/50 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Conversational AI</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chat naturally with AI that remembers context and asks clarifying questions
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Web Scraping</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatically finds solutions from Stack Overflow, Reddit, and forums
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Multi-Language</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get help in your preferred language with Indian context awareness
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Unlimited Queries</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No limits on error analysis, code examples, or fix suggestions
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="/subscription"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Upgrade to Pro - Only $3/month</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalysisEnhanced;
