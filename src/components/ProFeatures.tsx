import React, { useState } from 'react';
import { Code, Download, ExternalLink, Copy, Check, FileJson, FileCode } from 'lucide-react';
import { TierGate } from './TierGate';

// Code Examples Viewer Component
interface CodeExample {
  language: string;
  code: string;
  description?: string;
}

interface CodeExamplesViewerProps {
  examples: CodeExample[];
}

export const CodeExamplesViewer: React.FC<CodeExamplesViewerProps> = ({ examples }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(examples[selectedIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!examples || examples.length === 0) return null;

  const selectedExample = examples[selectedIndex];

  return (
    <TierGate requiredTier="pro">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">Code Examples</h4>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Language tabs */}
        {examples.length > 1 && (
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                  index === selectedIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {example.language}
              </button>
            ))}
          </div>
        )}

        {/* Code display */}
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-gray-100">
            <code>{selectedExample.code}</code>
          </pre>
        </div>

        {selectedExample.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {selectedExample.description}
          </p>
        )}
      </div>
    </TierGate>
  );
};

// Fix Suggestions Panel Component
interface FixStep {
  step: number;
  title: string;
  description: string;
  code?: string;
}

interface FixSuggestionsPanelProps {
  steps: FixStep[];
}

export const FixSuggestionsPanel: React.FC<FixSuggestionsPanelProps> = ({ steps }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <TierGate requiredTier="pro">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 mt-4 border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
            ✓
          </span>
          Fix Suggestions
        </h4>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.step}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-gray-900 dark:text-white mb-1">
                  {step.title}
                </h5>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {step.description}
                </p>
                {step.code && (
                  <div className="bg-gray-900 rounded p-2 mt-2">
                    <code className="text-xs text-gray-100">{step.code}</code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TierGate>
  );
};

// Export Button Component
interface ExportButtonProps {
  data: any;
  filename?: string;
  format?: 'json' | 'csv';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename = 'error-analysis',
  format = 'json',
}) => {
  const handleExport = () => {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      // Convert to CSV
      const headers = Object.keys(data[0] || {});
      const csvRows = [
        headers.join(','),
        ...data.map((row: any) =>
          headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
        ),
      ];
      content = csvRows.join('\n');
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <TierGate requiredTier="pro" showUpgrade={false}>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      >
        {format === 'json' ? (
          <FileJson className="w-4 h-4" />
        ) : (
          <FileCode className="w-4 h-4" />
        )}
        <span>Export {format.toUpperCase()}</span>
        <Download className="w-4 h-4" />
      </button>
    </TierGate>
  );
};

// URL Scraping Results Component
interface ScrapedSource {
  url: string;
  title: string;
  snippet: string;
  relevance: number;
}

interface URLScrapingResultsProps {
  sources: ScrapedSource[];
}

export const URLScrapingResults: React.FC<URLScrapingResultsProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <TierGate requiredTier="pro">
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mt-4 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-3">
          <ExternalLink className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Web Solutions Found
          </h4>
          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
            {sources.length}
          </span>
        </div>

        <div className="space-y-3">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h5 className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex-1">
                  {source.title}
                </h5>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="font-medium">{Math.round(source.relevance * 100)}%</span>
                  <span>relevant</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {source.snippet}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {source.url}
              </p>
            </a>
          ))}
        </div>
      </div>
    </TierGate>
  );
};

// Prevention Tips Component
interface PreventionTip {
  title: string;
  description: string;
}

interface PreventionTipsProps {
  tips: PreventionTip[];
}

export const PreventionTips: React.FC<PreventionTipsProps> = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <TierGate requiredTier="pro">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mt-4 border border-yellow-200 dark:border-yellow-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-yellow-600 dark:text-yellow-400">💡</span>
          Prevention Tips
        </h4>

        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-yellow-600 dark:text-yellow-400 flex-shrink-0">•</span>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {tip.title}:
                </span>{' '}
                <span className="text-gray-700 dark:text-gray-300">
                  {tip.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </TierGate>
  );
};
