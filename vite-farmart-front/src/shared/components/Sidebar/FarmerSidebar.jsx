import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Truck,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Leaf,
  Users,
  Calendar
} from 'lucide-react';

const FarmerSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/farmer/dashboard'
    },
    {
      title: 'Inventory',
      icon: Package,
      path: '/farmer/inventory',
      subItems: [
        { title: 'All Products', path: '/farmer/inventory' },
        { title: 'Add Product', path: '/farmer/inventory/add' },
        { title: 'Categories', path: '/farmer/inventory/categories' },
        { title: 'Stock Alert', path: '/farmer/inventory/alert' },
      ]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      path: '/farmer/orders',
      subItems: [
        { title: 'New Orders', path: '/farmer/orders?status=new' },
        { title: 'Processing', path: '/farmer/orders?status=processing' },
        { title: 'To Ship', path: '/farmer/orders?status=to-ship' },
        { title: 'Completed', path: '/farmer/orders?status=completed' },
      ]
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/farmer/analytics',
      subItems: [
        { title: 'Sales Report', path: '/farmer/analytics/sales' },
        { title: 'Product Performance', path: '/farmer/analytics/products' },
        { title: 'Customer Insights', path: '/farmer/analytics/customers' },
      ]
    },
    {
      title: 'Delivery',
      icon: Truck,
      path: '/farmer/delivery',
      subItems: [
        { title: 'Delivery Schedule', path: '/farmer/delivery/schedule' },
        { title: 'Delivery Partners', path: '/farmer/delivery/partners' },
        { title: 'Track Delivery', path: '/farmer/delivery/track' },
      ]
    },
    {
      title: 'Earnings',
      icon: DollarSign,
      path: '/farmer/earnings',
      subItems: [
        { title: 'Payouts', path: '/farmer/earnings/payouts' },
        { title: 'Withdraw', path: '/farmer/earnings/withdraw' },
        { title: 'Transaction History', path: '/farmer/earnings/history' },
      ]
    },
    {
      title: 'Farm Schedule',
      icon: Calendar,
      path: '/farmer/schedule'
    },
    {
      title: 'Customers',
      icon: Users,
      path: '/farmer/customers'
    }
  ];

  return (
    <aside className={`bg-white border-r h-screen sticky top-0 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link to="/farmer/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-700">Farm Dashboard</h2>
                <p className="text-xs text-gray-500">Farmer Panel</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mx-auto">
              <Leaf className="text-white" size={24} />
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
                {!collapsed && item.subItems && item.subItems.length > 0 && isActive && (
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

      {/* Bottom Section */}
      <div className="border-t p-4 space-y-2">
        <NavLink
          to="/farmer/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-green-50 text-green-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
            }`
          }
        >
          <Settings size={20} />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        
        <Link
          to="/"
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-green-600"
        >
          <Home size={20} />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        
        <button className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full">
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default FarmerSidebar;