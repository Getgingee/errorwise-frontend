import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Globe, Trash2, MessageCircle } from 'lucide-react';
import {
  askConversational,
  generateConversationId,
  clearConversation,
  ConversationMessage,
  WebSource,
} from '../services/conversationalAI';

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
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
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
        followUpQuestions: response.followUpQuestions,
        webSources: response.webSources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setFollowUpQuestions(response.followUpQuestions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    handleSendMessage(question);
    setFollowUpQuestions([]);
  };

  const handleClearConversation = async () => {
    try {
      await clearConversation(conversationId);
      setMessages([]);
      setFollowUpQuestions([]);
      setError(null);
    } catch (err: any) {
      setError('Failed to clear conversation');
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">AI Assistant</h3>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearConversation}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">Ask me anything about your error!</p>
            <p className="text-sm mt-2">I can help explain, find solutions, and guide you through fixes.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Web Sources */}
              {message.webSources && message.webSources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-1 text-xs font-medium mb-2">
                    <Globe className="w-3 h-3" />
                    <span>Sources:</span>
                  </div>
                  <div className="space-y-2">
                    {message.webSources.slice(0, 3).map((source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs p-2 bg-white/50 dark:bg-gray-700/50 rounded hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors"
                      >
                        <div className="font-medium text-blue-600 dark:text-blue-400 truncate">
                          {source.title}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                          {source.snippet}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Follow-up questions */}
        {followUpQuestions.length > 0 && !isLoading && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              You might want to tell me:
            </p>
            <div className="flex flex-wrap gap-2">
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  className="text-sm px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
                >
                  {question}
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
