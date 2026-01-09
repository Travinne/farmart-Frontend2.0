import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  User,
  ShoppingCart,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Settings,
  LogOut,
  History
} from 'lucide-react';

const CustomerSidebar = () => {
  const menuItems = [
    {
      title: 'Profile',
      icon: User,
      path: '/profile',
      description: 'Personal information'
    },
    {
      title: 'My Orders',
      icon: ShoppingCart,
      path: '/orders/history',
      description: 'Order history & tracking'
    },
    {
      title: 'Addresses',
      icon: MapPin,
      path: '/profile/addresses',
      description: 'Delivery addresses'
    },
    {
      title: 'Payment Methods',
      icon: CreditCard,
      path: '/profile/payments',
      description: 'Cards & wallets'
    },
    {
      title: 'Wishlist',
      icon: Heart,
      path: '/profile/wishlist',
      description: 'Saved items'
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/profile/notifications',
      description: 'Alerts & updates'
    },
    {
      title: 'Order Tracking',
      icon: Package,
      path: '/orders/tracking',
      description: 'Track your orders'
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/profile/security',
      description: 'Password & security'
    }
  ];

  const supportItems = [
    { title: 'Help Center', icon: HelpCircle, path: '/help' },
    { title: 'Settings', icon: Settings, path: '/profile/settings' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm border">
      {/* User Profile Summary */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">john@example.com</p>
            <p className="text-xs text-green-600 mt-1">⭐ Premium Member</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="py-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-start space-x-3 px-6 py-3 transition-colors ${
                    isActive
                      ? 'bg-green-50 border-l-4 border-green-600 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-green-600'
                  }`
                }
              >
                <Icon size={20} className="mt-0.5" />
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="mt-8 px-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Support
          </p>
          <div className="space-y-2">
            {supportItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.title}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded transition-colors ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
            <button className="flex items-center space-x-3 px-3 py-2 rounded text-red-600 hover:bg-red-50 w-full">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 px-6">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800 mb-2">Your Stats</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-green-700">12</p>
                <p className="text-xs text-gray-600">Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">8</p>
                <p className="text-xs text-gray-600">Wishlist</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;