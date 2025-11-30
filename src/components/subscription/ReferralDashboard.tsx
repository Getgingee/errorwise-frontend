// Referral Dashboard (F3)
// Share referral link, track invites, earn rewards

import React, { useState, useEffect } from 'react';
import { Gift, Users, Copy, Check, Twitter, Linkedin, Mail, Zap, Crown, TrendingUp } from 'lucide-react';
import apiClient from '../../services/api';
import { toast } from 'react-hot-toast';

interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferred: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalQueriesEarned: number;
  proMonthsEarned: number;
  referrals: Array<{
    email: string;
    status: string;
    reward: string;
    date: string;
  }>;
  rewards: {
    perFreeReferral: number;
    perPaidReferral: string;
    maxMonthlyReferrals: number;
  };
}

const ReferralDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showAllReferrals, setShowAllReferrals] = useState(false);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await apiClient.get('/referral/dashboard');
      const data = (response as any).data || response;
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
      toast.error('Failed to load referral dashboard');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (stats?.referralLink) {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnTwitter = () => {
    const text = ` I use ErrorWise AI to debug code 10x faster! Get 25 bonus queries when you sign up:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(stats?.referralLink || '')}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(stats?.referralLink || '')}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = 'Try ErrorWise AI - Get 25 Bonus Queries!';
    const body = `Hey!\n\nI've been using ErrorWise AI to debug my code and it's amazing. You should try it!\n\nSign up using my link and we both get bonus queries:\n${stats?.referralLink}\n\nHappy coding!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-6"></div>
        <div className="h-12 bg-slate-700 rounded mb-4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 bg-slate-700 rounded"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
          <div className="h-20 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const visibleReferrals = showAllReferrals ? stats.referrals : stats.referrals.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Referral Program</h2>
        </div>
        <p className="text-gray-400 mb-6">
          Invite friends and earn rewards! Get <span className="text-green-400 font-semibold">+25 queries</span> for each free signup,
          or <span className="text-yellow-400 font-semibold">+1 month Pro</span> when they subscribe!
        </p>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Your referral link</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <code className="text-blue-400 text-sm truncate">{stats.referralLink}</code>
            </div>
            <button
              onClick={copyLink}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={shareOnTwitter}
            className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 text-[#1DA1F2] rounded-lg transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Share on Twitter
          </button>
          <button
            onClick={shareOnLinkedIn}
            className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#0A66C2] rounded-lg transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </button>
          <button
            onClick={shareByEmail}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total Invites</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalReferred}</p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Check className="w-4 h-4" />
            <span className="text-sm">Successful</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{stats.successfulReferrals}</p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm">Queries Earned</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.totalQueriesEarned}</p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Crown className="w-4 h-4" />
            <span className="text-sm">Pro Months</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.proMonthsEarned}</p>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          How Rewards Work
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Free Signup</p>
              <p className="text-gray-400">+{stats.rewards.perFreeReferral} queries for you AND your friend</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">Paid Subscription</p>
              <p className="text-gray-400">{stats.rewards.perPaidReferral} when they upgrade to Pro!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History */}
      {stats.referrals.length > 0 && (
        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h3 className="text-white font-medium mb-4">Referral History</h3>
          <div className="space-y-3">
            {visibleReferrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    referral.status === 'subscribed' ? 'bg-yellow-500/20' : 
                    referral.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    {referral.status === 'subscribed' ? (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    ) : referral.status === 'active' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Users className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm">{referral.email}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(referral.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    referral.status === 'subscribed' ? 'text-yellow-400' :
                    referral.status === 'active' ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {referral.reward}
                  </span>
                  <p className="text-gray-500 text-xs capitalize">{referral.status}</p>
                </div>
              </div>
            ))}
          </div>
          
          {stats.referrals.length > 5 && (
            <button
              onClick={() => setShowAllReferrals(!showAllReferrals)}
              className="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              {showAllReferrals ? 'Show Less' : `Show All (${stats.referrals.length})`}
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {stats.referrals.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No referrals yet</p>
          <p className="text-gray-500 text-sm">Share your link to start earning rewards!</p>
        </div>
      )}
    </div>
  );
};

export default ReferralDashboard;
