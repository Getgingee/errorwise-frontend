import React from 'react';
import { Copy, Check, Lightbulb, Code, Share2, Download, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ErrorAnalysisCardProps {
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  codeExample?: string;
  errorMessage?: string;
  createdAt?: string;
  onCopy?: (text: string, section: string) => void;
  copiedSection?: string | null;
  showActions?: boolean;
  showTimestamp?: boolean;
}

export const ErrorAnalysisCard: React.FC<ErrorAnalysisCardProps> = ({
  explanation,
  solution,
  category,
  confidence,
  codeExample,
  errorMessage,
  createdAt,
  onCopy,
  copiedSection,
  showActions = false,
  showTimestamp = false
}) => {
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
Confidence: ${confidence}%

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
    <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-4">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Explanation</h3>
          <div className="flex items-center gap-2">
            {showTimestamp && createdAt && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimeAgo(createdAt)}
              </span>
            )}
            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
              {category}
            </span>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed">{explanation}</p>
      </div>

      {/* Solution Section */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
          {onCopy && (
            <button
              onClick={() => onCopy(solution, 'solution')}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Copy solution"
            >
              {copiedSection === 'solution' ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          )}
        </div>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">{solution}</p>
      </div>

      {/* Code Example (if provided) */}
      {codeExample && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Code className="h-5 w-5" />
              Code Example
            </h3>
            {onCopy && (
              <button
                onClick={() => onCopy(codeExample, 'code')}
                className="p-1.5 hover:bg-white/10 rounded transition-colors"
                title="Copy code"
              >
                {copiedSection === 'code' ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            )}
          </div>
          <pre className="bg-slate-950 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono border border-white/10">
            <code>{codeExample}</code>
          </pre>
        </div>
      )}

      {/* Confidence Meter */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-xs text-gray-400">Confidence:</span>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
            data-confidence={confidence}
          >
            <style>{`.h-full[data-confidence="${confidence}"] { width: ${confidence}%; }`}</style>
          </div>
        </div>
        <span className="text-xs text-gray-300 font-medium">{confidence}%</span>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 hover:text-white transition-all"
            title="Share Analysis"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/30 hover:text-white transition-all"
            title="Download Analysis"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalysisCard;
