import { Lock } from 'lucide-react';
import { useState } from 'react';
import { UpgradeModal } from './UpgradeModal';

interface FeatureLockProps {
  feature: string;
  requiredTier: 'pro' | 'team';
  children?: React.ReactNode;
  className?: string;
}

export function FeatureLock({ 
  feature, 
  requiredTier, 
  children,
  className = '' 
}: FeatureLockProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        className={`relative ${className}`}
        onClick={() => setShowModal(true)}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center cursor-pointer hover:bg-gray-900/60 transition-colors">
          <div className="bg-white rounded-lg p-4 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">{feature}</p>
            <p className="text-sm text-gray-600 mb-3">
              Requires {requiredTier.toUpperCase()} plan
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Unlock Now →
            </button>
          </div>
        </div>

        {/* Content (blurred) */}
        <div className="pointer-events-none opacity-50">
          {children}
        </div>
      </div>

      <UpgradeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        feature={feature}
        requiredTier={requiredTier}
      />
    </>
  );
}

// Usage example:
// <FeatureLock feature="Fix Suggestions" requiredTier="pro">
//   <FixSuggestionsPanel />
// </FeatureLock>