import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Lightbulb, X } from 'lucide-react';
import { ConfidenceWarning } from '../types';

interface ConfidenceWarningBannerProps {
  warning: ConfidenceWarning;
  onDismiss?: () => void;
  collapsible?: boolean;
}

export const ConfidenceWarningBanner: React.FC<ConfidenceWarningBannerProps> = ({
  warning,
  onDismiss,
  collapsible = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !warning.isLowConfidence) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const confidencePercent = Math.round(warning.confidenceScore * 100);

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-800/50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">
              Low Confidence Response ({confidencePercent}%)
            </h4>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {warning.warningMessage}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-amber-200/50 dark:hover:bg-amber-800/50 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              )}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-amber-200/50 dark:hover:bg-amber-800/50 rounded transition-colors"
            >
              <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-3 pl-8">
          {/* Suggestions */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>To improve results:</span>
            </div>
            <ul className="space-y-1">
              {warning.suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2"
                >
                  <span className="text-amber-400 dark:text-amber-500 mt-0.5"></span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="mt-3 text-xs text-amber-500 dark:text-amber-500 italic">
            {warning.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfidenceWarningBanner;
