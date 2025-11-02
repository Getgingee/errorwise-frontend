import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Home, History, CreditCard, User, Settings, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-xl">ErrorWise</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <History className="w-5 h-5" />
              <span>History</span>
            </Link>
            <Link
              to="/subscription"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span>Subscription</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2" title="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
