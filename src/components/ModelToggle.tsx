import React, { useState, useEffect } from 'react';
import { Zap, Brain, Sparkles, Wand2, Lock, Crown, ChevronDown } from 'lucide-react';
import { getAvailableModels, selectModel, ModelInfo } from '../services/chatService';
import { toast } from 'react-hot-toast';

interface ModelToggleProps {
  onModelChange?: (model: string) => void;
  compact?: boolean;
  className?: string;
}

const modelIcons: Record<string, React.ReactNode> = {
  'haiku': <Zap className="h-4 w-4" />,
  'sonnet': <Brain className="h-4 w-4" />,
  'opus': <Sparkles className="h-4 w-4" />,
  'auto': <Wand2 className="h-4 w-4" />,
};

const modelColors: Record<string, string> = {
  'haiku': 'from-green-500 to-emerald-500',
  'sonnet': 'from-blue-500 to-cyan-500',
  'opus': 'from-purple-500 to-pink-500',
  'auto': 'from-amber-500 to-orange-500',
};

const ModelToggle: React.FC<ModelToggleProps> = ({
  onModelChange,
  compact = false,
  className = '',
}) => {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('haiku');
  const [autoModeEnabled, setAutoModeEnabled] = useState(false);
  const [autoModeAvailable, setAutoModeAvailable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await getAvailableModels();
      if (data && data.models) {
        setModels(data.models);
        setCurrentModel(data.currentModel || 'haiku');
        setAutoModeEnabled(data.autoModeEnabled || false);
        setAutoModeAvailable(data.autoModeAvailable || false);
      } else {
        // Fallback to default model if API returns empty
        setModels([{ id: 'haiku', name: 'Fast', description: 'Quick responses', available: true }]);
        setCurrentModel('haiku');
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      // Set default fallback model so UI doesn't break
      setModels([{ id: 'haiku', name: 'Fast', description: 'Quick responses', available: true }]);
      setCurrentModel('haiku');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModel = async (modelId: string) => {
    try {
      const result = await selectModel(modelId);
      setCurrentModel(result.model);
      setAutoModeEnabled(modelId === 'auto');
      onModelChange?.(result.model);
      toast.success(`Switched to ${modelId === 'auto' ? 'Auto' : models.find(m => m.id === modelId)?.name || modelId} mode`);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getCurrentModelInfo = () => {
    if (autoModeEnabled) {
      return { id: 'auto', name: 'Auto', description: 'AI picks the best model' };
    }
    return models.find(m => m.id === currentModel) || { id: currentModel, name: 'Fast', description: '' };
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-white/10 rounded-lg h-10 w-32 ${className}`} />
    );
  }

  // Only show if user has more than one option
  if (models.filter(m => m.available).length <= 1 && !autoModeAvailable) {
    return null;
  }

  const currentInfo = getCurrentModelInfo();
  const currentColor = modelColors[currentInfo.id] || modelColors['haiku'];

  if (compact) {
    // Compact pill toggle for inline use
    return (
      <div className={`inline-flex items-center gap-1 p-1 bg-white/5 rounded-lg ${className}`}>
        {autoModeAvailable && (
          <button
            onClick={() => handleSelectModel('auto')}
            className={`px-2 py-1 text-xs rounded-md transition-all ${
              autoModeEnabled
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title="Auto - AI picks best model"
          >
            <Wand2 className="h-3 w-3" />
          </button>
        )}
        {models.filter(m => m.available).map((model) => (
          <button
            key={model.id}
            onClick={() => handleSelectModel(model.id)}
            className={`px-2 py-1 text-xs rounded-md transition-all ${
              currentModel === model.id && !autoModeEnabled
                ? `bg-gradient-to-r ${modelColors[model.id]} text-white`
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={`${model.name} - ${model.description}`}
          >
            {modelIcons[model.id]}
          </button>
        ))}
      </div>
    );
  }

  // Full dropdown for settings/nav
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${currentColor} rounded-lg text-white text-sm font-medium hover:opacity-90 transition-all`}
      >
        {autoModeEnabled ? modelIcons['auto'] : modelIcons[currentModel]}
        <span>{currentInfo.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 py-1 mb-1">Select AI Model</p>

              {/* Auto option */}
              {autoModeAvailable && (
                <button
                  onClick={() => handleSelectModel('auto')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    autoModeEnabled
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${modelColors['auto']}`}>
                    <Wand2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">Auto</span>
                      <Crown className="h-3 w-3 text-amber-400" />
                    </div>
                    <span className="text-xs text-gray-400">AI picks the best model</span>
                  </div>
                  {autoModeEnabled && (
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  )}
                </button>
              )}

              {/* Model options */}
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => model.available && handleSelectModel(model.id)}
                  disabled={!model.available}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    currentModel === model.id && !autoModeEnabled
                      ? `bg-gradient-to-r ${modelColors[model.id]}/20 border border-${model.id === 'haiku' ? 'green' : model.id === 'sonnet' ? 'blue' : 'purple'}-500/30`
                      : model.available
                      ? 'hover:bg-white/5'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${modelColors[model.id]}`}>
                    {modelIcons[model.id]}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{model.name}</span>
                      {!model.available && <Lock className="h-3 w-3 text-gray-500" />}
                      {model.recommended && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-300 rounded">Recommended</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{model.description}</span>
                  </div>
                  {currentModel === model.id && !autoModeEnabled && (
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 bg-white/5 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                {autoModeAvailable
                  ? 'Auto mode analyzes your error and picks the optimal model'
                  : 'Upgrade to Pro for Auto mode and more models'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelToggle;
