import React from 'react';
import { RefreshCw, Info } from 'lucide-react';

interface FallbackInfoBadgeProps {
  fallbackUsed: boolean;
  primaryModel?: string;
  retryCount?: number;
  showDetails?: boolean;
}

export const FallbackInfoBadge: React.FC<FallbackInfoBadgeProps> = ({
  fallbackUsed,
  primaryModel,
  retryCount = 0,
  showDetails = false
}) => {
  if (!fallbackUsed) {
    return null;
  }

  return (
    <div className="relative group inline-flex items-center">
      <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 rounded-full">
        <RefreshCw className="w-3 h-3" />
        Fallback Used
      </span>
      
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <Info className="w-3 h-3" />
              <span className="font-medium">Analysis Info</span>
            </div>
            {primaryModel && (
              <p className="text-gray-300">Primary: {primaryModel}</p>
            )}
            {retryCount > 0 && (
              <p className="text-gray-300">Retries: {retryCount}</p>
            )}
            <p className="text-gray-400 mt-1 text-[10px]">
              A backup model was used to complete your analysis
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FallbackInfoBadge;
