// Success Feedback Widget (F2)
// "Did this help?" Yes / No / Partial with sharing bonus

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Twitter, Linkedin, Copy, Check, Gift } from 'lucide-react';
import apiClient from '../services/api';
import { toast } from 'react-hot-toast';

interface SuccessFeedbackProps {
  queryId?: string;
  errorMessage?: string;
  errorType?: string;
  onFeedbackSubmit?: (feedback: string) => void;
  className?: string;
}

const SuccessFeedback: React.FC<SuccessFeedbackProps> = ({
  queryId,
  errorMessage,
  errorType,
  onFeedbackSubmit,
  className = ''
}) => {
  const [feedback, setFeedback] = useState<'yes' | 'no' | 'partial' | null>(null);
  const [reason, setReason] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [bonusEarned, setBonusEarned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (type: 'yes' | 'no' | 'partial') => {
    setFeedback(type);

    if (type === 'no' || type === 'partial') {
      setShowReason(true);
    } else {
      await submitFeedback(type);
    }
  };

  const submitFeedback = async (type: string, reasonText?: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/feedback', {
        queryId,
        feedback: type,
        reason: reasonText || reason,
        wouldShare: type === 'yes'
      });

      setSubmitted(true);
      onFeedbackSubmit?.(type);

      const data = (response as any).data || response;

      if (data.bonusOffered && type === 'yes') {
        setShowShareOptions(true);
      }

      toast.success(data.message || 'Thanks for your feedback!');
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (method: 'twitter' | 'linkedin' | 'copy') => {
    try {
      const shareResponse = await apiClient.get(`/feedback/share-content?queryId=${queryId}&errorType=${errorType || 'code'}`);
      const shareData = (shareResponse as any).data || shareResponse;
      const content = shareData.shareContent?.[method];

      if (method === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}&url=${encodeURIComponent(content.url)}`, '_blank');
      } else if (method === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}`, '_blank');
      } else if (method === 'copy') {
        await navigator.clipboard.writeText(content.text);
        toast.success('Copied to clipboard!');
      }

      const bonusResponse = await apiClient.post('/feedback/claim-bonus', {
        queryId,
        shareMethod: method
      });

      const bonusData = (bonusResponse as any).data || bonusResponse;

      if (bonusData.success) {
        setBonusEarned(true);
        toast.success(bonusData.message || '+10 free queries earned!');
      }
    } catch (error: any) {
      if (error.details?.alreadyClaimed) {
        toast('Bonus already claimed for this query', { icon: 'ℹ️' });
      } else if (error.details?.dailyLimitReached) {
        toast('Daily share bonus limit reached', { icon: '⚠️' });
      } else {
        console.error('Share error:', error);
      }
    }
  };

  // Already submitted
  if (submitted && !showShareOptions) {
    return (
      <div className={`flex items-center gap-2 text-green-400 p-3 ${className}`}>
        <Check className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">Thanks for your feedback!</span>
      </div>
    );
  }

  // Show share options for bonus
  if (showShareOptions) {
    return (
      <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="text-white font-medium text-sm sm:text-base">
            {bonusEarned ? 'Bonus earned!' : 'Share & get +10 free queries!'}
          </span>
        </div>

        {!bonusEarned && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2 px-3 py-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors text-xs sm:text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
          </div>
        )}

        {bonusEarned && (
          <p className="text-green-300 text-sm">+10 queries added to your account!</p>
        )}
      </div>
    );
  }

  // Show reason input
  if (showReason) {
    return (
      <div className={`space-y-3 p-3 ${className}`}>
        <p className="text-gray-400 text-sm">
          {feedback === 'no' ? "Sorry it didn't help. What went wrong?" : 'What could be improved?'}
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional: Tell us more..."
          className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:border-blue-500"
          rows={2}
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => submitFeedback(feedback!, reason)}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={() => {
              setShowReason(false);
              setFeedback(null);
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 text-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Default: show feedback buttons - RESPONSIVE
  const getButtonClasses = (type: 'yes' | 'partial' | 'no') => {
    const baseClasses = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs sm:text-sm';
    
    if (feedback === type) {
      if (type === 'yes') return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/50`;
      if (type === 'partial') return `${baseClasses} bg-amber-500/20 text-amber-400 border border-amber-500/50`;
      if (type === 'no') return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/50`;
    }
    
    const hoverColor = type === 'yes' ? 'hover:text-green-400' : type === 'partial' ? 'hover:text-amber-400' : 'hover:text-red-400';
    return `${baseClasses} bg-slate-800 hover:bg-slate-700 text-gray-400 ${hoverColor}`;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 ${className}`}>
      <span className="text-gray-400 text-sm">Did this help?</span>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFeedback('yes')}
          disabled={loading}
          className={getButtonClasses('yes')}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Yes</span>
        </button>

        <button
          onClick={() => handleFeedback('partial')}
          disabled={loading}
          className={getButtonClasses('partial')}
        >
          <Minus className="w-4 h-4" />
          <span>Partially</span>
        </button>

        <button
          onClick={() => handleFeedback('no')}
          disabled={loading}
          className={getButtonClasses('no')}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>No</span>
        </button>
      </div>
    </div>
  );
};

export default SuccessFeedback;
