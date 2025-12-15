import React, { useState } from 'react';
import { useSupportContact, type SupportContactInfo, getResponseTimeByTier, getFormattedSupportHours } from '../hooks/useSupportContact';
import { Mail, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Button } from '../components/UI';
import axios from 'axios';

interface SupportPageProps {
  userTier?: string;
}

const SupportPage: React.FC<SupportPageProps> = ({ userTier = 'free' }) => {
  const { data: supportInfo, loading, error } = useSupportContact();
  const [activeTab, setActiveTab] = useState<'contact' | 'faq' | 'status'>('contact');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    description: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await axios.post('/api/support/contact', {
        ...ticketForm,
        userTier,
      });

      if (response.data.success) {
        setSubmitSuccess(true);
        setTicketForm({
          subject: '',
          category: 'general',
          description: '',
          email: '',
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to submit support ticket';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading support information...</p>
        </div>
      </div>
    );
  }

  if (error || !supportInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6">
        <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-2">Unable to Load Support Information</h3>
            <p className="text-gray-300 mb-4">{error?.message || 'Please try again later.'}</p>
            <p className="text-gray-400 text-sm">
              For immediate assistance, email us at{' '}
              <a href="mailto:hi@getgingee.com" className="text-cyan-400 hover:underline">
                hi@getgingee.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const responseTime = getResponseTimeByTier(supportInfo.responseTimes, userTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <div className="px-4 py-12 lg:px-8 bg-gradient-to-b from-blue-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-lg text-gray-300">
            We're here to help. Get answers quickly and efficiently.
          </p>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* SLA Banner */}
          <div className="mb-12 p-6 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Support SLA</h3>
                <p className="text-gray-300">
                  As a <span className="font-semibold text-cyan-400 capitalize">{userTier}</span> user,
                  we guarantee a response to your support tickets within{' '}
                  <span className="font-semibold text-cyan-400">{responseTime}</span>.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {supportInfo.supportHours && getFormattedSupportHours(supportInfo.supportHours)}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-4 border-b border-white/20">
            {(['contact', 'faq', 'status'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'contact' && 'Contact Us'}
                {tab === 'faq' && 'FAQ'}
                {tab === 'status' && 'Status'}
              </button>
            ))}
          </div>

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Quick Contact Methods */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-xl font-semibold mb-6">Quick Contact</h3>

                {/* Email */}
                <a
                  href={`mailto:${supportInfo.supportEmail}`}
                  className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span className="font-semibold">Email</span>
                  </div>
                  <p className="text-gray-300 text-sm">{supportInfo.supportEmail}</p>
                  <p className="text-xs text-gray-400 mt-2">Typical response: {responseTime}</p>
                </a>

                {/* Help Resources */}
                {supportInfo.helpResources && supportInfo.helpResources.length > 0 && (
                  <div className="pt-4 mt-8 border-t border-white/20">
                    <h4 className="font-semibold mb-3">Help Resources</h4>
                    <ul className="space-y-2">
                      {supportInfo.helpResources.map((resource, idx) => (
                        <li key={idx}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-2 group"
                          >
                            <span>{resource.title}</span>
                            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Ticket Form */}
              <form onSubmit={handleTicketSubmit} className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Create Support Ticket</h3>

                  {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-400 font-semibold">Ticket Submitted Successfully!</p>
                        <p className="text-green-300/80 text-sm">
                          We'll get back to you within {responseTime}.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-400">{submitError}</p>
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={ticketForm.category}
                        onChange={(e) =>
                          setTicketForm({ ...ticketForm, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                      >
                        {supportInfo.categories.map((cat) => (
                          <option key={cat.name} value={cat.name.toLowerCase()}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        required
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                        placeholder="Brief description of your issue"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        required
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                        placeholder="Please provide as much detail as possible so we can assist you better..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Ticket'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <details className="group p-6 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                  <summary className="font-semibold text-white flex items-center justify-between">
                    How quickly will I get a response?
                    <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-300">
                    As a {userTier} user, our SLA guarantees a response within {responseTime}.
                  </p>
                </details>

                <details className="group p-6 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                  <summary className="font-semibold text-white flex items-center justify-between">
                    What are your support hours?
                    <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-300 whitespace-pre-wrap">
                    {supportInfo.supportHours && getFormattedSupportHours(supportInfo.supportHours)}
                  </p>
                </details>

                <details className="group p-6 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-all">
                  <summary className="font-semibold text-white flex items-center justify-between">
                    How do I upgrade my plan?
                    <span className="text-cyan-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-300">
                    You can upgrade your plan at any time from your account settings. New features will be available
                    immediately after upgrade.
                  </p>
                </details>
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <div className="max-w-3xl">
              <h3 className="text-2xl font-semibold mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="font-semibold text-white">All Systems Operational</p>
                    <p className="text-sm text-gray-300">All services are running normally</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
