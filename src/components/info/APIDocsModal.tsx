import React from 'react';
import { X, Code, Book, Terminal, Layers } from 'lucide-react';

interface APIDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APIDocsModal: React.FC<APIDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">API Documentation</h2>
            <p className="text-blue-100 mt-1">Integrate ErrorWise into your workflow</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close API docs modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Quick Start */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-blue-200 dark:border-gray-600">
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quick Start</h3>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-green-400 text-sm">
                  curl -X POST https://api.errorwise.com/v1/analyze \<br />
                  &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '&#123;"error": "TypeError: Cannot read property..."&#125;'
                </code>
              </div>
            </div>

            {/* Endpoints */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Layers size={24} className="text-blue-600" />
                API Endpoints
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">POST</span>
                    <code className="text-sm font-mono text-gray-900 dark:text-white">/v1/analyze</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Analyze an error and get AI-powered solutions</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">GET</span>
                    <code className="text-sm font-mono text-gray-900 dark:text-white">/v1/history</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Retrieve your error analysis history</p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">GET</span>
                    <code className="text-sm font-mono text-gray-900 dark:text-white">/v1/usage</code>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Check your current usage and limits</p>
                </div>
              </div>
            </div>

            {/* SDKs */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code size={24} className="text-blue-600" />
                Official SDKs
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {['JavaScript', 'Python', 'Java', 'Go', 'Ruby', 'PHP'].map((lang) => (
                  <div key={lang} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 transition-colors cursor-pointer">
                    <p className="font-semibold text-gray-900 dark:text-white">{lang}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">npm install @errorwise/{lang.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <Book className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resources</h3>
              </div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Full API Reference →</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Authentication Guide →</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Rate Limits & Quotas →</a>
                </li>
                <li>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Webhooks Documentation →</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocsModal;
