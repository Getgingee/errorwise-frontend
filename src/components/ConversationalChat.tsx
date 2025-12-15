import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Globe, Trash2, MessageCircle, X } from 'lucide-react';
import {
  askConversational,
  generateConversationId,
  clearConversation,
  ConversationMessage,
  WebSource,
} from '../services/conversationalAI';

/**
 * Represents a suggested follow-up chip that can be clicked
 */
export interface ConversationalChip {
  type: 'follow_up' | 'close_conversation';
  message: string;
  text?: string; // Alternative display text
}

interface ConversationalChatProps {
  initialQuery?: string;
  onClose?: () => void;
  className?: string;
}

const ConversationalChat: React.FC<ConversationalChatProps> = ({
  initialQuery,
  onClose,
  className = '',
}) => {
  const [conversationId] = useState(generateConversationId());
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedChips, setSuggestedChips] = useState<ConversationalChip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (query?: string) => {
    const messageText = query || inputValue.trim();
    if (!messageText || isLoading) return;

    setError(null);
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const userMessage: ConversationMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await askConversational(messageText, conversationId);

      // Add assistant message
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        webSources: response.webSources,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Handle suggested chips - backend now sends structured chip objects
      // Fallback to converting string suggestions if needed for backward compatibility
      if (response.suggestedChips && Array.isArray(response.suggestedChips)) {
        setSuggestedChips(response.suggestedChips);
      } else if (response.followUpQuestions && Array.isArray(response.followUpQuestions)) {
        // Backward compatibility: convert string array to chip objects
        setSuggestedChips(
          response.followUpQuestions.map((q: string) => ({
            type: 'follow_up' as const,
            message: q,
          }))
        );
      } else {
        setSuggestedChips([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chip: ConversationalChip) => {
    if (chip.type === 'follow_up') {
      // For follow-up chips, send the message
      handleSendMessage(chip.message);
      setSuggestedChips([]);
    } else if (chip.type === 'close_conversation') {
      // For close conversation chips, close the chat or show completion message
      setSuggestedChips([]);
      if (onClose) {
        setTimeout(() => onClose(), 500);
      }
    }
  };

  const handleClearConversation = async () => {
    try {
      await clearConversation(conversationId);
      setMessages([]);
      setSuggestedChips([]);
      setError(null);
    } catch (err: any) {
      setError('Failed to clear conversation');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Ask me anything about errors</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearConversation}
            title="Clear conversation"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close chat"
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
              Start a conversation
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-xs">
              Ask me about error messages, troubleshooting, or anything related to technology issues
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>

              {/* Web Sources */}
              {message.webSources && message.webSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                  <p className="text-xs font-medium opacity-70">Sources:</p>
                  {message.webSources.map((source: WebSource, i: number) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity group"
                    >
                      <Globe className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2 group-hover:underline">{source.title}</span>
                    </a>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        {/* Suggested Chips / Follow-up Actions */}
        {suggestedChips.length > 0 && !isLoading && (
          <div className="space-y-2 mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {suggestedChips.some((c) => c.type === 'close_conversation')
                ? 'You can:'
                : 'You might want to tell me:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedChips.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => handleChipClick(chip)}
                  className={`text-sm px-3 py-2 rounded-lg transition-all font-medium border ${
                    chip.type === 'close_conversation'
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {chip.text || chip.message}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything - errors, tutorials, facts, news..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationalChat;
