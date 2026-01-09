import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Menu,
  X,
  Home,
  User
} from 'lucide-react';
import { useSelector } from 'react-redux';

const DashboardNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const notifications = useSelector(state => state.notifications.list) || [];

  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
                <Home size={18} />
                <span>Back to Store</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold text-gray-800">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Farmer Dashboard'}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="bg-transparent ml-2 outline-none w-48"
              />
            </div>

            {/* Help */}
            <Link
              to="/help"
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              title="Help Center"
            >
              <HelpCircle size={20} />
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="font-medium">{user?.name || 'User'}</p>
                <p className="text-sm text-gray-500 capitalize">{user?.role || 'User'}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-green-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent ml-2 outline-none flex-1"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardNavbar;