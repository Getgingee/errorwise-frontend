import React, { useState, useEffect } from 'react';
import { History, X, Calendar, TrendingUp, ChevronRight, Clock, Download, RefreshCw } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';
import '../styles/HistorySidebar.css';

declare const gtag: (...args: any[]) => void;

interface ErrorHistoryItem {
  id: string;
  errorMessage: string;
  explanation: string;
  solution: string;
  category: string;
  confidence: number;
  createdAt: string;
  codeExample?: string;
  sources?: Array<{ title: string; url: string; description: string }>;
}

interface HistorySidebarProps {
  onSelectError?: (error: ErrorHistoryItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * B3: Basic History View (Per User or Anonymous Session)
 * 
 * Shows last 20 queries with:
 * - Timestamp
 * - First 100 chars of query
 * - Category
 * - Click to reload result card
 */
export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  onSelectError,
  isOpen,
  onClose
}) => {
  const { token } = useAuthStore();
  const [history, setHistory] = useState<ErrorHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // B3: Fetch last 20 queries
      const response = await fetch(`${API_ENDPOINTS.errors.history}?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setTotalCount(data.pagination?.total || data.history?.length || 0);

        // B3: Track history view
        if (typeof gtag !== 'undefined') {
          gtag('event', 'history_view', {
            event_category: 'engagement',
            event_label: 'sidebar_opened',
            value: data.pagination?.total || data.history?.length || 0
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // B3: Truncate query to first 100 chars
  const truncateQuery = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const handleSelectError = (error: ErrorHistoryItem) => {
    setSelectedId(error.id);
    
    // B3: Track history revisit event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'history_revisit', {
        event_category: 'engagement',
        event_label: error.category,
        query_id: error.id
      });
    }
    
    onSelectError?.(error);
    toast.success('Previous analysis loaded');
  };

  // Export history function
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`${API_BASE_URL}/history/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.status === 403) {
        toast.error('Export requires Pro or Team subscription. Upgrade to unlock!', {
          duration: 4000,
          icon: '',
        });
        return;
      }

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `errorwise-history-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`History exported as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export history');
    }
  };

  // Group by day
  const groupedHistory = history.reduce((acc, item) => {
    const date = formatDate(item.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, ErrorHistoryItem[]>);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-gray-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Query History</h2>
                <p className="text-xs text-gray-400">Last 20 queries</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchHistory}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Refresh history"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Export Buttons - Pro/Team Feature */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              title="Export as JSON (Pro/Team)"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
              title="Export as CSV (Pro/Team)"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <p className="text-xl font-bold text-white mt-1">{totalCount}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs text-gray-400">Today</span>
              </div>
              <p className="text-xl font-bold text-white mt-1">
                {groupedHistory['Today']?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-280px)] p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="p-4 bg-white/5 rounded-2xl mb-4">
                <History className="w-12 h-12 text-gray-500" />
              </div>
              <p className="text-gray-400 text-sm">No queries yet</p>
              <p className="text-gray-500 text-xs mt-1">Your history will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date}>
                  {/* Date Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectError(item)}
                        className={`group w-full text-left p-3 rounded-xl transition-all duration-200 ${
                          selectedId === item.id
                            ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {/* Header: Category + Timestamp */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded text-cyan-300 font-medium">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(item.createdAt)}
                              </span>
                            </div>

                            {/* B3: Query preview - first 100 chars */}
                            <p className="text-sm text-gray-200 font-medium leading-relaxed">
                              {truncateQuery(item.errorMessage, 100)}
                            </p>

                            {/* Confidence */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    item.confidence >= 80 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                      : item.confidence >= 60
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
                                        : item.confidence >= 40
                                          ? 'bg-gradient-to-r from-yellow-500 to-orange-400'
                                          : 'bg-gradient-to-r from-red-500 to-orange-400'
                                  }`}
                                  style={{ width: `${item.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 font-semibold">{item.confidence}%</span>
                            </div>
                          </div>

                          <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform duration-200 ${
                            selectedId === item.id ? 'text-cyan-400 translate-x-1' : 'text-gray-500 group-hover:translate-x-1 group-hover:text-cyan-400'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 to-transparent">
          <p className="text-xs text-gray-500 text-center">
            Click any item to reload its analysis
          </p>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;
