import React, { useState, useEffect } from 'react';
import { X, Package, Users, Briefcase, Mail, HelpCircle, MessageSquare, ThumbsUp, Activity, BookOpen } from 'lucide-react';
import { supportService, type FeedbackData, type ContactMessageData } from '../../services/supportService';
import { newsletterService } from '../../services/newsletterService';
import { trackFeedbackSubmit, trackContactSubmit, trackModalOpen } from '../../services/analytics';
import { contentService } from '../../services/contentService';
import type { PrivacyPolicyContent, TermsOfServiceContent, AboutContent, CommunityContent } from '../../services/contentService';

interface InfoPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: 'integrations' | 'about' | 'blog' | 'careers' | 'contact' | 'help' | 'community' | 'feedback' | 'status' | 'privacy' | 'terms';
}

const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ isOpen, onClose, page }) => {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackData>({
    feedback_type: 'general_feedback',
    message: '',
    email: '',
    name: ''
  });
  const [contactForm, setContactForm] = useState<ContactMessageData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    message_type: 'general'
  });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // Dynamic content from backend
  const [dynamicContent, setDynamicContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

  // Fetch dynamic content from backend when modal opens
  useEffect(() => {
    const loadDynamicContent = async () => {
      // Only fetch for pages that use backend API
      if (!isOpen || !['privacy', 'terms', 'about', 'community'].includes(page)) {
        return;
      }

      setLoadingContent(true);
      setContentError(null);

      try {
        console.log('🔄 Fetching', page, 'content from backend...');
        const data = await contentService.getPageContent(page as any);
        console.log('✅ Loaded', page, 'content:', data);
        setDynamicContent(data);
      } catch (error) {
        console.error('❌ Failed to load', page, 'content:', error);
        setContentError('Failed to load content. Using cached version.');
        // Keep using hardcoded fallback content
      } finally {
        setLoadingContent(false);
      }
    };

    loadDynamicContent();
  }, [isOpen, page]);

  // Early return if modal is not open
  if (!isOpen) return null;

  console.log('🎨 InfoPagesModal rendering, page:', page, 'isOpen:', isOpen);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const result = await supportService.submitFeedback(feedbackForm);
      console.log('✅ Feedback submitted:', result);
      
      // Track successful feedback submission
      trackFeedbackSubmit(feedbackForm.feedback_type);
      setSubmitSuccess(true);
      setFeedbackForm({ 
        feedback_type: 'general_feedback', 
        message: '',
        email: '',
        name: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Feedback submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const result = await supportService.submitContactMessage(contactForm);
      console.log('✅ Contact message submitted:', result);
      
      // Track successful contact submission
      trackContactSubmit(contactForm.message_type);
      setSubmitSuccess(true);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        message_type: 'general'
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Contact submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const result = await newsletterService.subscribe({
        email: newsletterEmail,
        name: newsletterName || undefined,
        subscription_type: 'all',
        source: 'modal'
      });
      console.log('✅ Newsletter subscription:', result);
      
      setSubmitSuccess(true);
      setNewsletterEmail('');
      setNewsletterName('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Newsletter subscription error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setSubmitting(false);
    }
  };

  // Track modal open
  React.useEffect(() => {
    if (isOpen) {
      trackModalOpen(page);
    }
  }, [isOpen, page]);

  // Helper function to render dynamic privacy policy from backend
  const renderDynamicPrivacy = (data: PrivacyPolicyContent) => {
    return (
      <div className="space-y-6 text-gray-200">
        <div className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
          <p className="text-sm">
            <strong>Last Updated:</strong> {data.lastUpdated}
          </p>
        </div>
        <div className="space-y-4">
          {data.sections.map((section, index) => (
            <section key={index}>
              <h4 className="font-bold text-white text-lg mb-3">{section.heading}</h4>
              <div className="text-sm whitespace-pre-line">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render dynamic terms of service from backend
  const renderDynamicTerms = (data: TermsOfServiceContent) => {
    return (
      <div className="space-y-6 text-gray-200">
        <div className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
          <p className="text-sm">
            <strong>Last Updated:</strong> {data.lastUpdated}
          </p>
        </div>
        <div className="space-y-4">
          {data.sections.map((section, index) => (
            <section key={index}>
              <h4 className="font-bold text-white text-lg mb-3">{section.heading}</h4>
              <div className="text-sm whitespace-pre-line">{section.content}</div>
            </section>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render dynamic about content from backend
  const renderDynamicAbout = (data: AboutContent) => {
    return (
      <div className="space-y-6 text-gray-200">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-sm leading-relaxed">{data.mission}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-4">By the Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.stats.map((stat, index) => (
              <div key={index} className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
                <div className="text-3xl font-bold text-cyan-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.values.map((value, index) => (
              <div key={index} className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-white mb-2">{value.title}</h4>
                <p className="text-sm text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render dynamic community content from backend
  const renderDynamicCommunity = (data: CommunityContent) => {
    return (
      <div className="space-y-6 text-gray-200">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Join Our Community</h3>
          <p className="text-sm">Connect with developers worldwide who use ErrorWise</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Our Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.platforms.map((platform, index) => (
              <div key={index} className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
                <h4 className="font-bold text-white text-lg mb-2">{platform.name}</h4>
                <p className="text-sm text-gray-300 mb-2">{platform.description}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-3">
                  <span>👥 {platform.members}</span>
                  <span>📊 {platform.activity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Community Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.channels.map((channel, index) => (
              <div key={index} className="p-3 bg-blue-500/5 backdrop-blur-sm rounded-lg border border-blue-500/20">
                <h4 className="font-bold text-cyan-400 text-sm mb-1">{channel.name}</h4>
                <p className="text-xs text-gray-400">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-cyan-500/10 backdrop-blur-sm rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-bold text-white mb-3">Community Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{data.stats.totalMembers}</div>
              <div className="text-xs text-gray-400">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{data.stats.activeContributors}</div>
              <div className="text-xs text-gray-400">Active Contributors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{data.stats.monthlyMessages}</div>
              <div className="text-xs text-gray-400">Monthly Messages</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pageContent = {
    integrations: {
      title: 'Integrations',
      subtitle: 'Connect ErrorWise with your favorite tools',
      icon: Package,
      content: (
        <div className="space-y-6">
          <p className="text-gray-200">
            ErrorWise seamlessly integrates with the tools you already use, making error debugging a natural part of your workflow.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'VS Code', desc: 'Analyze errors directly in your editor', status: 'Available' },
              { name: 'GitHub', desc: 'Auto-analyze errors in pull requests', status: 'Available' },
              { name: 'Slack', desc: 'Get error notifications in Slack', status: 'Available' },
              { name: 'Jira', desc: 'Create tickets from error analyses', status: 'Available' },
              { name: 'Sentry', desc: 'Import errors from Sentry', status: 'Coming Soon' },
              { name: 'Datadog', desc: 'Connect with your monitoring', status: 'Coming Soon' },
            ].map((integration, idx) => (
              <div key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{integration.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    integration.status === 'Available' 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30 backdrop-blur-sm'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm'
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-sm text-gray-200">{integration.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
            <p className="text-sm text-gray-200">
              <strong>Custom Integration?</strong> Contact our team to discuss custom integrations for your enterprise needs.
            </p>
          </div>
        </div>
      ),
    },
    about: {
      title: 'About ErrorWise',
      subtitle: 'Our mission to simplify debugging for developers',
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-200">
              ErrorWise was founded in 2024 with a simple mission: make debugging faster and less frustrating for developers everywhere.
            </p>
            <p className="text-gray-200">
              We believe that developers should spend their time building amazing products, not deciphering cryptic error messages. 
              Our AI-powered platform analyzes errors in seconds and provides clear, actionable solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-md border border-blue-500/30 rounded-xl">
              <div className="text-3xl font-bold text-blue-300 mb-2">50K+</div>
              <div className="text-sm text-gray-200">Active Developers</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl">
              <div className="text-3xl font-bold text-purple-400 mb-2">1M+</div>
              <div className="text-sm text-gray-200">Errors Analyzed</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-cyan-400/20 backdrop-blur-md border border-green-500/30 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-sm text-gray-200">Accuracy Rate</div>
            </div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
            <h4 className="font-bold text-white mb-3">Our Values</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-cyan-500/50 rounded-full mr-3 mt-2"></span>
                <span className="text-gray-200"><strong>Developer First:</strong> Built by developers, for developers</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-cyan-500/50 rounded-full mr-3 mt-2"></span>
                <span className="text-gray-200"><strong>Privacy Focused:</strong> Your code is yours, we never store it permanently</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-cyan-500/50 rounded-full mr-3 mt-2"></span>
                <span className="text-gray-200"><strong>Continuous Innovation:</strong> Always improving our AI models</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    blog: {
      title: 'Blog',
      subtitle: 'Latest updates and insights from ErrorWise',
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <p className="text-gray-300">
            Stay updated with the latest debugging tips, AI insights, and product updates.
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Introducing Multi-Model AI Analysis',
                date: 'Oct 28, 2024',
                excerpt: 'We\'re excited to announce our new multi-model approach that combines GPT-4, Claude, and Gemini for even better accuracy...',
                category: 'Product Update',
                link: '#'
              },
              {
                title: '10 Common JavaScript Errors and How to Fix Them',
                date: 'Oct 15, 2024',
                excerpt: 'Learn about the most common JavaScript errors developers encounter and how to resolve them quickly...',
                category: 'Tutorial',
                link: '#'
              },
              {
                title: 'The Future of AI-Powered Debugging',
                date: 'Oct 1, 2024',
                excerpt: 'Exploring how artificial intelligence is revolutionizing the way developers debug their applications...',
                category: 'Insights',
                link: '#'
              },
            ].map((post, idx) => (
              <a
                key={idx}
                href={post.link}
                onClick={(e) => {
                  e.preventDefault();
                  alert('Blog feature coming soon! Full blog posts will be available in the next update.');
                }}
                className="block p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm text-xs font-semibold rounded">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-300">{post.date}</span>
                </div>
                <h4 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{post.title}</h4>
                <p className="text-sm text-gray-300">{post.excerpt}</p>
                <div className="mt-3 text-cyan-400 text-sm font-medium flex items-center gap-1">
                  Read more <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <button 
              onClick={() => alert('Full blog feature coming soon! We\'re working on bringing you comprehensive articles, tutorials, and insights.')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Posts →
            </button>
          </div>
        </div>
      ),
    },
    careers: {
      title: 'Careers',
      subtitle: 'Join our team and help developers debug better',
      icon: Briefcase,
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-gray-300">
              We're building the future of debugging. Join a team of passionate developers, AI researchers, and product designers.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Open Positions</h4>
            <div className="space-y-3">
              {[
                { title: 'Senior Full Stack Engineer', location: 'Remote', type: 'Full-time' },
                { title: 'ML Engineer - NLP', location: 'San Francisco / Remote', type: 'Full-time' },
                { title: 'Product Designer', location: 'Remote', type: 'Full-time' },
                { title: 'Developer Advocate', location: 'Remote', type: 'Full-time' },
              ].map((job, idx) => (
                <div key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-white">{job.title}</h5>
                      <div className="flex gap-3 mt-1">
                        <span className="text-sm text-gray-300">{job.location}</span>
                        <span className="text-sm text-gray-300">• {job.type}</span>
                      </div>
                    </div>
                    <span className="text-blue-300 text-blue-300 text-sm font-medium">Apply →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
            <h4 className="font-bold text-white mb-3">Why Join ErrorWise?</h4>
            <ul className="space-y-2">
              {[
                'Competitive salary and equity',
                'Flexible remote work',
                'Health, dental, and vision insurance',
                'Unlimited PTO',
                'Latest tech and tools',
                'Learning & development budget',
              ].map((benefit, idx) => (
                <li key={idx} className="flex items-center text-gray-200">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-cyan-500/50 rounded-full mr-3"></span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
    contact: {
      title: 'Contact Us',
      subtitle: 'Get in touch with our team',
      icon: Mail,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-md border border-blue-500/30 rounded-xl">
              <Mail className="text-blue-300 mb-3" size={32} />
              <h4 className="font-bold text-white mb-2">Email Support</h4>
              <a href="mailto:hi@getgingee.com" className="text-blue-300 text-blue-300 hover:underline">
                hi@getgingee.com
              </a>
              <p className="text-sm text-gray-200 mt-2">Response within 24 hours</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl">
              <Briefcase className="text-purple-600 mb-3" size={32} />
              <h4 className="font-bold text-white mb-2">Sales Inquiries</h4>
              <a href="mailto:sales@errorwise.com" className="text-purple-600 text-purple-400 hover:underline">
                sales@errorwise.com
              </a>
              <p className="text-sm text-gray-200 mt-2">For Enterprise plans</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
            <h4 className="font-bold text-white mb-4">Send us a message</h4>
            
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                ✓ Message sent successfully! We'll get back to you soon.
              </div>
            )}
            
            {submitError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {submitError}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Your name"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Subject (Optional)</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="What is this about?"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="How can we help you?"
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      ),
    },
    help: {
      title: 'Help Center',
      subtitle: 'Find answers to common questions',
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <HelpCircle className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">📚 Getting Started</h4>
            <div className="space-y-3">
              {[
                {
                  q: 'How do I analyze my first error?',
                  a: 'Simply paste your error message or stack trace into the analysis box. Our AI will automatically detect the language, framework, and provide detailed solutions with code examples.'
                },
                {
                  q: 'What programming languages are supported?',
                  a: 'ErrorWise supports 50+ languages including JavaScript, Python, Java, C#, Go, Rust, PHP, Ruby, and more. Our AI adapts to your specific technology stack.'
                },
                {
                  q: 'How does the free tier work?',
                  a: 'The free tier includes 10 error analyses per month, basic AI models, and community support. Perfect for getting started and small projects.'
                }
              ].map((item, idx) => (
                <details key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                  <summary className="text-white font-medium list-none cursor-pointer flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <p className="text-gray-300 text-sm mt-3 pl-2 border-l-2 border-cyan-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">🔧 Troubleshooting</h4>
            <div className="space-y-3">
              {[
                {
                  q: 'Why is my analysis taking too long?',
                  a: 'Large stack traces (>5000 characters) may take 10-15 seconds. Try breaking down your error into smaller chunks or ensure you have a stable internet connection.'
                },
                {
                  q: 'The suggested fix didn\'t work. What should I do?',
                  a: 'Try the alternative solutions provided below the main fix. You can also click "Regenerate" to get a fresh analysis with different AI models.'
                },
                {
                  q: 'Can I save my analyses for later?',
                  a: 'Yes! All analyses are automatically saved to your dashboard. You can access them anytime, add notes, and mark them as resolved.'
                }
              ].map((item, idx) => (
                <details key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                  <summary className="text-white font-medium list-none cursor-pointer flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <p className="text-gray-300 text-sm mt-3 pl-2 border-l-2 border-cyan-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">💳 Billing & Subscriptions</h4>
            <div className="space-y-3">
              {[
                {
                  q: 'Can I upgrade or downgrade my plan anytime?',
                  a: 'Yes! You can change your plan at any time from your account settings. Upgrades are immediate, downgrades take effect at the end of your billing cycle.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe.'
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 30-day money-back guarantee for annual plans. Monthly plans are non-refundable but you can cancel anytime to stop future charges.'
                }
              ].map((item, idx) => (
                <details key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                  <summary className="text-white font-medium list-none cursor-pointer flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <p className="text-gray-300 text-sm mt-3 pl-2 border-l-2 border-cyan-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">🔐 Security & Privacy</h4>
            <div className="space-y-3">
              {[
                {
                  q: 'Is my code secure?',
                  a: 'Yes! All code is encrypted in transit (TLS/SSL) and at rest. We never store your source code permanently - only anonymized error patterns for AI training.'
                },
                {
                  q: 'Do you share my data with third parties?',
                  a: 'We only share error data with AI providers (OpenAI, Anthropic, Google) for analysis. Your data is never sold or shared for marketing purposes. See our Privacy Policy for details.'
                },
                {
                  q: 'Can I delete my data?',
                  a: 'Absolutely! You can delete individual analyses or your entire account anytime from Settings. Data deletion is permanent and GDPR/CCPA compliant.'
                }
              ].map((item, idx) => (
                <details key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                  <summary className="text-white font-medium list-none cursor-pointer flex items-center justify-between">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 group-open:rotate-90 transition-transform">▶</span>
                  </summary>
                  <p className="text-gray-300 text-sm mt-3 pl-2 border-l-2 border-cyan-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30">
            <h4 className="font-bold text-white mb-2">Still need help?</h4>
            <p className="text-gray-300 mb-4 text-sm">
              Our support team is available 24/7 to assist you. Average response time: 2 hours.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => window.location.href = 'mailto:hi@getgingee.com'}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                📧 Email Support
              </button>
              <button 
                onClick={() => alert('Live chat feature coming soon!')}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
              >
                💬 Live Chat
              </button>
            </div>
          </div>
        </div>
      ),
    },
    community: {
      title: 'Community',
      subtitle: 'Join thousands of developers',
      icon: MessageSquare,
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl border border-blue-500/30">
            <h4 className="font-bold text-white text-xl mb-2">🌍 Join 50,000+ Developers Worldwide</h4>
            <p className="text-gray-300 text-sm">
              Connect with developers solving real-world problems. Share solutions, learn from experts, and stay updated with the latest debugging techniques.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">💬 Community Platforms</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { 
                  name: '💙 Discord Server', 
                  members: '15,000+ active members', 
                  desc: 'Real-time chat, voice channels, and dedicated help channels for each programming language',
                  link: 'https://discord.gg/errorwise',
                  activity: '~500 messages/day'
                },
                { 
                  name: '🐙 GitHub Discussions', 
                  members: '8,000+ discussions', 
                  desc: 'In-depth technical discussions, feature requests, and open-source contributions',
                  link: 'https://github.com/errorwise/community',
                  activity: 'Highly technical'
                },
                { 
                  name: '🐦 Twitter Community', 
                  members: '25,000+ followers', 
                  desc: 'Latest updates, tips & tricks, debugging challenges, and AI announcements',
                  link: 'https://twitter.com/errorwise',
                  activity: 'Daily tips'
                },
                { 
                  name: '🔴 Reddit Community', 
                  members: '5,000+ members', 
                  desc: 'Community forum for long-form discussions, success stories, and debugging guides',
                  link: 'https://reddit.com/r/errorwise',
                  activity: '~50 posts/week'
                },
              ].map((platform, idx) => (
                <div 
                  key={idx} 
                  onClick={() => alert(`🔗 Visit ${platform.name} at: ${platform.link}\n\n(Links will be activated in production)`)}
                  className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">{platform.name}</h4>
                    <span className="text-xs px-2 py-1 bg-cyan-400/20 text-cyan-300 rounded-full">{platform.activity}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-300 mb-2">{platform.members}</p>
                  <p className="text-sm text-gray-400">{platform.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">🏆 Community Highlights</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { emoji: '📊', stat: '1M+', label: 'Errors Solved Together' },
                { emoji: '⭐', stat: '50K+', label: 'GitHub Stars' },
                { emoji: '🌟', stat: '200+', label: 'Active Contributors' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg border border-cyan-400/30 text-center">
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div className="text-2xl font-bold text-white mb-1">{item.stat}</div>
                  <div className="text-sm text-gray-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-lg mb-4">🎯 Popular Channels & Topics</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { channel: '#javascript-help', desc: 'React, Node.js, TypeScript troubleshooting' },
                { channel: '#python-debugging', desc: 'Django, Flask, async/await issues' },
                { channel: '#backend-warriors', desc: 'Database errors, API issues, performance' },
                { channel: '#show-and-tell', desc: 'Share your solved errors and solutions' },
                { channel: '#ai-discussions', desc: 'How AI analyzes your errors' },
                { channel: '#feature-requests', desc: 'Suggest improvements and vote' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-purple-400/30 transition-all">
                  <div className="font-mono text-sm text-cyan-400 mb-1">{item.channel}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl">
            <h4 className="font-bold text-white mb-3">📜 Community Guidelines</h4>
            <div className="space-y-2 text-sm text-gray-200">
              {[
                { emoji: '🤝', text: 'Be respectful and professional - we\'re all here to learn' },
                { emoji: '💡', text: 'Help others and share knowledge - today you, tomorrow me' },
                { emoji: '🚫', text: 'No spam, self-promotion, or job postings without permission' },
                { emoji: '🔍', text: 'Search before asking - your question may already be answered' },
                { emoji: '💬', text: 'Provide context when asking for help (error messages, code snippets)' },
                { emoji: '🎉', text: 'Celebrate wins and share success stories!' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="text-lg mr-3 mt-0.5">{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30">
            <h4 className="font-bold text-white mb-2">🚀 Ready to join?</h4>
            <p className="text-gray-300 text-sm mb-4">
              Pick your favorite platform and introduce yourself! Our community managers and members are super friendly.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => alert('Discord link: https://discord.gg/errorwise\n(Will open in production)')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                💙 Join Discord
              </button>
              <button 
                onClick={() => alert('GitHub link: https://github.com/errorwise/community\n(Will open in production)')}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                🐙 GitHub Discussions
              </button>
            </div>
          </div>
        </div>
      ),
    },
    feedback: {
      title: 'Feedback',
      subtitle: 'Help us improve ErrorWise',
      icon: ThumbsUp,
      content: (
        <div className="space-y-6">
          <p className="text-gray-300">
            Your feedback helps us build a better product. Let us know what you think!
          </p>

          <div className="p-6 bg-gray-50 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl">
            <h4 className="font-bold text-white mb-4">Submit Feedback</h4>
            
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
                ✓ Thank you for your feedback! We appreciate your input.
              </div>
            )}
            
            {submitError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {submitError}
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Feedback Type
                </label>
                <select 
                  value={feedbackForm.feedback_type}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback_type: e.target.value as FeedbackData['feedback_type'] })}
                  aria-label="Feedback Type"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  disabled={submitting}
                >
                  <option value="feature_request">Feature Request</option>
                  <option value="bug_report">Bug Report</option>
                  <option value="general_feedback">General Feedback</option>
                  <option value="improvement_suggestion">Improvement Suggestion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Your Feedback
                </label>
                <textarea
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Tell us what you think..."
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting || !feedbackForm.message.trim()}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-300 text-blue-300 mb-1">500+</div>
              <div className="text-sm text-gray-300">Features Requested</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 text-green-400 mb-1">150+</div>
              <div className="text-sm text-gray-300">Implemented</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 text-purple-400 mb-1">95%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      ),
    },
    status: {
      title: 'System Status',
      subtitle: 'Real-time status of ErrorWise services',
      icon: Activity,
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            <div>
              <p className="font-bold text-green-900 dark:text-green-100">All Systems Operational</p>
              <p className="text-sm text-green-700 dark:text-green-300">Last updated: Just now</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Services</h4>
            <div className="space-y-3">
              {[
                { name: 'API', status: 'Operational', uptime: '99.99%' },
                { name: 'Web Application', status: 'Operational', uptime: '99.98%' },
                { name: 'AI Analysis Engine', status: 'Operational', uptime: '99.95%' },
                { name: 'Authentication Service', status: 'Operational', uptime: '99.99%' },
                { name: 'Database', status: 'Operational', uptime: '100%' },
              ].map((service, idx) => (
                <div key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium text-white">{service.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-300">{service.uptime} uptime</span>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-semibold rounded">
                        {service.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-white mb-2">Subscribe to Updates</h4>
            <p className="text-sm text-gray-200 mb-3">
              Get notified about service incidents and scheduled maintenance.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white bg-white/5 backdrop-blur-sm border border-white/20 text-white"
              />
              <button className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      icon: HelpCircle,
      content: (
        <div className="space-y-6 text-gray-200">
          <div className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
            <p className="text-sm">
              <strong>Last Updated:</strong> November 3, 2025
            </p>
          </div>

          <div className="space-y-4">
            <section>
              <h4 className="font-bold text-white text-lg mb-3">1. Information We Collect</h4>
              <div className="space-y-2 text-sm">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, password</li>
                  <li><strong>Error Data:</strong> Stack traces, error messages, code snippets you analyze</li>
                  <li><strong>Usage Data:</strong> How you interact with our services</li>
                  <li><strong>Payment Information:</strong> Processed securely through our payment providers</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">2. How We Use Your Information</h4>
              <div className="space-y-2 text-sm">
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide, maintain, and improve our AI-powered debugging services</li>
                  <li>Process and complete transactions</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Train and improve our AI models (anonymized data only)</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">3. Data Security</h4>
              <p className="text-sm">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm mt-2">
                <li>End-to-end encryption for data in transit (TLS/SSL)</li>
                <li>Encrypted storage for sensitive data at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Limited employee access with strict authentication</li>
                <li>GDPR and CCPA compliant data handling</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">4. Data Sharing</h4>
              <p className="text-sm">
                We do not sell your personal information. We may share your data only with:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm mt-2">
                <li><strong>Service Providers:</strong> Third parties who assist in providing our services</li>
                <li><strong>AI Model Providers:</strong> OpenAI, Anthropic, Google (for error analysis only)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">5. Your Rights</h4>
              <div className="space-y-2 text-sm">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">6. Cookies and Tracking</h4>
              <p className="text-sm">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                and improve our services. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">7. Data Retention</h4>
              <p className="text-sm">
                We retain your data as long as your account is active or as needed to provide services. 
                You can request deletion at any time by contacting us at{' '}
                <a href="mailto:privacy@errorwise.com" className="text-cyan-400 hover:underline">
                  privacy@errorwise.com
                </a>
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">8. Children's Privacy</h4>
              <p className="text-sm">
                Our services are not intended for users under 13 years of age. We do not knowingly 
                collect personal information from children.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">9. Contact Us</h4>
              <p className="text-sm">
                For privacy-related questions or to exercise your rights, contact us at:{' '}
                <a href="mailto:privacy@errorwise.com" className="text-cyan-400 hover:underline">
                  privacy@errorwise.com
                </a>
              </p>
            </section>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Terms and conditions for using ErrorWise',
      icon: Briefcase,
      content: (
        <div className="space-y-6 text-gray-200">
          <div className="p-4 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-500/30">
            <p className="text-sm">
              <strong>Last Updated:</strong> November 3, 2025
            </p>
          </div>

          <div className="space-y-4">
            <section>
              <h4 className="font-bold text-white text-lg mb-3">1. Acceptance of Terms</h4>
              <p className="text-sm">
                By accessing or using ErrorWise ("Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">2. Description of Service</h4>
              <p className="text-sm mb-2">
                ErrorWise provides AI-powered debugging and error analysis services, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>Automated error detection and analysis</li>
                <li>AI-generated solutions and fixes</li>
                <li>Code suggestions and improvements</li>
                <li>Integration with development tools</li>
                <li>Team collaboration features</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">3. User Accounts</h4>
              <div className="space-y-2 text-sm">
                <p>When you create an account with us, you must:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Be at least 13 years of age</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">4. Acceptable Use</h4>
              <p className="text-sm mb-2">You agree NOT to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reverse engineer or decompile our software</li>
                <li>Use the service to harm, harass, or threaten others</li>
                <li>Resell or redistribute our services without permission</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">5. Subscription and Payment</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Free Tier:</strong> Limited features with usage caps</p>
                <p><strong>Paid Plans:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Billed monthly or annually</li>
                  <li>Automatic renewal unless cancelled</li>
                  <li>No refunds for partial months</li>
                  <li>Price changes with 30-day notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">6. Intellectual Property</h4>
              <p className="text-sm">
                The Service and its original content, features, and functionality are owned by ErrorWise 
                and protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-sm mt-2">
                <strong>Your Code:</strong> You retain all rights to code you submit. We only use it to 
                provide our services and improve our AI models (anonymized).
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">7. AI-Generated Content</h4>
              <p className="text-sm">
                Our AI provides suggestions and solutions based on your errors. While we strive for accuracy:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm mt-2">
                <li>Solutions may not always be correct or optimal</li>
                <li>You are responsible for reviewing and testing all code</li>
                <li>We are not liable for bugs introduced by suggested fixes</li>
                <li>AI responses should be verified before production use</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">8. Limitation of Liability</h4>
              <p className="text-sm">
                ErrorWise shall not be liable for any indirect, incidental, special, consequential, or 
                punitive damages resulting from your use or inability to use the service. Our total 
                liability is limited to the amount you paid in the last 12 months.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">9. Service Availability</h4>
              <p className="text-sm">
                We strive for 99.9% uptime but do not guarantee uninterrupted access. We may:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm mt-2">
                <li>Perform scheduled maintenance with notice</li>
                <li>Temporarily suspend service for updates</li>
                <li>Modify or discontinue features with notice</li>
              </ul>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">10. Termination</h4>
              <p className="text-sm">
                We may terminate or suspend your account immediately for violations of these Terms. 
                You may cancel your subscription at any time through your account settings.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">11. Changes to Terms</h4>
              <p className="text-sm">
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes via email or in-app notification. Continued use constitutes 
                acceptance of new terms.
              </p>
            </section>

            <section>
              <h4 className="font-bold text-white text-lg mb-3">12. Contact</h4>
              <p className="text-sm">
                For questions about these Terms, contact us at:{' '}
                <a href="mailto:legal@errorwise.com" className="text-cyan-400 hover:underline">
                  legal@errorwise.com
                </a>
              </p>
            </section>
          </div>
        </div>
      ),
    },
  };

  const currentPage = pageContent[page];
  
  // Safety check
  if (!currentPage) {
    console.error('❌ No page content found for:', page);
    return null;
  }
  
  const Icon = currentPage.icon;

  // Determine what content to render
  const renderContent = () => {
    // Show loading state for dynamic content pages
    if (loadingContent && ['privacy', 'terms', 'about', 'community'].includes(page)) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          <span className="ml-4 text-gray-300">Loading {page} content...</span>
        </div>
      );
    }

    // Use dynamic content if available (fetched from backend)
    if (dynamicContent) {
      if (page === 'privacy') {
        return renderDynamicPrivacy(dynamicContent);
      }
      if (page === 'terms') {
        return renderDynamicTerms(dynamicContent);
      }
      if (page === 'about') {
        return renderDynamicAbout(dynamicContent);
      }
      if (page === 'community') {
        return renderDynamicCommunity(dynamicContent);
      }
    }

    // Fall back to hardcoded content if API fails or for other pages
    return currentPage.content;
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-800 border-2 border-cyan-400 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md border-b-2 border-cyan-400/50 p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <Icon size={32} className="text-cyan-400" />
            <div>
              <h2 className="text-3xl font-bold text-white">{currentPage.title}</h2>
              <p className="text-cyan-300 mt-1">{currentPage.subtitle}</p>
              {contentError && (
                <p className="text-yellow-400 text-xs mt-1">⚠️ {contentError}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors text-white font-bold"
            aria-label={`Close ${currentPage.title} modal`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-800 text-white">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default InfoPagesModal;


