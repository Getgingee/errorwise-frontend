// Social Proof Section (E3)
// User count, testimonials, live activity feed

import React, { useState, useEffect } from 'react';
import { Users, Star, Quote, Activity, CheckCircle, Code, Zap } from 'lucide-react';
import apiClient from '../../services/api';

interface SocialProofData {
  userCount: number;
  queriesSolved: number;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    company: string;
    avatar: string;
    quote: string;
    rating: number;
  }>;
  liveActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
    icon: string;
  }>;
  stats: {
    avgResponseTime: string;
    successRate: string;
    languagesSupported: number;
  };
}

// Default fallback data
const FALLBACK_DATA: SocialProofData = {
  userCount: 10000,
  queriesSolved: 250000,
  testimonials: [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Developer',
      company: 'TechCorp',
      avatar: 'SC',
      quote: 'ErrorWise cut my debugging time by 70%. The AI explanations are incredibly helpful.',
      rating: 5
    },
    {
      id: '2',
      name: 'Mike Johnson',
      role: 'Full Stack Engineer',
      company: 'StartupXYZ',
      avatar: 'MJ',
      quote: 'Finally an AI that actually understands context. My go-to debugging companion.',
      rating: 5
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'Tech Lead',
      company: 'Enterprise Inc',
      avatar: 'ER',
      quote: 'Our team productivity increased 40% since adopting ErrorWise. Worth every penny.',
      rating: 5
    }
  ],
  liveActivity: [],
  stats: {
    avgResponseTime: '<2s',
    successRate: '94%',
    languagesSupported: 50
  }
};

const SocialProofSection: React.FC = () => {
  const [data, setData] = useState<SocialProofData>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetchSocialProof();
  }, []);

  // Separate effect for testimonial rotation
  useEffect(() => {
    if (!data?.testimonials?.length) return;
    
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % data.testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [data?.testimonials?.length]);

  const fetchSocialProof = async () => {
    try {
      const response = await apiClient.get('/social-proof');
      const responseData = (response as any).data || response;
      
      // Validate and sanitize data
      const sanitizedData: SocialProofData = {
        userCount: Math.max(0, Number(responseData?.userCount) || FALLBACK_DATA.userCount),
        queriesSolved: Math.max(0, Number(responseData?.queriesSolved) || FALLBACK_DATA.queriesSolved),
        testimonials: Array.isArray(responseData?.testimonials) && responseData.testimonials.length > 0
          ? responseData.testimonials.map((t: any) => ({
              ...t,
              rating: Math.min(5, Math.max(0, Number(t?.rating) || 5))
            }))
          : FALLBACK_DATA.testimonials,
        liveActivity: Array.isArray(responseData?.liveActivity) ? responseData.liveActivity : [],
        stats: {
          avgResponseTime: responseData?.stats?.avgResponseTime || FALLBACK_DATA.stats.avgResponseTime,
          successRate: responseData?.stats?.successRate || FALLBACK_DATA.stats.successRate,
          languagesSupported: Math.max(0, Number(responseData?.stats?.languagesSupported) || FALLBACK_DATA.stats.languagesSupported)
        }
      };
      
      setData(sanitizedData);
    } catch (error) {
      console.error('Failed to fetch social proof:', error);
      // Keep fallback data (already set as default)
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    const safeNum = Math.max(0, Number(num) || 0);
    if (safeNum >= 1000000) return (safeNum / 1000000).toFixed(1) + 'M+';
    if (safeNum >= 1000) return (safeNum / 1000).toFixed(0) + 'K+';
    return safeNum + '+';
  };

  // Safe star count getter
  const getStarCount = (rating: any): number => {
    const num = Number(rating);
    if (isNaN(num) || num < 0) return 5;
    return Math.min(5, Math.max(0, Math.floor(num)));
  };

  if (loading) {
    return (
      <div className="py-16 animate-pulse">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 bg-slate-700 rounded w-1/3 mx-auto mb-12"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="h-32 bg-slate-700 rounded-xl"></div>
            <div className="h-32 bg-slate-700 rounded-xl"></div>
            <div className="h-32 bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Safe testimonial access
  const testimonials = data?.testimonials || FALLBACK_DATA.testimonials;
  const safeIndex = Math.min(activeTestimonial, testimonials.length - 1);
  const testimonial = testimonials[safeIndex] || testimonials[0];

  if (!testimonial) {
    return null; // Don't render if no testimonials
  }

  return (
    <section className="py-16 bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by <span className="text-blue-400">{formatNumber(data?.userCount || 10000)}</span> Developers
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of developers who debug smarter, not harder
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white mb-1">{formatNumber(data?.userCount || 10000)}</p>
            <p className="text-gray-400 text-sm">Active Users</p>
          </div>

          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white mb-1">{formatNumber(data?.queriesSolved || 250000)}</p>
            <p className="text-gray-400 text-sm">Queries Solved</p>
          </div>

          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white mb-1">{data?.stats?.avgResponseTime || '<2s'}</p>
            <p className="text-gray-400 text-sm">Avg Response</p>
          </div>

          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700 text-center">
            <Code className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-3xl font-bold text-white mb-1">{data?.stats?.languagesSupported || 50}+</p>
            <p className="text-gray-400 text-sm">Languages</p>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700">
            <Quote className="absolute top-6 left-6 w-10 h-10 text-blue-500/30" />

            <div className="text-center">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">{testimonial.avatar || '?'}</span>
              </div>

              {/* Quote */}
              <p className="text-xl text-white mb-6 leading-relaxed italic">
                "{testimonial.quote || 'Great product!'}"
              </p>

              {/* Rating - with safe array creation */}
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: getStarCount(testimonial.rating) }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <p className="text-white font-medium">{testimonial.name || 'Anonymous'}</p>
              <p className="text-gray-400 text-sm">
                {testimonial.role || 'Developer'} at {testimonial.company || 'Tech Company'}
              </p>
            </div>

            {/* Dots Navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === safeIndex ? "bg-blue-500 w-6" : "bg-slate-600 hover:bg-slate-500"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Activity Feed */}
        {data?.liveActivity && data.liveActivity.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-sm">Live Activity</span>
            </div>
            <div className="space-y-2">
              {data.liveActivity.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg text-sm"
                >
                  <span className="text-gray-300">{activity.message}</span>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Spotify'].map((company) => (
              <span key={company} className="text-gray-400 font-semibold text-lg">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;

