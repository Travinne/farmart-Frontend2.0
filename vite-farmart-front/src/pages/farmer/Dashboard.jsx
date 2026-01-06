import React, { useState, useEffect } from 'react';

const FarmerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Mock stats data
  const mockStats = {
    totalRevenue: 45280,
    revenueChange: 12.5,
    totalOrders: 245,
    ordersChange: 8.3,
    activeProducts: 28,
    productsChange: 5,
    rating: 4.7,
    ratingChange: 2.1,
    revenueTrend: [
      { month: 'Jan', revenue: 3200 },
      { month: 'Feb', revenue: 4200 },
      { month: 'Mar', revenue: 3800 },
      { month: 'Apr', revenue: 5100 },
      { month: 'May', revenue: 6200 },
      { month: 'Jun', revenue: 5800 },
    ],
    weeklySales: 8250,
    weeklyChange: 15.2,
    pendingOrders: 18,
    newCustomers: 32
  };

  // Mock sales data
  const mockSalesData = [
    { month: 'Jan', sales: 150, revenue: 3200 },
    { month: 'Feb', sales: 210, revenue: 4200 },
    { month: 'Mar', sales: 190, revenue: 3800 },
    { month: 'Apr', sales: 255, revenue: 5100 },
    { month: 'May', sales: 310, revenue: 6200 },
    { month: 'Jun', sales: 290, revenue: 5800 },
  ];

  const recentOrders = [
    { id: 1, orderNumber: 'ORD-001', product: 'Organic Apples', quantity: 10, amount: 50.00, status: 'Delivered', date: '2024-01-15', customer: 'John Doe' },
    { id: 2, orderNumber: 'ORD-002', product: 'Fresh Tomatoes', quantity: 5, amount: 25.00, status: 'Processing', date: '2024-01-15', customer: 'Jane Smith' },
    { id: 3, orderNumber: 'ORD-003', product: 'Organic Potatoes', quantity: 20, amount: 40.00, status: 'Shipped', date: '2024-01-14', customer: 'Bob Wilson' },
    { id: 4, orderNumber: 'ORD-004', product: 'Carrots', quantity: 15, amount: 30.00, status: 'Pending', date: '2024-01-14', customer: 'Alice Brown' },
    { id: 5, orderNumber: 'ORD-005', product: 'Onions', quantity: 8, amount: 16.00, status: 'Delivered', date: '2024-01-13', customer: 'Charlie Davis' },
  ];

  const topProducts = [
    { id: 1, name: 'Organic Apples', sales: 245, revenue: 1225, growth: 15.5 },
    { id: 2, name: 'Fresh Tomatoes', sales: 189, revenue: 945, growth: 12.3 },
    { id: 3, name: 'Organic Potatoes', sales: 156, revenue: 780, growth: 8.7 },
    { id: 4, name: 'Carrots', sales: 134, revenue: 670, growth: 5.2 },
    { id: 5, name: 'Onions', sales: 98, revenue: 490, growth: 3.8 },
  ];

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // Mock API functions
  const getFarmerStats = async (farmerId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockStats };
  };

  const salesAnalytics = async (period) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockSalesData };
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const farmerId = 'current-farmer-id';
      const [statsRes, salesRes] = await Promise.all([
        getFarmerStats(farmerId),
        salesAnalytics(selectedPeriod),
      ]);
      
      setStats(statsRes.data);
      setSalesData(salesRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );

  // Button Component
  const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    loading = false, 
    disabled = false,
    className = '',
    type = 'button',
    ...props 
  }) => {
    const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const sizeClasses = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2.5 text-sm',
      large: 'px-6 py-3 text-base'
    };
    
    const variantClasses = {
      primary: 'bg-green-600 text-white hover:bg-green-700',
      secondary: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </span>
        ) : children}
      </button>
    );
  };

  // Alert Component
  const Alert = ({ type = 'info', title, message, onDismiss, className = '' }) => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: '✅',
        titleColor: 'text-green-900'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: '⚠️',
        titleColor: 'text-red-900'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: '⚠️',
        titleColor: 'text-yellow-900'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'ℹ️',
        titleColor: 'text-blue-900'
      }
    };
    
    const style = styles[type] || styles.info;
    
    return (
      <div className={`rounded-lg border p-4 ${style.bg} ${style.border} ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <span className="text-lg">{style.icon}</span>
          </div>
          <div className="flex-1">
            {title && <h3 className={`font-medium ${style.titleColor}`}>{title}</h3>}
            <div className={`text-sm ${style.text}`}>{message}</div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-auto pl-3 flex-shrink-0"
            >
              <span className="sr-only">Dismiss</span>
              <span className={`text-lg ${style.text}`}>×</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  // Stats Card Component
  const StatsCard = ({ title, value, change, color = 'green', icon, subtitle }) => {
    const colorClasses = {
      green: 'bg-green-50 border-green-200 text-green-700',
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      red: 'bg-red-50 border-red-200 text-red-700'
    };
    
    const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';
    const changeIcon = change >= 0 ? '↗' : '↘';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <span className="text-2xl">{icon}</span>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1.5 rounded-full ${colorClasses[color]}`}>
            {title}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {change !== undefined && (
            <div className={`text-sm font-medium ${changeColor}`}>
              {changeIcon} {Math.abs(change)}% from last period
            </div>
          )}
          {subtitle && (
            <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
          )}
        </div>
      </div>
    );
  };

  // Bar Chart Component
  const BarChart = ({ data, title, className = '' }) => {
    if (!data || data.length === 0) {
      return (
        <div className={`flex items-center justify-center h-80 ${className}`}>
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const maxRevenue = Math.max(...data.map(item => item.revenue));
    const maxSales = Math.max(...data.map(item => item.sales));
    
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">Monthly performance overview</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-xs text-gray-600">Sales</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-4 justify-center mt-8">
          {data.map((item, index) => {
            const revenueHeight = (item.revenue / maxRevenue) * 100;
            const salesHeight = (item.sales / maxSales) * 80;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-end space-x-1 w-full">
                  <div
                    className="flex-1 bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:opacity-90"
                    style={{ height: `${revenueHeight}%` }}
                    title={`Revenue: $${item.revenue}`}
                  />
                  <div
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:opacity-90"
                    style={{ height: `${salesHeight}%` }}
                    title={`Sales: ${item.sales} units`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">${item.revenue}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Line Chart Component
  const LineChart = ({ data, title, className = '' }) => {
    if (!data || data.length === 0) {
      return (
        <div className={`flex items-center justify-center h-80 ${className}`}>
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const maxRevenue = Math.max(...data.map(item => item.revenue));
    const points = data.map((item, index) => ({
      x: (index / (data.length - 1)) * 100,
      y: ((item.revenue / maxRevenue) * 100) || 0
    }));

    return (
      <div className={className}>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">Revenue growth over time</p>
        </div>
        
        <div className="h-64 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 25, 50, 75, 100].map((percent, index) => (
              <div key={index} className="border-t border-gray-100"></div>
            ))}
          </div>
          
          {/* Line path */}
          <svg className="absolute inset-0 w-full h-full">
            {points.map((point, index) => {
              if (index === 0) return null;
              const prevPoint = points[index - 1];
              return (
                <line
                  key={index}
                  x1={`${prevPoint.x}%`}
                  y1={`${100 - prevPoint.y}%`}
                  x2={`${point.x}%`}
                  y2={`${100 - point.y}%`}
                  stroke="#10B981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            
            {/* Points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={`${point.x}%`}
                cy={`${100 - point.y}%`}
                r="4"
                fill="#10B981"
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:r-6 transition-all"
              />
            ))}
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between">
            {data.map((item, index) => (
              <div key={index} className="text-xs text-gray-600">
                {item.month}
              </div>
            ))}
          </div>
          
          {/* Value labels on right */}
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between">
            {[0, 0.25, 0.5, 0.75, 1].map((multiplier, index) => (
              <div key={index} className="text-xs text-gray-500">
                ${(maxRevenue * multiplier).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-green-500 mr-2"></div>
              <span>Revenue Trend</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Data Table Component
  const DataTable = ({ columns, data, title, subtitle, onRowClick }) => {
    if (!data || data.length === 0) {
      return (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-600">No data available</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr 
                key={row.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  const orderColumns = [
    { key: 'orderNumber', title: 'Order #' },
    { key: 'customer', title: 'Customer' },
    { key: 'product', title: 'Product' },
    { key: 'quantity', title: 'Quantity' },
    { key: 'amount', title: 'Amount', render: (value) => `$${value.toFixed(2)}` },
    { key: 'status', title: 'Status', render: (value) => (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
        value === 'Delivered' ? 'bg-green-100 text-green-800' :
        value === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
        value === 'Shipped' ? 'bg-blue-100 text-blue-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {value}
      </span>
    )},
    { key: 'date', title: 'Date' },
  ];

  const productColumns = [
    { key: 'name', title: 'Product' },
    { key: 'sales', title: 'Units Sold' },
    { key: 'revenue', title: 'Revenue', render: (value) => `$${value}` },
    { key: 'growth', title: 'Growth', render: (value) => (
      <span className={`px-2 py-1 text-xs rounded-full ${value >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {value >= 0 ? '+' : ''}{value}%
      </span>
    )},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <Alert
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onDismiss={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your farm's performance overview.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <Button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  fetchDashboardData();
                  addNotification({
                    type: 'success',
                    title: 'Dashboard Updated',
                    message: 'Dashboard data has been refreshed'
                  });
                }, 300);
              }}
              variant="outline"
              className="mt-6"
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning, Farmer John! 👋</h2>
              <p className="opacity-90">Your farm is performing exceptionally well this month. Keep up the great work!</p>
            </div>
            <div className="hidden md:block">
              <span className="text-4xl">🚜</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={stats?.revenueChange || 0}
          color="green"
          icon="💰"
          subtitle="This month"
        />
        
        <StatsCard
          title="Total Orders"
          value={(stats?.totalOrders || 0).toLocaleString()}
          change={stats?.ordersChange || 0}
          color="blue"
          icon="📦"
          subtitle="Active orders"
        />
        
        <StatsCard
          title="Active Products"
          value={(stats?.activeProducts || 0).toLocaleString()}
          change={stats?.productsChange || 0}
          color="purple"
          icon="🌱"
          subtitle="In stock"
        />
        
        <StatsCard
          title="Customer Rating"
          value={(stats?.rating || 0).toFixed(1)}
          change={stats?.ratingChange || 0}
          color="yellow"
          icon="⭐"
          subtitle="Out of 5.0"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-blue-50 mr-3">
              <span className="text-xl text-blue-600">📈</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Weekly Sales</div>
              <div className="text-xl font-bold text-gray-900">${stats?.weeklySales?.toLocaleString() || '0'}</div>
            </div>
          </div>
          <div className="text-sm text-green-600 font-medium">
            ↗ {stats?.weeklyChange || 0}% from last week
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-yellow-50 mr-3">
              <span className="text-xl text-yellow-600">⏳</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Pending Orders</div>
              <div className="text-xl font-bold text-gray-900">{stats?.pendingOrders || 0}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">Awaiting processing</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-green-50 mr-3">
              <span className="text-xl text-green-600">👥</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">New Customers</div>
              <div className="text-xl font-bold text-gray-900">{stats?.newCustomers || 0}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">This month</div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-lg bg-purple-50 mr-3">
              <span className="text-xl text-purple-600">🎯</span>
            </div>
            <div>
              <div className="text-sm text-gray-600">Target Completion</div>
              <div className="text-xl font-bold text-gray-900">78%</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">Monthly sales target</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <BarChart
            data={salesData}
            title="Sales Overview"
            className="h-80"
          />
        </div>
        
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <LineChart
            data={stats?.revenueTrend}
            title="Revenue Trend"
            className="h-80"
          />
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <p className="text-sm text-gray-600">Latest orders for your products</p>
              </div>
              <Button
                onClick={() => addNotification({
                  type: 'info',
                  title: 'View All Orders',
                  message: 'Redirecting to orders page'
                })}
                variant="outline"
                size="small"
              >
                View All
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={orderColumns}
            data={recentOrders}
            onRowClick={(row) => addNotification({
              type: 'info',
              title: 'Order Details',
              message: `Viewing details for order ${row.orderNumber}`
            })}
          />
        </div>
        
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                <p className="text-sm text-gray-600">Best performing products by sales</p>
              </div>
              <Button
                onClick={() => addNotification({
                  type: 'info',
                  title: 'View All Products',
                  message: 'Redirecting to products page'
                })}
                variant="outline"
                size="small"
              >
                View All
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={productColumns}
            data={topProducts}
            onRowClick={(row) => addNotification({
              type: 'info',
              title: 'Product Details',
              message: `Viewing analytics for ${row.name}`
            })}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => addNotification({
              type: 'success',
              title: 'New Product',
              message: 'Ready to add a new product'
            })}
            className="flex items-center justify-center p-6"
          >
            <span className="mr-2">➕</span> Add Product
          </Button>
          
          <Button
            onClick={() => addNotification({
              type: 'success',
              title: 'Inventory',
              message: 'Opening inventory management'
            })}
            variant="outline"
            className="flex items-center justify-center p-6"
          >
            <span className="mr-2">📊</span> Manage Inventory
          </Button>
          
          <Button
            onClick={() => addNotification({
              type: 'success',
              title: 'Orders',
              message: 'Opening orders management'
            })}
            variant="outline"
            className="flex items-center justify-center p-6"
          >
            <span className="mr-2">📦</span> Process Orders
          </Button>
          
          <Button
            onClick={() => addNotification({
              type: 'success',
              title: 'Analytics',
              message: 'Opening detailed analytics'
            })}
            variant="outline"
            className="flex items-center justify-center p-6"
          >
            <span className="mr-2">📈</span> View Analytics
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;