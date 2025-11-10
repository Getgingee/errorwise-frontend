import React from 'react';
import { Copy, Check, Lightbulb, Code } from 'lucide-react';

interface ErrorAnalysisCardProps {
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  codeExample?: string;
  onCopy?: (text: string, section: string) => void;
  copiedSection?: string | null;
}

export const ErrorAnalysisCard: React.FC<ErrorAnalysisCardProps> = ({
  explanation,
  solution,
  category,
  confidence,
  codeExample,
  onCopy,
  copiedSection
}) => {
  return (
    <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-4">
      {/* Header Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Explanation</h3>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
            {category}
          </span>
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
    </div>
  );
};

export default ErrorAnalysisCard;
