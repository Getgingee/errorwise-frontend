import React from 'react';
import { X, Zap, Shield, Code, TrendingUp, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeaturesModal: React.FC<FeaturesModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onClose();
    navigate('/register');
  };

  if (!isOpen) return null;

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models analyze your errors instantly, providing accurate solutions and explanations.',
      details: ['Multi-model AI approach', 'Context-aware analysis', '95%+ accuracy rate']
    },
    {
      icon: Code,
      title: 'Multi-Language Support',
      description: 'Support for all major programming languages including JavaScript, Python, Java, C++, and more.',
      details: ['20+ languages supported', 'Framework-specific insights', 'Stack trace parsing']
    },
    {
      icon: Shield,
      title: 'Security First',
      description: 'Your code and errors are analyzed securely with end-to-end encryption and never stored permanently.',
      details: ['End-to-end encryption', 'No permanent storage', 'GDPR compliant']
    },
    {
      icon: TrendingUp,
      title: 'Learning Analytics',
      description: 'Track your error patterns over time and learn from common mistakes with detailed analytics.',
      details: ['Error pattern detection', 'Progress tracking', 'Custom insights']
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      description: 'Get solutions in seconds with our optimized AI pipeline and distributed infrastructure.',
      details: ['< 2 second response time', 'Global CDN', '99.9% uptime SLA']
    },
    {
      icon: Globe,
      title: 'Team Collaboration',
      description: 'Share error solutions with your team, build a knowledge base, and collaborate effectively.',
      details: ['Team workspaces', 'Shared knowledge base', 'Role-based access']
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Features</h2>
            <p className="text-blue-100 mt-1">Everything you need for error-free development</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close features modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-lg">
                    <feature.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {feature.description}
                    </p>
                    <ul className="space-y-1">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl text-center border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ready to get started?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Join thousands of developers using ErrorWise to debug faster
            </p>
            <button
              onClick={handleGetStarted}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Try Free Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesModal;
