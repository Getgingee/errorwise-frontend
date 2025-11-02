import { X, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
  requiredTier?: 'pro' | 'team';
  feature?: string;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  reason, 
  requiredTier = 'pro',
  feature 
}: UpgradeModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    navigate('/pricing');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/10 backdrop-blur-md border border-white/10/20 p-2 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Upgrade Required</h2>
            </div>
            <p className="text-blue-100">
              {feature || 'This feature'} is only available in the{' '}
              <span className="font-semibold">{requiredTier.toUpperCase()}</span> plan
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {reason && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">{reason}</p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">
                Unlock with {requiredTier === 'pro' ? 'Pro' : 'Team'} Plan:
              </h3>
              <ul className="space-y-2">
                {requiredTier === 'pro' ? (
                  <>
                    <BenefitItem text="Unlimited error queries" />
                    <BenefitItem text="AI-powered fix suggestions" />
                    <BenefitItem text="Code examples & best practices" />
                    <BenefitItem text="GPT-3.5 Turbo AI model" />
                    <BenefitItem text="30-day error history" />
                    <BenefitItem text="Priority email support" />
                  </>
                ) : (
                  <>
                    <BenefitItem text="Everything in Pro, plus..." />
                    <BenefitItem text="Team collaboration features" />
                    <BenefitItem text="Shared error history" />
                    <BenefitItem text="Team dashboard" />
                    <BenefitItem text="GPT-4 AI model" />
                    <BenefitItem text="Priority support" />
                  </>
                )}
              </ul>
            </div>

            <div className="pt-4">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                View Pricing Plans
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Zap className="w-3 h-3 text-green-600" />
      </div>
      <span className="text-sm text-gray-700">{text}</span>
    </li>
  );
}