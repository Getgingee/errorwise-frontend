import React from 'react';
import { Copy, Check, Lightbulb, Code, Share2, Download, Clock, ExternalLink, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ExportButton } from './ProFeatures';
import { LowConfidenceBadge } from './LowConfidenceBadge';
import { ConfidenceWarningBanner } from './ConfidenceWarningBanner';
import { ConfidenceWarning } from '../types';

interface Source {
  title: string;
  url: string;
  description: string;
}

interface ErrorAnalysisCardProps {
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  codeExample?: string;
  sources?: Source[];
  errorMessage?: string;
  createdAt?: string;
  onCopy?: (text: string, section: string) => void;
  copiedSection?: string | null;
  showActions?: boolean;
  showTimestamp?: boolean;
  // A3: New confidence props
  isLowConfidence?: boolean;
  confidenceScore?: number;
  confidenceWarning?: ConfidenceWarning;
}

export const ErrorAnalysisCard: React.FC<ErrorAnalysisCardProps> = ({
  explanation,
  solution,
  category,
  confidence,
  codeExample,
  sources = [],
  errorMessage,
  createdAt,
  onCopy,
  copiedSection,
  showActions = false,
  showTimestamp = false,
  // A3: New props with defaults
  isLowConfidence = false,
  confidenceScore,
  confidenceWarning
}) => {
  // A3: Normalize confidence to 0-1 range for display
  const normalizedConfidence = confidenceScore ?? (confidence > 1 ? confidence / 100 : confidence);
  const displayConfidence = confidence > 1 ? confidence : Math.round(confidence * 100);
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleShare = () => {
    const text = `${errorMessage ? `Error: ${errorMessage}\n\n` : ''}Explanation: ${explanation}\n\nSolution: ${solution}${codeExample ? `\n\nCode Example:\n${codeExample}` : ''}`;
    navigator.clipboard.writeText(text);
    toast.success('Analysis copied to clipboard!');
  };

  const handleDownload = () => {
    const text = `ErrorWise Analysis Report
Generated: ${new Date().toLocaleString()}
Category: ${category}
Confidence: ${displayConfidence}%

${errorMessage ? `ERROR MESSAGE:\n${errorMessage}\n\n` : ''}EXPLANATION:\n${explanation}

SOLUTION:\n${solution}${codeExample ? `\n\nCODE EXAMPLE:\n${codeExample}` : ''}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errorwise-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Analysis downloaded!');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/95 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative p-6 sm:p-8 space-y-6">

        {/* A3: Low Confidence Warning Banner */}
        {confidenceWarning && confidenceWarning.isLowConfidence && (
          <ConfidenceWarningBanner warning={confidenceWarning} />
        )}

        {/* Header with Category Badge and Confidence */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">AI Analysis</h3>
              <p className="text-xs text-gray-400">Powered by ErrorWise AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* A3: Low Confidence Badge */}
            {(isLowConfidence || normalizedConfidence < 0.6) && (
              <LowConfidenceBadge confidence={normalizedConfidence} size="sm" />
            )}
            {showTimestamp && createdAt && (
              <span className="text-xs text-gray-400 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Clock className="h-3.5 w-3.5" />
                {formatTimeAgo(createdAt)}
              </span>
            )}
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold rounded-lg backdrop-blur-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/20 rounded-lg">
              <Lightbulb className="w-4 h-4 text-blue-400" />
            </div>
            <h4 className="text-base font-semibold text-white">What's Happening</h4>
          </div>
          <div className="pl-8 pr-4">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{explanation}</p>
          </div>
        </div>

        {/* Solution Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/20 rounded-lg">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <h4 className="text-base font-semibold text-white">How to Fix It</h4>
            </div>
            {onCopy && (
              <button
                onClick={() => onCopy(solution, 'solution')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                title="Copy solution"
              >
                {copiedSection === 'solution' ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400 group-hover:text-white" />
                )}
              </button>
            )}
          </div>
          <div className="pl-8 pr-4">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">{solution}</p>
          </div>
        </div>

        {/* Code Example */}
        {codeExample && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Code className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-base font-semibold text-white">Code Example</h4>
              </div>
              {onCopy && (
                <button
                  onClick={() => onCopy(codeExample, 'code')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                  title="Copy code"
                >
                  {copiedSection === 'code' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              )}
            </div>
            <div className="pl-8 pr-4">
              <pre className="bg-gray-950/80 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm font-mono shadow-inner">
                <code className="text-gray-100">{codeExample}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Sources/References Section */}
        {sources && sources.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg">
                <BookOpen className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-base font-semibold text-white">References & Resources</h4>
            </div>
            <div className="pl-8 pr-4 space-y-3">
              {sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors truncate">
                        {source.title}
                      </h5>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {source.description}
                      </p>
                      <p className="text-xs text-cyan-400/70 mt-1.5 truncate">
                        {source.url}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Meter - A3: Enhanced with color coding */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <span className="text-xs text-gray-400 font-medium">Confidence:</span>
          <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-lg ${
                normalizedConfidence >= 0.8 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400' 
                  : normalizedConfidence >= 0.6 
                    ? 'bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400'
                    : normalizedConfidence >= 0.4
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                      : 'bg-gradient-to-r from-red-500 to-orange-400'
              }`}
              style={{ width: `${displayConfidence}%` }}
            />
          </div>
          <span className={`text-sm font-semibold min-w-[48px] text-right ${
            normalizedConfidence >= 0.8 
              ? 'text-green-400' 
              : normalizedConfidence >= 0.6 
                ? 'text-white'
                : normalizedConfidence >= 0.4
                  ? 'text-yellow-400'
                  : 'text-red-400'
          }`}>
            {displayConfidence}%
          </span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-2 pt-4 border-t border-white/10 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50 hover:text-white transition-all duration-200 shadow-sm hover:shadow-blue-500/20"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400/50 hover:text-white transition-all duration-200 shadow-sm hover:shadow-cyan-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>

            {/* Export Button - Pro Feature */}
            <ExportButton
              data={{
                errorMessage,
                explanation,
                solution,
                codeExample,
                sources,
                category,
                confidence: displayConfidence,
                createdAt
              }}
              filename="error-analysis"
              format="json"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAnalysisCard;
