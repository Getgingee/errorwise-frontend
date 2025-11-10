import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Navigation from '../../components/Navigation';
import ErrorAnalysisCard from '../../components/ErrorAnalysisCard';
import { 
  Users, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Search,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface TeamAnalysis {
  id: string;
  errorMessage: string;
  explanation: string;
  solution: string;
  codeExample?: string;
  confidence: number;
  category: string;
  createdAt: string;
  userId: number;
  username: string;
  teamId: number;
}

const TeamAnalyses: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [analyses, setAnalyses] = useState<TeamAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<TeamAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<TeamAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // TODO: Add Team subscription/membership check when ready
  // useEffect(() => {
  //   const checkAccess = async () => {
  //     if (!hasTeamAccess(user)) {
  //       toast.error('Team subscription or membership required');
  //       navigate('/pricing?upgrade=team');
  //     }
  //   };
  //   checkAccess();
  // }, []);

  useEffect(() => {
    fetchTeamAnalyses();
  }, []);

  useEffect(() => {
    filterAnalyses();
  }, [analyses, searchQuery, categoryFilter, timeFilter]);

  const fetchTeamAnalyses = async () => {
    try {
      const response = await fetch(`${API_URL}/teams/analyses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
      } else {
        toast.error('Failed to load team analyses');
      }
    } catch (error) {
      console.error('Failed to fetch team analyses:', error);
      toast.error('Failed to load team analyses');
    } finally {
      setLoading(false);
    }
  };

  const filterAnalyses = () => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(a => a.category === categoryFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(a => {
        const createdAt = new Date(a.createdAt);
        const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        
        if (timeFilter === 'today') return hoursDiff <= 24;
        if (timeFilter === 'week') return hoursDiff <= 168;
        if (timeFilter === 'month') return hoursDiff <= 720;
        return true;
      });
    }

    setFilteredAnalyses(filtered);
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSection(section);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedSection(null), 2000);
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const categories = [...new Set(analyses.map(a => a.category))];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pt-20 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/team')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Team Dashboard
            </button>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Team Error Analyses</h1>
                <p className="text-gray-400">Collaborative debugging and shared insights</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{analyses.length}</p>
                    <p className="text-xs text-gray-400">Total Analyses</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {new Set(analyses.map(a => a.userId)).size}
                    </p>
                    <p className="text-xs text-gray-400">Team Members</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {categories.length}
                    </p>
                    <p className="text-xs text-gray-400">Categories</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {analyses.length > 0 
                        ? Math.round(analyses.reduce((acc, a) => acc + a.confidence, 0) / analyses.length)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-400">Avg Confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search analyses..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Time Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                  aria-label="Filter by time period"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'result' : 'results'}
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-gray-400 mt-4">Loading team analyses...</p>
            </div>
          ) : filteredAnalyses.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="h-16 w-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-xl">No analyses found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or have your team start analyzing errors</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
              {/* List View */}
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {filteredAnalyses.map((analysis) => (
                  <button
                    key={analysis.id}
                    onClick={() => setSelectedAnalysis(analysis)}
                    className={`w-full text-left bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all ${
                      selectedAnalysis?.id === analysis.id
                        ? 'ring-2 ring-cyan-400 bg-cyan-500/10'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">
                          {analysis.category}
                        </span>
                        <span className="text-xs text-gray-500">by {analysis.username}</span>
                      </div>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {analysis.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 line-clamp-2">
                      {analysis.errorMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(analysis.createdAt).toLocaleDateString()} at{' '}
                      {new Date(analysis.createdAt).toLocaleTimeString()}
                    </p>
                  </button>
                ))}
              </div>

              {/* Detail View */}
              <div>
                {selectedAnalysis ? (
                  <div className="space-y-4">
                    {/* Analysis Info */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {selectedAnalysis.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-semibold">{selectedAnalysis.username}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(selectedAnalysis.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                        <p className="text-xs text-gray-400 mb-1">Error Message:</p>
                        <p className="text-sm text-gray-200 font-mono">
                          {selectedAnalysis.errorMessage}
                        </p>
                      </div>
                    </div>

                    {/* Analysis Card */}
                    <ErrorAnalysisCard
                      explanation={selectedAnalysis.explanation}
                      solution={selectedAnalysis.solution}
                      category={selectedAnalysis.category}
                      confidence={selectedAnalysis.confidence}
                      codeExample={selectedAnalysis.codeExample}
                      errorMessage={selectedAnalysis.errorMessage}
                      createdAt={selectedAnalysis.createdAt}
                      onCopy={copyToClipboard}
                      copiedSection={copiedSection}
                      showActions={true}
                      showTimestamp={true}
                    />
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-20 text-center">
                    <Users className="h-20 w-20 text-gray-600 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400 text-xl font-semibold mb-2">Select an analysis</p>
                    <p className="text-gray-500 text-sm">Click on any analysis from the list to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamAnalyses;
