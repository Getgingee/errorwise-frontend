import { API_ENDPOINTS } from '../config/api';
import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  Upload, 
  FileText, 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  Copy, 
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ErrorAnalysis {
  id: string;
  errorMessage: string;
  analysis: string;
  solution: string;
  confidence: number;
  createdAt: string;
}

const ErrorAnalysisPage: React.FC = () => {
  const { token } = useAuthStore();
  const [errorInput, setErrorInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ErrorAnalysis | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<ErrorAnalysis[]>([]);

  React.useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.errors.recent, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses(data.analyses || []);
      }
    } catch (error) {
      console.error('Failed to fetch recent analyses:', error);
    }
  };

  const handleAnalyzeError = async () => {
    if (!errorInput.trim()) {
      toast.error('Please enter an error message to analyze');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(API_ENDPOINTS.errors.analyze, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          errorMessage: errorInput
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAnalysis(data.analysis);
        setErrorInput('');
        fetchRecentAnalyses();
        toast.success('Error analyzed successfully');
      } else {
        toast.error(data.error || 'Failed to analyze error');
      }
    } catch (error) {
      console.error('Error analysis failed:', error);
      toast.error('Failed to analyze error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.log')) {
      toast.error('Please upload a text or log file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setErrorInput(content);
      toast.success('File uploaded successfully');
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadAnalysis = () => {
    if (!analysis) return;

    const content = `Error Analysis Report
Generated: ${new Date(analysis.createdAt).toLocaleString()}
Confidence: ${analysis.confidence}%

ERROR MESSAGE:
${analysis.errorMessage}

ANALYSIS:
${analysis.analysis}

SOLUTION:
${analysis.solution}
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analysis downloaded');
  };

  const loadPreviousAnalysis = (prevAnalysis: ErrorAnalysis) => {
    setAnalysis(prevAnalysis);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1408px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Error Analysis</h1>
          <p className="text-gray-600 mt-2">
            Get AI-powered insights and solutions for your error messages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Analyze Error</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Message or Log Content
                  </label>
                  <textarea
                    value={errorInput}
                    onChange={(e) => setErrorInput(e.target.value)}
                    placeholder="Paste your error message, stack trace, or log content here..."
                    className="block w-full h-40 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleAnalyzeError}
                    disabled={isAnalyzing || !errorInput.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <AlertCircle className="h-4 w-4 mr-2" />
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Error'}
                  </button>

                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                    <input
                      type="file"
                      accept=".txt,.log"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {analysis && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Analysis Results</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(`${analysis.analysis}\n\n${analysis.solution}`)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </button>
                    <button
                      onClick={downloadAnalysis}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Confidence:</span>
                    <span className="font-semibold text-gray-900">{analysis.confidence}%</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        data-width={analysis.confidence}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Original Error:</h3>
                    <div className="bg-gray-50 border rounded-md p-3">
                      <code className="text-sm text-red-600 whitespace-pre-wrap">
                        {analysis.errorMessage}
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Analysis:</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {analysis.analysis}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recommended Solution:</h3>
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {analysis.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Analyses</h3>
              
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No recent analyses</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAnalyses.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadPreviousAnalysis(item)}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs font-medium text-blue-600">
                          {item.confidence}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">
                        {item.errorMessage.substring(0, 80)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAnalysisPage;


