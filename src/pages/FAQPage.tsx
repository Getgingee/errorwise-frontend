import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Search, ArrowLeft, MessageCircle, Zap, CreditCard, Shield, Settings, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "What is ErrorWise?",
    answer: "ErrorWise is an AI-powered error analysis platform that helps developers and non-tech users understand and fix errors quickly. Simply paste your error message, and our AI provides clear explanations and step-by-step solutions in plain English."
  },
  {
    category: "Getting Started",
    question: "How do I use ErrorWise?",
    answer: "Just paste your error message into the input box on the dashboard and click 'Analyze'. Our AI will instantly provide an explanation of what went wrong and how to fix it. You can also ask follow-up questions for more clarity."
  },
  {
    category: "Getting Started",
    question: "Do I need coding experience to use ErrorWise?",
    answer: "Not at all! ErrorWise is designed for everyone - from complete beginners to experienced developers. We explain errors in simple, easy-to-understand language that anyone can follow."
  },
  {
    category: "Getting Started",
    question: "What types of errors can ErrorWise analyze?",
    answer: "ErrorWise can analyze virtually any error - from programming errors (JavaScript, Python, Java, C++, and 50+ languages) to system errors, network issues, application crashes, database errors, and even hardware error codes."
  },
  
  // Pricing & Plans
  {
    category: "Pricing & Plans",
    question: "Is ErrorWise free to use?",
    answer: "Yes! Our Free plan includes 50 queries per month, which is great for casual users and students. For unlimited queries and advanced features like follow-up questions and multiple AI models, check out our Pro and Team plans."
  },
  {
    category: "Pricing & Plans",
    question: "What's included in the Free plan?",
    answer: "The Free plan includes: 50 error queries per month, Basic AI analysis (Fast mode), Error history in your Library, Solution export, and Access to community solutions."
  },
  {
    category: "Pricing & Plans",
    question: "What's included in the Pro plan?",
    answer: "Pro plan (\/month) includes: Unlimited error queries, Follow-up questions (5 per conversation), Access to Smart & Fast AI models, Priority response times, Web scraping for solutions, Context memory for conversations, and Email support."
  },
  {
    category: "Pricing & Plans",
    question: "What's the difference between Pro and Team plans?",
    answer: "Team plan (\/month) includes everything in Pro, plus: Team collaboration features, Shared error library, Admin dashboard with analytics, Priority 24/7 support, Access to our most powerful Genius AI model, and Team video chat for debugging sessions."
  },
  {
    category: "Pricing & Plans",
    question: "Can I try Pro features before subscribing?",
    answer: "Yes! We offer a 7-day free trial of Pro features. You can start your trial from the Upgrade page - no credit card required to start the trial."
  },
  {
    category: "Pricing & Plans",
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from your Profile > Subscription page. Your Pro features will remain active until the end of your current billing period. We don't offer partial refunds for unused time."
  },
  {
    category: "Pricing & Plans",
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with your Pro or Team subscription, contact support within 7 days of purchase for a full refund."
  },
  {
    category: "Pricing & Plans",
    question: "Is there a student discount?",
    answer: "Yes! Students with a valid .edu email can get 50% off Pro plans. Contact our support team with your student email to claim your discount."
  },
  
  // Features
  {
    category: "Features",
    question: "What are follow-up questions?",
    answer: "Follow-up questions allow you to ask for more details about an error solution without starting over. For example, after getting a fix, you can ask 'Can you explain this simpler?' or 'What if this doesn't work?'. Free users get 3 follow-ups, Pro gets 5, and Team gets 10 per conversation."
  },
  {
    category: "Features",
    question: "What's the difference between Fast, Smart, and Genius AI models?",
    answer: "Fast (Haiku) - Quick responses for simple errors, responds in 2-5 seconds. Smart (Sonnet) - Better analysis for complex errors with more detailed explanations. Genius (Opus) - Our most intelligent model for the trickiest problems with deep reasoning. Free users get Fast, Pro gets Fast+Smart, Team gets all three."
  },
  {
    category: "Features",
    question: "Does ErrorWise save my error history?",
    answer: "Yes! Your Library saves all your past queries so you can reference solutions later. This is useful when you encounter the same error again. Pro and Team users also get a searchable, categorized error library."
  },
  {
    category: "Features",
    question: "Can I export my error solutions?",
    answer: "Yes! You can download solutions as text files or export them as JSON for documentation purposes. This feature is available on all plans including Free."
  },
  {
    category: "Features",
    question: "What is the Error Library?",
    answer: "The Error Library is a collection of error solutions that grows as you use ErrorWise. It includes your personal history plus community-contributed solutions. Team users can share their library with teammates."
  },
  {
    category: "Features",
    question: "How does the AI model selection work?",
    answer: "Pro and Team users can choose between different AI models based on their needs. Use 'Fast' for quick answers to simple errors, 'Smart' for detailed analysis, and 'Genius' (Team only) for complex debugging scenarios. You can switch models anytime from the dashboard."
  },
  
  // Privacy & Security
  {
    category: "Privacy & Security",
    question: "Is my code and error data secure?",
    answer: "Absolutely. We use industry-standard encryption (TLS 1.3) for all data transmission. Your error data is stored securely on encrypted servers and never shared with third parties. We are SOC 2 compliant."
  },
  {
    category: "Privacy & Security",
    question: "Do you train AI models on my error data?",
    answer: "No. We do not use your personal error data to train our AI models. Your queries are processed in real-time and your privacy is our top priority. We only use aggregated, anonymized patterns to improve our service."
  },
  {
    category: "Privacy & Security",
    question: "Can I delete my account and data?",
    answer: "Yes. You can request complete account deletion from Profile > Settings > Delete Account. All your data including error history, personal information, and subscription data will be permanently removed within 30 days."
  },
  {
    category: "Privacy & Security",
    question: "Who can see my error queries?",
    answer: "Only you can see your error queries. They are private by default. Team plan users can optionally share specific queries with their team members, but this requires explicit action."
  },
  
  // Technical
  {
    category: "Technical",
    question: "Why is the response sometimes slow?",
    answer: "Complex errors may take 5-15 seconds to analyze thoroughly. Our AI is researching multiple sources and formulating the best solution. Simple errors are usually analyzed in 2-5 seconds. Using the 'Fast' model will give quicker responses."
  },
  {
    category: "Technical",
    question: "What if the AI solution doesn't work?",
    answer: "You can ask follow-up questions like 'This didn't work, what else can I try?' to get alternative solutions. You can also use the feedback buttons (thumbs up/down) to let us know. This helps us improve and may provide better alternatives."
  },
  {
    category: "Technical",
    question: "Does ErrorWise work offline?",
    answer: "No, ErrorWise requires an internet connection to process errors through our AI models. However, your Library history is cached locally for quick reference when offline."
  },
  {
    category: "Technical",
    question: "Which browsers are supported?",
    answer: "ErrorWise works on all modern browsers including Chrome, Firefox, Safari, Edge, and Brave. We recommend using the latest version for the best experience. Mobile browsers are also fully supported."
  },
  {
    category: "Technical",
    question: "Is there an API for developers?",
    answer: "Yes! Team plan subscribers get access to our API for integrating ErrorWise into their development workflow, CI/CD pipelines, or custom tools. Check out our API documentation in your Team dashboard."
  },
  {
    category: "Technical",
    question: "Can I use ErrorWise with my IDE?",
    answer: "We're working on IDE extensions for VS Code, IntelliJ, and other popular editors. Join our newsletter to be notified when they launch!"
  },
  
  // Billing
  {
    category: "Billing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, Mastercard, American Express) through our secure payment provider. We also support UPI, PayPal, and other local payment methods in select regions."
  },
  {
    category: "Billing",
    question: "When will I be charged?",
    answer: "You'll be charged immediately when you subscribe, then on the same date each month. For example, if you subscribe on the 15th, you'll be billed on the 15th of each month."
  },
  {
    category: "Billing",
    question: "Can I change my plan?",
    answer: "Yes! You can upgrade from Free to Pro, or from Pro to Team anytime. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period."
  },
  {
    category: "Billing",
    question: "Do you offer annual billing?",
    answer: "Yes! Annual billing gives you 2 months free (pay for 10, get 12). You can switch to annual billing from your Subscription page."
  }
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Getting Started": <Zap className="w-5 h-5" />,
  "Pricing & Plans": <CreditCard className="w-5 h-5" />,
  "Features": <Settings className="w-5 h-5" />,
  "Privacy & Security": <Shield className="w-5 h-5" />,
  "Technical": <HelpCircle className="w-5 h-5" />,
  "Billing": <CreditCard className="w-5 h-5" />
};

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for display
  const groupedFAQs = selectedCategory === 'All' 
    ? categories.slice(1).map(cat => ({
        category: cat,
        items: filteredFAQs.filter(faq => faq.category === cat)
      })).filter(group => group.items.length > 0)
    : [{ category: selectedCategory, items: filteredFAQs }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="text-2xl font-bold">
            <span className="text-white">Error</span>
            <span className="text-cyan-400">Wise</span>
          </Link>
          <Link to="/login" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-cyan-400">Questions</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about ErrorWise. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              {category !== 'All' && categoryIcons[category]}
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-8">
          {groupedFAQs.map((group, groupIndex) => (
            <div key={groupIndex}>
              {selectedCategory === 'All' && (
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  {categoryIcons[group.category]}
                  {group.category}
                </h2>
              )}
              <div className="space-y-3">
                {group.items.map((faq, index) => {
                  const globalIndex = faqs.findIndex(f => f.question === faq.question);
                  return (
                    <div
                      key={index}
                      className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600 transition-all"
                    >
                      <button
                        onClick={() => setOpenIndex(openIndex === globalIndex ? null : globalIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                      >
                        <span className="font-medium text-white pr-4">{faq.question}</span>
                        {openIndex === globalIndex ? (
                          <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {openIndex === globalIndex && (
                        <div className="px-6 pb-5 text-gray-300 leading-relaxed border-t border-gray-700/50 pt-4">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No FAQs found matching your search.</p>
            <p className="text-sm mt-2">Try different keywords or browse all categories.</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-8">
          <MessageCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@errorwise.tech"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </a>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8 text-center text-gray-500 text-sm">
        <p>&copy; 2025 ErrorWise. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FAQPage;
