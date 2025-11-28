/**
 * Error Library Page
 * 
 * Browse pre-built error solutions organized by category.
 * Users can search, filter, and save solutions to their own templates.
 * 
 * @ticket P1 - Error Library: Save solved issues as templates for reuse
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import { API_BASE_URL } from '../config/api';
import {
  Search,
  Filter,
  BookOpen,
  CreditCard,
  Globe,
  Gamepad2,
  Smartphone,
  Monitor,
  Wifi,
  Database,
  Lock,
  Plug,
  HelpCircle,
  ChevronRight,
  Eye,
  ThumbsUp,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Bookmark
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Category icons and colors
const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  payment: { icon: <CreditCard className="w-5 h-5" />, color: 'text-green-400', bgColor: 'bg-green-500/10' },
  website: { icon: <Globe className="w-5 h-5" />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  gaming: { icon: <Gamepad2 className="w-5 h-5" />, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  mobile: { icon: <Smartphone className="w-5 h-5" />, color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
  software: { icon: <Monitor className="w-5 h-5" />, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  network: { icon: <Wifi className="w-5 h-5" />, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
  database: { icon: <Database className="w-5 h-5" />, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
  authentication: { icon: <Lock className="w-5 h-5" />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  api: { icon: <Plug className="w-5 h-5" />, color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
  general: { icon: <HelpCircle className="w-5 h-5" />, color: 'text-gray-400', bgColor: 'bg-gray-500/10' }
};

interface LibraryEntry {
  id: string;
  errorCode: string;
  title: string;
  errorMessage: string;
  category: string;
  subcategory?: string;
  explanation: string;
  solution: string;
  commonCauses?: string[];
  preventionTips?: string[];
  tags?: string[];
  platforms?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  viewCount: number;
  useCount: number;
  helpfulCount: number;
  createdAt: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  count: number;
}

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  
  // State
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<LibraryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Fetch entries when filters change
  useEffect(() => {
    fetchEntries();
  }, [selectedCategory, searchQuery]);
  
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/library/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };
  
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (searchQuery) params.set('q', searchQuery);
      params.set('sort', 'popular');
      
      const response = await fetch(`${API_BASE_URL}/library?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEntries(data.data);
      } else {
        setError(data.error || 'Failed to load library');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Failed to fetch entries:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEntry = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/library/${id}`);
      const data = await response.json();
      if (data.success) {
        setSelectedEntry(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch entry:', err);
      toast.error('Failed to load solution details');
    }
  };
  
  const submitFeedback = async (helpful: boolean) => {
    if (!selectedEntry) return;
    try {
      await fetch(`${API_BASE_URL}/library/${selectedEntry.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful })
      });
      toast.success(helpful ? 'Thanks for your feedback!' : "We'll work on improving this");
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };
  
  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchQuery) prev.set('q', searchQuery);
      else prev.delete('q');
      return prev;
    });
  };
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedEntry(null);
    setSearchParams(prev => {
      if (categoryId !== 'all') prev.set('category', categoryId);
      else prev.delete('category');
      return prev;
    });
  };
  
  const getDifficultyBadge = (difficulty: string) => {
    const styles = {
      easy: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      hard: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return styles[difficulty as keyof typeof styles] || styles.easy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold text-white">Error Library</h1>
          </div>
          <p className="text-gray-400">
            Browse pre-built solutions for common errors. Find instant fixes without waiting for AI analysis.
          </p>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search errors... (e.g., 'card declined', '404', 'connection timeout')"
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
            />
          </div>
        </form>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Category Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    All Errors
                  </span>
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                    {categories.reduce((sum, c) => sum + c.count, 0)}
                  </span>
                </button>
                
                {categories.map((cat) => {
                  const config = categoryConfig[cat.id] || categoryConfig.general;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id
                          ? `${config.bgColor} ${config.color}`
                          : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {config.icon}
                        {cat.label}
                      </span>
                      <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {selectedEntry ? (
              /* Entry Detail View */
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl">
                {/* Back button */}
                <div className="p-4 border-b border-slate-700">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to list
                  </button>
                </div>
                
                {/* Entry header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {categoryConfig[selectedEntry.category]?.icon}
                        <span className={`text-sm ${categoryConfig[selectedEntry.category]?.color}`}>
                          {selectedEntry.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyBadge(selectedEntry.difficulty)}`}>
                          {selectedEntry.difficulty}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedEntry.title}</h2>
                      <code className="text-sm text-red-400 bg-red-500/10 px-2 py-1 rounded">
                        {selectedEntry.errorCode}
                      </code>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {selectedEntry.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {selectedEntry.helpfulCount}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Error message */}
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Error Message
                  </h3>
                  <div className="relative">
                    <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-red-400 text-sm overflow-x-auto">
                      {selectedEntry.errorMessage}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(selectedEntry.errorMessage, 'error')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedField === 'error' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Explanation */}
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    What This Means
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{selectedEntry.explanation}</p>
                </div>
                
                {/* Solution */}
                <div className="p-6 border-b border-slate-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    How to Fix It
                  </h3>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <pre className="text-emerald-300 text-sm whitespace-pre-wrap font-sans">
                      {selectedEntry.solution}
                    </pre>
                  </div>
                </div>
                
                {/* Common Causes */}
                {selectedEntry.commonCauses && selectedEntry.commonCauses.length > 0 && (
                  <div className="p-6 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Common Causes
                    </h3>
                    <ul className="space-y-2">
                      {selectedEntry.commonCauses.map((cause, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-yellow-400 mt-1">•</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Prevention Tips */}
                {selectedEntry.preventionTips && selectedEntry.preventionTips.length > 0 && (
                  <div className="p-6 border-b border-slate-700">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      Prevention Tips
                    </h3>
                    <ul className="space-y-2">
                      {selectedEntry.preventionTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300">
                          <span className="text-emerald-400 mt-1">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Feedback */}
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Was this helpful?
                  </h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => submitFeedback(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes, it helped!
                    </button>
                    <button
                      onClick={() => submitFeedback(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-gray-400 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      No, I need more help
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Entry List View */
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <p className="text-gray-400">{error}</p>
                    <button
                      onClick={fetchEntries}
                      className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-600 mb-4" />
                    <p className="text-gray-400">No solutions found for your search.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSearchParams(new URLSearchParams());
                      }}
                      className="mt-4 text-emerald-400 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {entries.map((entry) => {
                      const config = categoryConfig[entry.category] || categoryConfig.general;
                      return (
                        <button
                          key={entry.id}
                          onClick={() => fetchEntry(entry.id)}
                          className="w-full text-left bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-slate-800 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`${config.color}`}>{config.icon}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyBadge(entry.difficulty)}`}>
                                  {entry.difficulty}
                                </span>
                                {entry.tags && entry.tags.slice(0, 2).map((tag, i) => (
                                  <span key={i} className="text-xs text-gray-500 bg-slate-700/50 px-2 py-0.5 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                {entry.title}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2">{entry.explanation}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {entry.viewCount}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  {entry.helpfulCount}
                                </span>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
