import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { getConfidenceColor, getConfidenceLevel } from '../types';

interface LowConfidenceBadgeProps {
  confidence: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LowConfidenceBadge: React.FC<LowConfidenceBadgeProps> = ({
  confidence,
  showTooltip = true,
  size = 'md'
}) => {
  const level = getConfidenceLevel(confidence);
  const color = getConfidenceColor(confidence);
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const colorClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
    orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
    red: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
  };

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  // Only show badge for low confidence (< 0.6)
  if (confidence >= 0.6) {
    return null;
  }

  return (
    <div className="relative group inline-flex items-center">
      <span 
        className={`
          inline-flex items-center gap-1 rounded-full border font-medium
          ${sizeClasses[size]}
          ${colorClasses[color]}
        `}
      >
        <AlertTriangle size={iconSize} />
        Low Confidence
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg whitespace-nowrap">
            <p>Confidence: {Math.round(confidence * 100)}%</p>
            <p className="mt-1 text-gray-300">
              This answer may need verification.
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LowConfidenceBadge;
