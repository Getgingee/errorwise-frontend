// Smart Upgrade Banner Component (E1)
// Non-intrusive upgrade prompts triggered by user behavior

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';

interface SmartUpgradeData {
  shouldShow: boolean;
  promptType: string | null;
  promptMessage: string | null;
  triggers: string[];
  cta: {
    text: string;
    url: string;
  };
}

interface SmartUpgradeBannerProps {
  context?: 'after_query' | 'high_confidence' | 'follow_up';
  onDismiss?: () => void;
  className?: string;
}

const SmartUpgradeBanner: React.FC<SmartUpgradeBannerProps> = ({
  context,
  onDismiss,
  className = ''
}) => {
  const [data, setData] = useState<SmartUpgradeData | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSmartUpgrade();
  }, [context]);

  const checkSmartUpgrade = async () => {
    try {
      const url = context ? `/smart-upgrade/check?context=${context}` : '/smart-upgrade/check';
      const response = await apiClient.get<SmartUpgradeData>(url);
      
      if ((response as any).shouldShow || (response as any).data?.shouldShow) {
        const responseData = (response as any).data || response;
        setData(responseData);
        setVisible(true);
        // Track shown
        await apiClient.post('/smart-upgrade/shown', {
          promptType: responseData.promptType,
          triggers: responseData.triggers,
          page: window.location.pathname
        });
      }
    } catch (error) {
      console.error('Smart upgrade check failed:', error);
    }
  };

  const handleClick = async () => {
    try {
      await apiClient.post('/smart-upgrade/clicked', {
        promptType: data?.promptType,
        triggers: data?.triggers,
        page: window.location.pathname
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
    navigate('/subscription');
  };

  const handleDismiss = async () => {
    try {
      await apiClient.post('/smart-upgrade/dismissed', {
        promptType: data?.promptType,
        reason: 'user_closed'
      });
    } catch (error) {
      console.error('Failed to track dismiss:', error);
    }
    setDismissed(true);
    setVisible(false);
    onDismiss?.();
  };

  if (!visible || dismissed || !data) return null;

  // Different styles based on prompt type
  const getPromptStyle = () => {
    switch (data.promptType) {
      case 'milestone':
        return {
          bg: 'from-green-500/20 to-emerald-500/20',
          border: 'border-green-500/30',
          icon: <Sparkles className="w-5 h-5 text-green-400" />,
          iconBg: 'bg-green-500/20'
        };
      case 'high_confidence':
        return {
          bg: 'from-purple-500/20 to-indigo-500/20',
          border: 'border-purple-500/30',
          icon: <Crown className="w-5 h-5 text-purple-400" />,
          iconBg: 'bg-purple-500/20'
        };
      case 'follow_up':
        return {
          bg: 'from-amber-500/20 to-orange-500/20',
          border: 'border-amber-500/30',
          icon: <Zap className="w-5 h-5 text-amber-400" />,
          iconBg: 'bg-amber-500/20'
        };
      default:
        return {
          bg: 'from-blue-500/20 to-cyan-500/20',
          border: 'border-blue-500/30',
          icon: <Sparkles className="w-5 h-5 text-blue-400" />,
          iconBg: 'bg-blue-500/20'
        };
    }
  };

  const style = getPromptStyle();

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${style.bg} border ${style.border} p-4 ${className}`}>
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>

      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${style.iconBg}`}>
          {style.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium">
            {data.promptMessage}
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
        >
          {data.cta.text}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SmartUpgradeBanner;
