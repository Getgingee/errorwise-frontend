import React from 'react';
import { X, Package, Users, Briefcase, Mail, HelpCircle, MessageSquare, ThumbsUp, Activity, BookOpen } from 'lucide-react';

interface InfoPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: 'integrations' | 'about' | 'blog' | 'careers' | 'contact' | 'help' | 'community' | 'feedback' | 'status';
}

const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ isOpen, onClose, page }) => {
  if (!isOpen) return null;

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
              <div className="text-3xl font-bold text-blue-300 dark:text-blue-400 mb-2">50K+</div>
              <div className="text-sm text-gray-200">Active Developers</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1M+</div>
              <div className="text-sm text-gray-200">Errors Analyzed</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-green-500/20 to-cyan-400/20 backdrop-blur-md border border-green-500/30 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
              <div className="text-sm text-gray-200">Accuracy Rate</div>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h4 className="font-bold text-white mb-3">Our Values</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                <span className="text-gray-200"><strong>Developer First:</strong> Built by developers, for developers</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                <span className="text-gray-200"><strong>Privacy Focused:</strong> Your code is yours, we never store it permanently</span>
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
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
          <p className="text-gray-200">
            Stay updated with the latest debugging tips, AI insights, and product updates.
          </p>

          <div className="space-y-4">
            {[
              {
                title: 'Introducing Multi-Model AI Analysis',
                date: 'Oct 28, 2024',
                excerpt: 'We\'re excited to announce our new multi-model approach that combines GPT-4, Claude, and Gemini for even better accuracy...',
                category: 'Product Update'
              },
              {
                title: '10 Common JavaScript Errors and How to Fix Them',
                date: 'Oct 15, 2024',
                excerpt: 'Learn about the most common JavaScript errors developers encounter and how to resolve them quickly...',
                category: 'Tutorial'
              },
              {
                title: 'The Future of AI-Powered Debugging',
                date: 'Oct 1, 2024',
                excerpt: 'Exploring how artificial intelligence is revolutionizing the way developers debug their applications...',
                category: 'Insights'
              },
            ].map((post, idx) => (
              <div key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm text-xs font-semibold rounded">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                </div>
                <h4 className="font-bold text-white mb-2">{post.title}</h4>
                <p className="text-sm text-gray-200">{post.excerpt}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 transition-colors">
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
            <p className="text-gray-200">
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
                        <span className="text-sm text-gray-200">{job.location}</span>
                        <span className="text-sm text-gray-200">• {job.type}</span>
                      </div>
                    </div>
                    <span className="text-blue-300 dark:text-blue-400 text-sm font-medium">Apply →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
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
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></span>
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
              <a href="mailto:support@errorwise.com" className="text-blue-300 dark:text-blue-400 hover:underline">
                support@errorwise.com
              </a>
              <p className="text-sm text-gray-200 mt-2">Response within 24 hours</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-md border border-purple-500/30 rounded-xl">
              <Briefcase className="text-purple-600 mb-3" size={32} />
              <h4 className="font-bold text-white mb-2">Sales Inquiries</h4>
              <a href="mailto:sales@errorwise.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                sales@errorwise.com
              </a>
              <p className="text-sm text-gray-200 mt-2">For Enterprise plans</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h4 className="font-bold text-white mb-4">Send us a message</h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Send Message
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
              className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <HelpCircle className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Popular Topics</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Getting Started',
                'API Integration',
                'Billing & Subscriptions',
                'Troubleshooting',
                'Security & Privacy',
                'Account Management',
              ].map((topic, idx) => (
                <div key={idx} className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:border-blue-600 dark:hover:border-blue-400 transition-colors cursor-pointer">
                  <span className="text-white font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-white mb-2">Can't find what you're looking for?</h4>
            <p className="text-gray-200 mb-3">
              Our support team is here to help. Contact us at support@errorwise.com
            </p>
            <button className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
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
          <p className="text-gray-200">
            Connect with other developers, share knowledge, and get help from the ErrorWise community.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: 'Discord', members: '15K+ members', desc: 'Chat with developers in real-time', color: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20' },
              { name: 'GitHub Discussions', members: '8K+ discussions', desc: 'Ask questions and share solutions', color: 'from-gray-50 to-gray-100 dark:from-gray-700' },
              { name: 'Twitter', members: '25K+ followers', desc: 'Latest updates and tips', color: 'from-blue-50 to-blue-100 dark:from-blue-900/20' },
              { name: 'Reddit', members: '5K+ members', desc: 'Community forum and discussions', color: 'from-orange-50 to-orange-100 dark:from-orange-900/20' },
            ].map((platform, idx) => (
              <div key={idx} className={`p-6 bg-gradient-to-br ${platform.color} rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow cursor-pointer`}>
                <h4 className="font-bold text-white mb-1">{platform.name}</h4>
                <p className="text-sm font-medium text-gray-200 mb-2">{platform.members}</p>
                <p className="text-sm text-gray-300 dark:text-gray-400">{platform.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-white mb-2">Community Guidelines</h4>
            <ul className="space-y-2 text-sm text-gray-200">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                Be respectful and professional
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                Help others and share knowledge
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 mt-2"></span>
                No spam or self-promotion
              </li>
            </ul>
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
          <p className="text-gray-200">
            Your feedback helps us build a better product. Let us know what you think!
          </p>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h4 className="font-bold text-white mb-4">Submit Feedback</h4>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Feedback Type
                </label>
                <select 
                  aria-label="Feedback Type"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>General Feedback</option>
                  <option>Improvement Suggestion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Your Feedback
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Tell us what you think..."
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-300 dark:text-blue-400 mb-1">500+</div>
              <div className="text-sm text-gray-200">Features Requested</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">150+</div>
              <div className="text-sm text-gray-200">Implemented</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">95%</div>
              <div className="text-sm text-gray-200">Satisfaction Rate</div>
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
                      <span className="text-sm text-gray-200">{service.uptime} uptime</span>
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
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-white"
              />
              <button className="px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      ),
    },
  };

  const currentPage = pageContent[page];
  const Icon = currentPage.icon;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <Icon size={32} />
            <div>
              <h2 className="text-3xl font-bold">{currentPage.title}</h2>
              <p className="text-blue-100 mt-1">{currentPage.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={`Close ${currentPage.title} modal`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentPage.content}
        </div>
      </div>
    </div>
  );
};

export default InfoPagesModal;
