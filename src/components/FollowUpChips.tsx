import React from 'react';
import { MessageCircle, Sparkles, Lock } from 'lucide-react';

interface FollowUpChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
  isLoading?: boolean;
  followUpsRemaining: number;
  maxFollowUps: number;
  canFollowUp: boolean;
  onUpgrade?: () => void;
}

const FollowUpChips: React.FC<FollowUpChipsProps> = ({
  chips,
  onChipClick,
  isLoading = false,
  followUpsRemaining,
  maxFollowUps,
  canFollowUp,
  onUpgrade,
}) => {
  if (chips.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Continue the conversation</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <MessageCircle className="h-3 w-3 text-gray-400" />
          <span className={`${followUpsRemaining > 0 ? 'text-green-400' : 'text-orange-400'}`}>
            {followUpsRemaining}/{maxFollowUps} follow-ups left
          </span>
        </div>
      </div>

      {/* Chips */}
      {canFollowUp ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <button
              key={index}
              onClick={() => onChipClick(chip)}
              disabled={isLoading || !canFollowUp}
              className={`
                px-3 py-2 text-sm rounded-full transition-all duration-200
                ${isLoading
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 border border-blue-500/30 hover:border-blue-500/50'
                }
              `}
            >
              {chip}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <Lock className="h-4 w-4 text-orange-400" />
          <div className="flex-1">
            <p className="text-sm text-orange-300">You&apos;ve used all follow-ups for this conversation</p>
            <p className="text-xs text-gray-400 mt-1">Upgrade to Pro for more follow-ups per conversation</p>
          </div>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Upgrade
            </button>
          )}
        </div>
      )}

      {/* Custom input hint */}
      {canFollowUp && (
        <p className="text-xs text-gray-500 mt-3">
          Or type your own question in the input below
        </p>
      )}
    </div>
  );
};

export default FollowUpChips;
