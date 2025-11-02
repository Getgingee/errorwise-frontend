import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface DemoResult {
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  isDemo: boolean;
  remainingDemos: number;
  totalDemos: number;
  resetTime: string;
  upgradeMessage: string;
  upgradeUrl: string;
}

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveDemoModal: React.FC<LiveDemoModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examples, setExamples] = useState<string[]>([]);
  const [remainingDemos, setRemainingDemos] = useState<number>(2);
  const [demoLimit, setDemoLimit] = useState<number>(2);

  useEffect(() => {
    if (isOpen) {
      // Fetch demo status
      fetch(`/public/demo/status`)
        .then(res => res.json())
        .then(data => {
          setRemainingDemos(data.remaining || 0);
          setDemoLimit(data.limit || 2);
        })
        .catch(err => console.error('Failed to load demo status:', err));

      // Load example questions
      fetch(`${API_BASE_URL}/public/demo/examples`)
        .then(res => res.json())
        .then(data => setExamples(data.examples || []))
        .catch((err) => {
          console.error('Failed to load examples:', err);
          setExamples([
            'TypeError: Cannot read property of undefined in JavaScript',
            'How to fix "Module not found" error in React?',
            'Python IndexError: list index out of range',
            'What causes high CPU usage in Node.js?',
          ]);
        });
    }
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!question.trim() || question.length < 10) {
      setError('Please enter at least 10 characters');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/public/demo/explain`);
      
      const response = await fetch(`${API_BASE_URL}/public/demo/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errorMessage: question }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        // Handle rate limit (429)
        if (response.status === 429) {
          setError(data.message || 'Demo limit reached. Sign up for unlimited access!');
          return;
        } 
        
        // Handle other errors
        if (response.status === 404) {
          throw new Error('Demo service unavailable. Please try again later.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw new Error(data.error || 'Failed to get explanation');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to the backend server. Please ensure the backend is running on http://localhost:3001');
      } else {
        setError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setResult(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 border border-white/20 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Try ErrorWise - Free Demo</h2>
          </div>
          <button
            onClick={onClose}
            title="Close modal"
            aria-label="Close modal"
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Example Questions */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300">Try one of these examples:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Ask any question or describe your error:
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: TypeError: Cannot read property 'name' of undefined..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              maxLength={2000}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>{question.length}/2000 characters</span>
              <span>No signup required!</span>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || question.length < 10}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Get Explanation</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 text-sm font-semibold mb-1">Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                  {error.includes('limit') && (
                    <Link 
                      to="/register" 
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Sign Up for Unlimited Access
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-4">
              {/* Demo Usage Badge */}
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-300">{result.upgradeMessage}</span>
                </div>
                {result.remainingDemos === 0 && (
                  <Link 
                    to="/register"
                    className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded transition-colors"
                  >
                    Sign Up
                  </Link>
                )}
              </div>

              {/* Explanation Card */}
              <div className="p-5 bg-white/5 border border-white/10 rounded-lg space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Explanation</h3>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
                      {result.category}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{result.explanation}</p>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Solution</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{result.solution}</p>
                </div>

                {/* Confidence Badge */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-gray-400">Confidence:</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-300 font-medium">{result.confidence}%</span>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="p-5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Want More?</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Sign up to get unlimited explanations, code examples, prevention tips, and save your error history!
                </p>
                <Link 
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold rounded-lg shadow-lg transition-all"
                >
                  <TrendingUp className="h-5 w-5" />
                  Get Started Free
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDemoModal;


