import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  FileText,
  HelpCircle,
  Mail
} from 'lucide-react';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      subItems: []
    },
    {
      title: 'Products',
      icon: Package,
      path: '/admin/products',
      subItems: [
        { title: 'All Products', path: '/admin/products' },
        { title: 'Add New', path: '/admin/products/new' },
        { title: 'Categories', path: '/admin/products/categories' },
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      subItems: [
        { title: 'All Orders', path: '/admin/orders' },
        { title: 'Pending', path: '/admin/orders?status=pending' },
        { title: 'Completed', path: '/admin/orders?status=completed' },
      ]
    },
    {
      title: 'Users',
      icon: Users,
      path: '/admin/users',
      subItems: [
        { title: 'Customers', path: '/admin/users/customers' },
        { title: 'Farmers', path: '/admin/users/farmers' },
        { title: 'Admins', path: '/admin/users/admins' },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      subItems: [
        { title: 'Sales', path: '/admin/analytics/sales' },
        { title: 'Products', path: '/admin/analytics/products' },
        { title: 'Users', path: '/admin/analytics/users' },
      ]
    },
    {
      title: 'Content',
      icon: FileText,
      path: '/admin/content',
      subItems: [
        { title: 'Pages', path: '/admin/content/pages' },
        { title: 'FAQ', path: '/admin/content/faq' },
        { title: 'Blog', path: '/admin/content/blog' },
      ]
    }
  ];

  const bottomMenuItems = [
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
    { title: 'Help & Support', icon: HelpCircle, path: '/help' },
    { title: 'Contact', icon: Mail, path: '/contact' },
    { title: 'Back to Site', icon: Home, path: '/' },
  ];

  return (
    <aside className={`bg-white border-r h-screen sticky top-0 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-700">Farmart Admin</h2>
                <p className="text-xs text-gray-500">Administration Panel</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
              <LayoutDashboard className="text-white" size={24} />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            
            return (
              <div key={item.title}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                    }`
                  }
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
                
                {/* Sub Items */}
                {!collapsed && item.subItems.length > 0 && isActive && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <NavLink
                        key={subItem.title}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 text-sm rounded transition-colors ${
                            isActive
                              ? 'text-green-600 font-medium'
                              : 'text-gray-600 hover:text-green-600'
                          }`
                        }
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="border-t p-4 space-y-2">
        {bottomMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
        
        {/* Logout */}
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User Profile */}
        {!collapsed && (
          <div className="pt-4 border-t mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={16} className="text-green-700" />
              </div>
              <div>
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-gray-500">admin@farmart.com</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;