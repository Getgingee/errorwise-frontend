import { API_ENDPOINTS, API_BASE_URL } from '../config/api';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation';
import { 
  User, Mail, Calendar, Shield, Trash2, Edit3, Save, X, BarChart, 
  Zap, Crown, TrendingUp, Clock, Download, Settings, Bell, 
  CheckCircle, AlertCircle, Sparkles, Target, Award, Activity,
  ChevronRight, ExternalLink, CreditCard, RefreshCw, Eye, EyeOff,
  Cpu, Database, FileText, HelpCircle, LogOut
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAvailableModels } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  memberSince: string;
}

interface UserStats {
  totalQueries: number;
  thisMonthQueries: number;
  subscriptionTier: string;
}

interface UsageData {
  queriesUsed: number;
  queriesLimit: number;
  followUpsUsed: number;
  followUpsLimit: number;
  resetDate: string;
  percentage: number;
  daily: number;
  weekly: number;
  total: number;
}

interface NotificationSettings {
  emailDigest: boolean;
  productUpdates: boolean;
  weeklyReport: boolean;
}

const ProfilePage: React.FC = () => {
  const { token, updateUser, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'usage' | 'preferences' | 'security'>('profile');
  const [editData, setEditData] = useState({ username: '', email: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailDigest: true,
    productUpdates: true,
    weeklyReport: false
  });

  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  useEffect(() => {
    fetchProfile();
    fetchUsage();
    fetchAvailableModels();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.auth.profile, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setStats(data.stats);
        setEditData({ username: data.user.username, email: data.user.email });
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

    
  const fetchAvailableModels = async () => {
    try {
      const response = await getAvailableModels();
      setAvailableModels(response.models || []);
    } catch (error) {
      console.error('Failed to fetch available models:', error);
      // Fallback to default haiku model
      setAvailableModels([{ id: 'haiku', name: 'Fast', description: 'Quick responses for simple errors', available: true, recommended: true }]);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/errors/usage`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        // Map backend response to frontend UsageData format
        const monthlyUsage = data.usage?.monthly || {};
        setUsage({
          queriesUsed: monthlyUsage.used || 0,
          queriesLimit: monthlyUsage.limit === -1 ? 999999 : (monthlyUsage.limit || 50),
          followUpsUsed: 0,
          followUpsLimit: data.tier === 'free' ? 3 : (data.tier === 'pro' ? 5 : 10),
          resetDate: monthlyUsage.resetTime || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });
        // Update stats with real total from usage endpoint
        if (data.usage?.total !== undefined) {
          setStats(prev => prev ? { ...prev, totalQueries: data.usage.total } : prev);
        }
      }
    } catch (error) {
      console.error('Usage fetch error:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.profile, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: editData.username, email: editData.email })
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data.user);
        updateUser(data.user);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/password`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/account`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: passwordData.currentPassword })
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Account deleted successfully');
        logout();
      } else {
        toast.error(data.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    toast.loading('Preparing your data export...');
    try {
      const response = await fetch(`${API_BASE_URL}/errors/history`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `errorwise-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success('Data exported successfully!');
      } else {
        toast.dismiss();
        toast.error('Failed to export data');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Export failed. Please try again.');
    }
  };

  const getTierInfo = () => {
    const tier = stats?.subscriptionTier?.toLowerCase() || 'free';
    const tiers = {
      free: { name: 'Free', color: 'from-gray-500 to-gray-600', badge: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Zap, queries: 10, followUps: 3 },
      pro: { name: 'Pro', color: 'from-blue-500 to-cyan-400', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Crown, queries: -1, followUps: 10 },
      team: { name: 'Team', color: 'from-purple-500 to-pink-500', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Sparkles, queries: -1, followUps: -1 }
    };
    return tiers[tier as keyof typeof tiers] || tiers.free;
  };

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'usage', label: 'Usage & Billing', icon: BarChart },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Navigation />
        <div className="md:pl-64 pt-16 md:pt-0 flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Navigation />
      <div className="md:pl-64 pt-16 md:pt-0 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Profile Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${tierInfo.color} flex items-center justify-center shadow-xl`}>
                  <span className="text-3xl font-bold text-white">{profile?.username?.charAt(0).toUpperCase() || 'U'}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${tierInfo.badge} flex items-center gap-1`}>
                      <TierIcon className="w-3 h-3" />{tierInfo.name}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">{profile?.email}</p>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Member since {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{stats?.totalQueries || 0}</p>
                  <p className="text-xs text-gray-400">Problems Solved</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">{stats?.thisMonthQueries || 0}</p>
                  <p className="text-xs text-gray-400">This Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/25' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}>
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>
          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-cyan-400" />Profile Information
                      </h2>
                      {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all">
                          <Edit3 className="w-4 h-4" />Edit
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={handleUpdateProfile} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" />{isSaving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={() => { setIsEditing(false); setEditData({ username: profile?.username || '', email: profile?.email || '' }); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 transition-all">
                            <X className="w-4 h-4" />Cancel
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        {isEditing ? (
                          <input type="text" value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent" placeholder="Enter username" />
                        ) : (
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                            <User className="w-5 h-5 text-cyan-400" /><span className="text-white">{profile?.username}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        {isEditing ? (
                          <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent" placeholder="Enter email" />
                        ) : (
                          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                            <Mail className="w-5 h-5 text-cyan-400" /><span className="text-white">{profile?.email}</span>
                            <span className="ml-auto flex items-center gap-1 text-xs text-green-400"><CheckCircle className="w-3 h-3" />Verified</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Account ID</label>
                        <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                          <Database className="w-5 h-5 text-gray-500" /><span className="text-gray-400 font-mono text-sm">{profile?.id?.slice(0, 8)}...{profile?.id?.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button onClick={() => navigate('/subscription')} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><Crown className="w-5 h-5 text-white" /></div>
                          <div className="text-left"><p className="text-white font-medium">Upgrade Plan</p><p className="text-gray-500 text-xs">Get more features</p></div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                      <button onClick={handleExportData} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center"><Download className="w-5 h-5 text-white" /></div>
                          <div className="text-left"><p className="text-white font-medium">Export Data</p><p className="text-gray-500 text-xs">Download your history</p></div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                      <button onClick={() => navigate('/library')} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
                          <div className="text-left"><p className="text-white font-medium">Browse Library</p><p className="text-gray-500 text-xs">Explore solutions</p></div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                      <button onClick={() => window.open('mailto:hi@getgingee.com', '_blank')} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center"><HelpCircle className="w-5 h-5 text-white" /></div>
                          <div className="text-left"><p className="text-white font-medium">Get Help</p><p className="text-gray-500 text-xs">Contact support</p></div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </>
              )}
              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" />Current Usage</h2>
                      <button onClick={fetchUsage} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"><RefreshCw className="w-4 h-4" />Refresh</button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2"><span className="text-gray-400">Queries This Month</span><span className="text-white font-medium">{usage?.queriesUsed || stats?.thisMonthQueries || 0} / {usage?.queriesLimit || tierInfo.queries}</span></div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${tierInfo.color} transition-all duration-500`} style={{ width: `${Math.min(((usage?.queriesUsed || stats?.thisMonthQueries || 0) / (usage?.queriesLimit || tierInfo.queries)) * 100, 100)}%` }} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{(usage?.queriesLimit || tierInfo.queries) - (usage?.queriesUsed || stats?.thisMonthQueries || 0)} queries remaining</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2"><span className="text-gray-400">Follow-ups Per Query</span><span className="text-white font-medium">{tierInfo.followUps} max</span></div>
                        <div className="flex gap-1">
                          {[...Array(tierInfo.followUps)].map((_, i) => (<div key={i} className={`h-2 flex-1 rounded-full bg-gradient-to-r ${tierInfo.color}`} />))}
                          {[...Array(10 - tierInfo.followUps)].map((_, i) => (<div key={i} className="h-2 flex-1 rounded-full bg-white/10" />))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl"><Clock className="w-4 h-4 text-blue-400" /><span className="text-sm text-blue-300">Usage resets on the 1st of each month</span></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" />Subscription</h2>
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${tierInfo.color} bg-opacity-10 border border-white/20`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierInfo.color} flex items-center justify-center`}><TierIcon className="w-6 h-6 text-white" /></div>
                          <div><p className="text-white font-bold text-lg">{tierInfo.name} Plan</p><p className="text-gray-400 text-sm">{tierInfo.name === 'Free' ? 'Limited features' : 'All features included'}</p></div>
                        </div>
                        {tierInfo.name !== 'Team' && (<button onClick={() => navigate('/subscription')} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center gap-2">Upgrade<ChevronRight className="w-4 h-4" /></button>)}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-400 mb-3">Your plan includes:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-gray-300">{tierInfo.queries} queries/month</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-gray-300">{tierInfo.followUps} follow-ups/query</span></div>
                        <div className="flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-gray-300">7-day history</span></div>
                        <div className="flex items-center gap-2 text-sm">{tierInfo.name !== 'Free' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-gray-600" />}<span className={tierInfo.name !== 'Free' ? 'text-gray-300' : 'text-gray-600'}>Priority support</span></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Cpu className="w-5 h-5 text-cyan-400" />AI Model</h2>
                    <div className="space-y-3">
                      {getDisplayModels().map((model) => (
                        <button key={model.id} onClick={() => setSelectedModel(model.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedModel === model.id ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${selectedModel === model.id ? 'bg-cyan-400' : 'bg-white/30'}`} />
                            <div className="text-left"><p className="text-white font-medium">{model.name}</p><p className="text-gray-500 text-sm">{model.desc}</p></div>
                          </div>
                          {model.badge && (<span className={`px-2 py-1 rounded text-xs font-medium ${model.badge === 'Recommended' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>{model.badge}</span>)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-cyan-400" />Notifications</h2>
                    <div className="space-y-4">
                      {[{ key: 'emailDigest', label: 'Email Digest', desc: 'Daily summary of your activity' }, { key: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements' }, { key: 'weeklyReport', label: 'Weekly Report', desc: 'Your weekly problem-solving stats' }].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div><p className="text-white font-medium">{item.label}</p><p className="text-gray-500 text-sm">{item.desc}</p></div>
                          <button onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof NotificationSettings] }))} aria-label={`Toggle ${item.label}`} className={`w-12 h-6 rounded-full transition-all ${notifications[item.key as keyof NotificationSettings] ? 'bg-cyan-500' : 'bg-white/20'}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {/* Security Tab */}
              {activeTab === 'security' && (
                <>
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Shield className="w-5 h-5 text-cyan-400" />Password</h2>
                      <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all">Change Password</button>
                    </div>
                    {!showPasswordForm ? (
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"><Shield className="w-5 h-5 text-green-400" /><span className="text-gray-300">Your password is secure</span><span className="ml-auto text-xs text-gray-500">Last changed: Never</span></div>
                    ) : (
                      <div className="space-y-4">
                        <div><label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                          <div className="relative">
                            <input type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" id="currentPassword" name="currentPassword" placeholder="Enter current password" />
                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} aria-label="Toggle current password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                          </div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                          <div className="relative">
                            <input type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" id="newPassword" name="newPassword" placeholder="Enter new password" />
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} aria-label="Toggle new password visibility" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">{showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                          </div>
                        </div>
                        <div><label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                          <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Confirm new password" />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleChangePassword} disabled={isChangingPassword} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium hover:shadow-lg transition-all disabled:opacity-50">{isChangingPassword ? 'Updating...' : 'Update Password'}</button>
                          <button onClick={() => { setShowPasswordForm(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="px-6 py-3 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" />Active Sessions</h2>
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-400" /></div>
                      <div className="flex-1"><p className="text-white font-medium">Current Session</p><p className="text-gray-500 text-sm">Windows  Chrome  Active now</p></div>
                      <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">This device</span>
                    </div>
                    <button onClick={() => { logout(); navigate('/login'); }} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"><LogOut className="w-4 h-4" />Sign out of all devices</button>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div><h2 className="text-xl font-semibold text-red-400 flex items-center gap-2"><AlertCircle className="w-5 h-5" />Danger Zone</h2><p className="text-sm text-red-300/70 mt-1">Permanently delete your account and all data</p></div>
                      <button onClick={() => setShowDeleteForm(!showDeleteForm)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-4 h-4" />Delete Account</button>
                    </div>
                    {showDeleteForm && (
                      <div className="mt-4 p-4 bg-red-500/5 rounded-xl border border-red-500/20 space-y-4">
                        <p className="text-red-300 text-sm">This action cannot be undone. All your data, history, and settings will be permanently deleted.</p>
                        <div><label className="block text-sm font-medium text-red-300 mb-2">Type "DELETE" to confirm</label><input type="text" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="DELETE" /></div>
                        <div><label className="block text-sm font-medium text-red-300 mb-2">Your Password</label><input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="Enter password" /></div>
                        <button onClick={handleDeleteAccount} disabled={isDeleting || deleteConfirmation !== 'DELETE'} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:from-red-700 hover:to-red-600 disabled:opacity-50 transition-all">{isDeleting ? 'Deleting...' : 'Permanently Delete Account'}</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-400" />Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"><Target className="w-5 h-5 text-white" /></div>
                    <div><p className="text-white text-sm font-medium">Problem Solver</p><p className="text-gray-500 text-xs">{stats?.totalQueries || 0}/10 problems solved</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
                    <div><p className="text-white text-sm font-medium">Getting Started</p><p className="text-gray-500 text-xs">First week completed</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl opacity-50">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
                    <div><p className="text-white text-sm font-medium">Power User</p><p className="text-gray-500 text-xs">Solve 50 problems</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-cyan-500/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
                <p className="text-gray-400 text-sm mb-4">Our support team is here to assist you with any questions.</p>
                <button onClick={() => window.open('mailto:hi@getgingee.com', '_blank')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"><Mail className="w-4 h-4" />Contact Support</button>
              </div>

              {tierInfo.name === 'Free' && (
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                  <div className="flex items-center gap-2 mb-3"><Crown className="w-5 h-5 text-yellow-400" /><h3 className="text-lg font-semibold text-white">Upgrade to Pro</h3></div>
                  <p className="text-gray-400 text-sm mb-4">Get 100 queries/month, 5 follow-ups, and priority support.</p>
                  <button onClick={() => navigate('/subscription')} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">Upgrade Now<ChevronRight className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;














