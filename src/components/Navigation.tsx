import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Menu,
  X,
  Home,
  CreditCard,
  User,
  LogOut,
  FileText,
  Eye,
  Bot,
  History
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  onHistoryClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onHistoryClick 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selectedAI, setSelectedAI] = useState<'gemini' | 'anthropic'>('gemini');
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Apply accessibility settings
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Font size adjustments
    if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    } else {
      root.style.fontSize = '16px';
    }
    
    // High contrast mode
    if (highContrast) {
      root.style.filter = 'contrast(1.3)';
    } else {
      root.style.filter = 'contrast(1)';
    }
  }, [fontSize, highContrast]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Subscription', href: '/subscription', icon: CreditCard },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // If clicking on the current page, navigate back to dashboard
    if (isActive(href) && href !== '/dashboard') {
      e.preventDefault();
      navigate('/dashboard');
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-white/10 backdrop-blur-sm transition-all duration-300">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-cyan-400/50">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">ErrorWise</span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-slate-900/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={(e) => {
                      handleNavClick(e, item.href);
                      setIsMobileOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:translate-x-1 ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/50'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3 transition-transform duration-300" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* History Button - Always show */}
              <button
                onClick={() => {
                  onHistoryClick?.();
                  setIsMobileOpen(false);
                }}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:translate-x-1 group"
              >
                <History className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:rotate-12" />
                <span className="flex items-center gap-2">
                  History
                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300">7 days</span>
                </span>
              </button>

              {/* Features Section in Mobile */}
              <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                {/* AI Model Selection */}
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 mb-2">AI Model</p>
                  <div className="flex gap-2">
                    {(['gemini', 'anthropic'] as const).map((model) => (
                      <button
                        key={model}
                        onClick={() => setSelectedAI(model)}
                        className={`flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                          selectedAI === model
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {model === 'gemini' ? 'Gemini' : 'Claude'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accessibility */}
                <div className="px-4 py-2">
                  <p className="text-xs text-gray-500 mb-2">Accessibility</p>
                  <div className="space-y-2">
                    {/* Font Size */}
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Font Size</p>
                      <div className="flex gap-2">
                        {(['normal', 'large', 'xlarge'] as const).map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 px-2 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                              fontSize === size
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {size === 'normal' ? 'Normal' : size === 'large' ? 'Large' : 'X-Large'}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* High Contrast Toggle */}
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                        highContrast
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-xs">High Contrast</span>
                      <div className={`w-10 h-5 rounded-full relative transition-all duration-200 ${
                        highContrast ? 'bg-white/30' : 'bg-white/10'
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                          highContrast ? 'left-5' : 'left-0.5'
                        }`}></div>
                      </div>
                    </button>
                  </div>
                </div>

              {/* Theme Toggle */}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4">
                <div className="px-4 py-2 text-sm text-gray-400 transition-colors duration-300">{user?.email}</div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:translate-x-1"
                >
                  <LogOut className="w-5 h-5 mr-3 transition-transform duration-300" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex fixed left-0 top-0 h-screen bg-slate-900/80 backdrop-blur-md border-r border-white/10 transition-all duration-500 ease-in-out z-40 shadow-2xl ${isCollapsed ? 'w-20' : 'w-80'}`}
      >
        <div className="flex flex-col w-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div
              className={`flex items-center space-x-2 transition-all duration-500 overflow-hidden cursor-pointer ${isCollapsed ? 'opacity-100 w-auto' : 'opacity-100 w-auto'}`}
              onClick={() => setIsCollapsed((prev) => !prev)}
              title="Toggle Sidebar"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-cyan-400/50 hover:scale-110">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              {!isCollapsed && <span className="text-xl font-bold text-white whitespace-nowrap">ErrorWise</span>}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center px-3 py-3 rounded-lg transition-all duration-300 group transform hover:translate-x-1 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/50 scale-105'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-lg'
                  }`}
                  title={isCollapsed ? item.name : ''}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  <span className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
                    isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}>{item.name}</span>
                </Link>
              );
            })}

            {/* History Button - Always show */}
            <button
              onClick={onHistoryClick}
              className="w-full flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group"
              title={isCollapsed ? '7-Day History' : ''}
            >
              <History className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              <span className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>
                <span className="flex items-center gap-2">
                  History
                  <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 border border-blue-400/30 rounded text-blue-300">7d</span>
                </span>
              </span>
            </button>
          </nav>

          {/* Features Section - Bottom Right Corner */}
          <div className="p-3 border-t border-white/10 space-y-2">
            {/* AI Model Selection */}
            <div className="relative">
              <button
                onClick={() => setShowAIMenu(!showAIMenu)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                title={isCollapsed ? 'Select AI Model' : ''}
              >
                <Bot className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                <span className={`text-sm font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>
                  {selectedAI === 'gemini' ? 'Gemini' : 'Claude'}
                </span>
              </button>
              
              {/* AI Model Dropdown */}
              {showAIMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50">
                  {(['gemini', 'anthropic'] as const).map((model) => (
                    <button
                      key={model}
                      onClick={() => {
                        setSelectedAI(model);
                        setShowAIMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-all duration-200 ${
                        selectedAI === model
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {model === 'gemini' ? 'Google Gemini' : 'Anthropic (Claude)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility */}
            <div className="relative">
              <button
                onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
                className="w-full flex items-center px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                title={isCollapsed ? 'Accessibility' : ''}
              >
                <Eye className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                <span className={`text-sm font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
                  isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                }`}>Accessibility</span>
              </button>

              {/* Accessibility Dropdown */}
              {showAccessibilityMenu && !isCollapsed && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-white/20 rounded-lg shadow-2xl p-3 z-50 space-y-3">
                  {/* Font Size */}
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Font Size</p>
                    <div className="flex gap-2">
                      {(['normal', 'large', 'xlarge'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`flex-1 px-2 py-1 text-xs rounded transition-all duration-200 ${
                            fontSize === size
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* High Contrast Toggle */}
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      highContrast
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xs">High Contrast</span>
                    <div className={`w-9 h-5 rounded-full relative transition-all duration-200 ${
                      highContrast ? 'bg-white/30' : 'bg-white/20'
                    }`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                        highContrast ? 'left-4' : 'left-0.5'
                      }`}></div>
                    </div>
                  </button>

                  {/* Reduce Motion */}
                  <button
                    onClick={() => {
                      const reducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
                      if (!reducedMotion) {
                        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
                      } else {
                        document.documentElement.style.setProperty('--animation-duration', '');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs text-left bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white rounded-lg transition-all"
                  >
                    Toggle Animations
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="p-3 border-t border-white/10">
            <div className={`px-3 py-2 mb-2 transition-all duration-500 overflow-hidden ${
              isCollapsed ? 'opacity-0 h-0 mb-0' : 'opacity-100 h-auto'
            }`}>
              <div className="text-sm text-gray-400 truncate transition-colors duration-300">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 transform hover:translate-x-1 hover:shadow-lg group"
              title={isCollapsed ? 'Logout' : ''}
            >
              <LogOut className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              <span className={`font-medium transition-all duration-500 overflow-hidden whitespace-nowrap ${
                isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
              }`}>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;




