import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  CreditCard,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/subscription', icon: CreditCard, label: 'Subscription' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900">
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/10 backdrop-blur-md border-r border-white/20 transition-all duration-300 z-50 ${
          isOpen ? 'w-64' : 'w-0 md:w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              {isOpen && (
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">ErrorWise</span>
                </Link>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                aria-label="Toggle sidebar"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* User Info */}
          {isOpen && user && (
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.username}</p>
                  <p className="text-gray-300 text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-300 w-full transition-all duration-200"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Top Bar (Mobile) */}
        {isMobile && !isOpen && (
          <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-md border-b border-white/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg hover:bg-white/10 text-white"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ErrorWise</span>
              </Link>
              <div className="w-10" /> {/* Spacer */}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="min-h-screen p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
