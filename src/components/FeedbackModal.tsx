import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  source?: 'demo_limit' | 'general';
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, source = 'general' }) => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const maxFeedbackLength = 500;
  const remainingChars = maxFeedbackLength - feedback.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !feedback) {
      setError('Please fill in all fields');
      return;
    }

    if (feedback.length < 10) {
      setError('Feedback must be at least 10 characters');
      return;
    }

    if (feedback.length > maxFeedbackLength) {
      setError(`Feedback must be ${maxFeedbackLength} characters or less`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/support/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message: feedback,
          feedback_type: source === 'demo_limit' ? 'demo_feedback' : 'general_feedback',
          subject: source === 'demo_limit' ? 'Demo Limit Feedback' : 'General Feedback',
          source: source
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        // Reset form after 2 seconds and close
        setTimeout(() => {
          setEmail('');
          setFeedback('');
          setIsSubmitted(false);
          onClose();
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setEmail('');
      setFeedback('');
      setError('');
      setIsSubmitted(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-lg"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {source === 'demo_limit' ? '💬 Share Your Feedback' : '📝 We Value Your Feedback'}
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            {source === 'demo_limit' 
              ? 'Tell us about your demo experience and what features you\'d like to see!'
              : 'Help us improve ErrorWise by sharing your thoughts and suggestions.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle size={64} className="mx-auto text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Thank You!</h3>
              <p className="text-gray-300">
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Feedback Textarea */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-300">
                    Your Feedback <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-xs ${remainingChars < 50 ? 'text-orange-400' : 'text-gray-400'}`}>
                    {remainingChars} characters left
                  </span>
                </div>
                <textarea
                  id="feedback-message"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value.slice(0, maxFeedbackLength))}
                  placeholder="Tell us what you think... (10-500 characters)"
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  minLength={10}
                  maxLength={maxFeedbackLength}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !email || !feedback || feedback.length < 10}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Submit Feedback
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Your feedback helps us improve ErrorWise for everyone. Thank you! 🙏
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
