import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Menu, X, Briefcase, ShoppingCart, Gamepad2, Smartphone, CreditCard, Globe, Settings, Wifi, Mail } from 'lucide-react';
import LiveDemoModal from '../components/LiveDemoModal';
import FeedbackModal from '../components/FeedbackModal';
import { FeaturesModal, PricingInfoModal, APIDocsModal, InfoPagesModal } from '../components/info';
import SocialProofSection from '../components/landing/SocialProofSection';

const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const [demoModalOpen, setDemoModalOpen] = React.useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = React.useState(false);
  const [featuresModalOpen, setFeaturesModalOpen] = React.useState(false);
  const [pricingModalOpen, setPricingModalOpen] = React.useState(false);
  const [apiDocsModalOpen, setApiDocsModalOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [infoModalPage, setInfoModalPage] = React.useState<'integrations' | 'about' | 'blog' | 'careers' | 'contact' | 'help' | 'community' | 'feedback' | 'status' | 'privacy' | 'terms'>('about');

  const openInfoModal = (page: typeof infoModalPage) => {
    setInfoModalPage(page);
    setInfoModalOpen(true);
  };

  // Example errors data
  const exampleErrors = [
    { icon: CreditCard, color: 'from-red-500 to-pink-500', title: 'Payment Declined', error: '"Your card was declined. Error code: insufficient_funds"', category: 'Payments' },
    { icon: Globe, color: 'from-blue-500 to-cyan-500', title: 'Website Error', error: '"Error 503: Service Temporarily Unavailable"', category: 'Websites' },
    { icon: Gamepad2, color: 'from-purple-500 to-indigo-500', title: 'Gaming Error', error: '"Failed to connect to game server. Error: BLZBNTBNA00000012"', category: 'Gaming' },
    { icon: Smartphone, color: 'from-green-500 to-teal-500', title: 'App Crash', error: '"Unfortunately, App has stopped working"', category: 'Mobile' },
    { icon: Settings, color: 'from-orange-500 to-amber-500', title: 'Software Error', error: '"Installation failed: Error 0x80070005"', category: 'Software' },
    { icon: Wifi, color: 'from-cyan-500 to-blue-500', title: 'Connection Error', error: '"DNS_PROBE_FINISHED_NXDOMAIN"', category: 'Network' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-4 lg:py-6 lg:px-8 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-xl md:text-2xl font-bold text-white">ErrorWise</span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-6">
            <button onClick={() => setFeaturesModalOpen(true)} className="text-gray-300 hover:text-white transition-colors duration-300">Features</button>
            <button onClick={() => setPricingModalOpen(true)} className="text-gray-300 hover:text-white transition-colors duration-300">Pricing</button>
            <a href="#who-is-it-for" className="text-gray-300 hover:text-white transition-colors duration-300">Use Cases</a>
            <button onClick={() => setDemoModalOpen(true)} className="text-gray-300 hover:text-white transition-colors duration-300">Try Demo</button>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2" 
              title="Toggle mobile menu" 
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/10 backdrop-blur-md border-t border-white/20">
            <div className="flex flex-col space-y-4 p-6">
              <button onClick={() => { setFeaturesModalOpen(true); setMobileMenuOpen(false); }} className="text-gray-200 hover:text-white transition-colors duration-300 text-lg text-left">Features</button>
              <button onClick={() => { setPricingModalOpen(true); setMobileMenuOpen(false); }} className="text-gray-200 hover:text-white transition-colors duration-300 text-lg text-left">Pricing</button>
              <a href="#who-is-it-for" onClick={() => setMobileMenuOpen(false)} className="text-gray-200 hover:text-white transition-colors duration-300 text-lg">Use Cases</a>
              <button onClick={() => { setDemoModalOpen(true); setMobileMenuOpen(false); }} className="text-gray-200 hover:text-white transition-colors duration-300 text-lg text-left">Try Demo</button>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-12 sm:py-16 lg:py-20 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-lg"></span>
                  <span className="text-xs sm:text-sm text-blue-300 font-medium">For Everyone  Any Software Error  Instant Solutions</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Stuck with an{' '}
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                    Error Message?
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-green-400 bg-clip-text text-transparent">
                    Get AI-Powered Solutions
                  </span>
                  {' '}in Seconds
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  Whether it's a confusing website error, a failed payment, an app that won't open, 
                  or a device acting up  just paste the error message and let ErrorWise's AI do the rest. 
                  <span className="text-cyan-400 font-medium"> No tech skills needed.</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="group w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    Solve My Error  Free
                    <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </Link>

                <Button onClick={() => setDemoModalOpen(true)} variant="secondary" className="w-full sm:w-auto border-blue-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg backdrop-blur-sm transition-all duration-300">
                  <svg className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  See It In Action
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center space-x-2 group">
                  <svg className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">Free to start  No credit card</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <svg className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">Works with any error</span>
                </div>
                <div className="flex items-center space-x-2 group">
                  <svg className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">Plain English answers</span>
                </div>
              </div>
            </div>

            {/* Right Column - Error Examples Carousel */}
            <div className="relative lg:ml-8 mt-8 lg:mt-0">
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
              
              {/* Main Visual - Multiple Error Types */}
              <div className="relative bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm sm:text-base">ErrorWise solves ALL kinds of errors</h3>
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Error Type Cards */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <CreditCard className="w-5 h-5 text-red-400 mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Payment Error</div>
                    <div className="text-xs text-red-300 font-mono">"Card declined: E402"</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <Globe className="w-5 h-5 text-blue-400 mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Website Error</div>
                    <div className="text-xs text-blue-300 font-mono">"Error 404: Not Found"</div>
                  </div>
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                    <Gamepad2 className="w-5 h-5 text-purple-400 mb-2" />
                    <div className="text-xs text-gray-400 mb-1">Gaming Error</div>
                    <div className="text-xs text-purple-300 font-mono">"Connection lost"</div>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <Smartphone className="w-5 h-5 text-green-400 mb-2" />
                    <div className="text-xs text-gray-400 mb-1">App Error</div>
                    <div className="text-xs text-green-300 font-mono">"App has stopped"</div>
                  </div>
                </div>
                
                {/* AI Solution Preview */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <span className="text-cyan-300 text-sm font-semibold">AI Analysis Ready</span>
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">99.2% Accurate</span>
                  </div>
                  <p className="text-gray-300 text-sm">Paste any error  Get instant explanation + step-by-step fix</p>
                </div>
              </div>
              
              {/* Floating Icons */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full p-3 shadow-xl animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="relative px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-b from-gray-800/30 via-gray-900/50 to-gray-800/30">
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 sm:left-20 w-32 sm:w-40 h-32 sm:h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 sm:right-20 w-48 sm:w-60 h-48 sm:h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              How 
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> ErrorWise </span>
              Works
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Three simple steps to go from confused to confident. No technical knowledge required.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group relative text-center space-y-4 sm:space-y-6 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300 mt-4">
                  Instant Error Translator
                </h3>
                
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Paste any error message  from your phone, computer, website, or app. 
                  Our AI instantly decodes it into plain English you can actually understand.
                </p>
                
                <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-cyan-500/20 rounded-full text-cyan-400 text-xs sm:text-sm font-semibold mt-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
                  Under 2 Seconds
                </div>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative text-center space-y-4 sm:space-y-6 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105">
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 mt-4">
                  Smart Problem Detection
                </h3>
                
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  ErrorWise identifies exactly what went wrong and why. 
                  Get clear explanations without confusing tech jargon  just simple answers.
                </p>
                
                <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500/20 rounded-full text-purple-400 text-xs sm:text-sm font-semibold mt-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
                  99.2% Accurate
                </div>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative text-center space-y-4 sm:space-y-6 p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105 sm:col-span-2 md:col-span-1">
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-teal-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-green-300 transition-colors duration-300 mt-4">
                  Built by Real Users
                </h3>
                
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Our AI learns from thousands of real solutions that actually worked. 
                  Every fix is verified and rated by people who faced the same problem.
                </p>
                
                <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500/20 rounded-full text-green-400 text-xs sm:text-sm font-semibold mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Community Verified
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                99.2%
              </div>
              <div className="text-gray-400 mt-2">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                &lt;2s
              </div>
              <div className="text-gray-400 mt-2">Response Time</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                200+
              </div>
              <div className="text-gray-400 mt-2">Error Types</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                2K+ & Growing
              </div>
              <div className="text-gray-400 mt-2">Users Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is ErrorWise For Section */}
      <section id="who-is-it-for" className="relative px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-b from-gray-900/50 via-blue-900/20 to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Who Is 
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> ErrorWise </span>
              For?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              ErrorWise is for anyone who's ever been frustrated by a confusing error message. You don't need to be technical  you just need to know how to copy and paste.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Business Owners */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Business Owners</h3>
              <p className="text-gray-400 text-sm">
                Don't let tech issues slow you down. Get quick fixes for payment systems, website errors, and software problems without calling IT.
              </p>
            </div>
            
            {/* Online Shoppers */}
            <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20 rounded-xl p-6 hover:border-pink-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Online Shoppers</h3>
              <p className="text-gray-400 text-sm">
                Checkout not working? Payment declined? Get clear explanations and fixes so you can complete your purchase without frustration.
              </p>
            </div>
            
            {/* Gamers */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gamers</h3>
              <p className="text-gray-400 text-sm">
                Connection errors, launch failures, crash codes  get back to playing faster with instant solutions for any gaming error.
              </p>
            </div>
            
            {/* Everyday Users */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 hover:border-green-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Everyday Users</h3>
              <p className="text-gray-400 text-sm">
                Phone acting up? App not loading? Computer showing weird messages? Get simple explanations anyone can understand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Errors Section */}
      <section className="relative px-4 py-16 sm:py-20 lg:py-24 lg:px-8 bg-gradient-to-b from-gray-800/30 via-gray-900/50 to-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              Real Errors 
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> ErrorWise </span>
              Solves
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              From payment failures to gaming crashes  see the types of errors our AI handles every day.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {exampleErrors.map((error, index) => (
              <div key={index} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${error.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <error.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded-full">{error.category}</span>
                </div>
                <h4 className="text-white font-semibold mb-2">{error.title}</h4>
                <p className="text-gray-400 text-sm font-mono bg-gray-900/50 p-2 rounded">{error.error}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button onClick={() => setDemoModalOpen(true)} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300">
              Try it with your own error 
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof Section - E3: Trust signals */}
      <SocialProofSection />

      {/* Final CTA Section */}
      <section id="contact" className="relative px-4 py-24 lg:px-8 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Stop Googling Error Messages.
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block mt-2">
              Get Instant AI Solutions Instead.
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join over 500,000 people who've stopped wasting time on confusing error messages. 
            Paste your error, get your answer  it's that simple.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <Link to="/register" className="group relative w-full sm:w-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Button className="relative w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center justify-center">
                  Solve My Error  Free
                  <svg className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 sm:py-12 lg:px-8 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-cyan-900/30 backdrop-blur-xl border-t border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter Section */}
          <div className="mb-8 sm:mb-12 p-6 sm:p-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                Get helpful tech tips and product updates delivered to your inbox.
              </p>
              <form 
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = form.email.value;
                  const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  const input = form.querySelector('input[type="email"]') as HTMLInputElement;
                  
                  button.disabled = true;
                  input.disabled = true;
                  button.textContent = 'Subscribing...';
                  
                  try {
                    const { supportService } = await import('../services/support');
                    const { trackNewsletterSignup } = await import('../services/analytics');
                    const result = await supportService.subscribeNewsletter({ email });
                    
                    if (result.success) {
                      trackNewsletterSignup(email, 'footer_newsletter');
                      alert(' Successfully subscribed! Check your email for confirmation.');
                      form.reset();
                    } else {
                      alert(' ' + (result.error || 'Failed to subscribe. Please try again.'));
                    }
                  } catch (error) {
                    alert(' Network error. Please try again later.');
                  } finally {
                    button.disabled = false;
                    input.disabled = false;
                    button.textContent = 'Subscribe ';
                  }
                }}
              >
                <input type="email" name="email" required placeholder="your@email.com" className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent focus:bg-white/15 transition-all" />
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 transition-all duration-300 font-semibold whitespace-nowrap">
                  Subscribe 
                </button>
              </form>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 sm:h-7 sm:w-7 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-lg sm:text-xl font-bold text-white">ErrorWise</span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base max-w-md">
                AI-powered error solutions for everyone. Stop struggling with confusing error messages  get instant, plain-English fixes.
              </p>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-sm sm:text-base">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => setFeaturesModalOpen(true)} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Features</button></li>
                <li><button onClick={() => setPricingModalOpen(true)} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Pricing</button></li>
                <li><button onClick={() => setDemoModalOpen(true)} className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Try Demo</button></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-white font-semibold text-sm sm:text-base">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">FAQ</Link></li>
                <li><a href="mailto:support@errorwise.com" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/20 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
               2025 ErrorWise. All rights reserved. 
              <span className="mx-2"></span>
              <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <span className="mx-2"></span>
              <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LiveDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} onFeedbackClick={() => { setDemoModalOpen(false); setFeedbackModalOpen(true); }} />
      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} source="demo_limit" />
      <FeaturesModal isOpen={featuresModalOpen} onClose={() => setFeaturesModalOpen(false)} />
      <PricingInfoModal isOpen={pricingModalOpen} onClose={() => setPricingModalOpen(false)} />
      <APIDocsModal isOpen={apiDocsModalOpen} onClose={() => setApiDocsModalOpen(false)} />
      <InfoPagesModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} page={infoModalPage} />
    </div>
  );
};

export default LandingPage;




