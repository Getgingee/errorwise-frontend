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
    answer: "Pro plan ($9/month) includes: Unlimited error queries, Follow-up questions (5 per conversation), Access to Smart & Fast AI models, Priority response times, Web scraping for solutions, Context memory for conversations, and Email support."
  },
  {
    category: "Pricing & Plans",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you won't be charged again."
  },

  // Features
  {
    category: "Features",
    question: "What are follow-up questions?",
    answer: "Follow-up questions let you ask for more details about your error analysis. Pro users get 5 follow-ups per conversation, Team users get 10. This helps you dig deeper into complex issues without starting a new analysis."
  },
  {
    category: "Features",
    question: "What's the difference between Fast and Smart modes?",
    answer: "Fast mode uses optimized models for quick responses (ideal for simple errors). Smart mode uses advanced AI models like GPT-4 and Claude for complex problems requiring deeper analysis and more accurate solutions."
  },
  {
    category: "Features",
    question: "What is the Library feature?",
    answer: "The Library stores all your past error analyses. You can search, filter, and revisit previous solutions. It's great for recurring issues or building your personal knowledge base of error fixes."
  },
  {
    category: "Features",
    question: "Can I share my error analysis with others?",
    answer: "Yes! You can export your error analysis as a shareable link or download it as a PDF. Team plan users can also collaborate directly within their team workspace."
  },

  // Privacy & Security
  {
    category: "Privacy & Security",
    question: "Is my data safe with ErrorWise?",
    answer: "Absolutely. We use industry-standard encryption (TLS 1.3) for all data in transit and AES-256 encryption for data at rest. Your error messages are processed securely and we never share your data with third parties."
  },
  {
    category: "Privacy & Security",
    question: "Do you store my error messages?",
    answer: "We store your error analyses in your Library so you can access them later. You can delete any analysis at any time. We never use your data to train our AI models without explicit consent."
  },
  {
    category: "Privacy & Security",
    question: "Can I use ErrorWise for sensitive/proprietary code?",
    answer: "Yes. Your code snippets and error messages are encrypted and isolated. For enterprise needs with additional security requirements, contact us about our Enterprise plan with SOC 2 compliance and on-premise options."
  },
  {
    category: "Privacy & Security",
    question: "How do I delete my account and data?",
    answer: "Go to Settings > Account > Delete Account. This will permanently remove all your data including error analyses, account information, and usage history within 30 days."
  },

  // Technical
  {
    category: "Technical",
    question: "Which programming languages are supported?",
    answer: "ErrorWise supports 50+ programming languages including JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, Ruby, PHP, Swift, Kotlin, and many more. We also support framework-specific errors for React, Vue, Angular, Django, Rails, etc."
  },
  {
    category: "Technical",
    question: "How accurate are the solutions?",
    answer: "Our AI maintains a 99.2% accuracy rate based on user feedback. We continuously improve our models and update our knowledge base with the latest solutions and best practices."
  },
  {
    category: "Technical",
    question: "Can ErrorWise help with runtime errors?",
    answer: "Yes! ErrorWise excels at runtime errors, stack traces, and exception handling. Just paste the complete error message with the stack trace for the best results."
  },
  {
    category: "Technical",
    question: "Is there an API available?",
    answer: "Yes, we offer a REST API for Team and Enterprise plans. This allows you to integrate ErrorWise into your CI/CD pipelines, IDEs, or custom tools. Check our API documentation for details."
  },

  // Billing & Support
  {
    category: "Billing & Support",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment provider."
  },
  {
    category: "Billing & Support",
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact support within 14 days of your purchase for a full refund."
  },
  {
    category: "Billing & Support",
    question: "How do I contact support?",
    answer: "You can reach us at support@errorwise.com or through the in-app chat. Pro users get priority support with typical response times under 4 hours. Free users can expect responses within 24-48 hours."
  },
  {
    category: "Billing & Support",
    question: "Do you offer educational discounts?",
    answer: "Yes! Students and educators get 50% off Pro plans. Contact us with your .edu email address to get verified and receive your discount code."
  }
];

const categories = ['All', 'Getting Started', 'Pricing & Plans', 'Features', 'Privacy & Security', 'Technical', 'Billing & Support'];

const categoryIcons: Record<string, React.ReactNode> = {
  'Getting Started': <Zap className="w-4 h-4" />,
  'Pricing & Plans': <CreditCard className="w-4 h-4" />,
  'Features': <Settings className="w-4 h-4" />,
  'Privacy & Security': <Shield className="w-4 h-4" />,
  'Technical': <HelpCircle className="w-4 h-4" />,
  'Billing & Support': <MessageCircle className="w-4 h-4" />
};

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ErrorWise
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-16 sm:py-20 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Frequently Asked
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> Questions</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Everything you need to know about ErrorWise. Can't find the answer you're looking for? 
            <a href="mailto:support@errorwise.com" className="text-cyan-400 hover:text-cyan-300 ml-1">Contact our support team</a>.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-8 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
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
      </section>

      {/* FAQ List */}
      <section className="px-4 pb-20 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No questions found matching your search.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-xs text-cyan-400 font-medium mb-1 block">{faq.category}</span>
                    <span className="text-white font-semibold">{faq.question}</span>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 pb-20 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a 
            href="mailto:support@errorwise.com" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Contact Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 ErrorWise. All rights reserved.
            <span className="mx-2">•</span>
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
            <span className="mx-2">•</span>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;
