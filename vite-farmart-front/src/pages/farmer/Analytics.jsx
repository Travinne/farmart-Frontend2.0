import React, { useState, useEffect } from 'react';

const FarmerAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedChart, setSelectedChart] = useState('revenue');

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
    productPerformance: [
      { month: 'Jan', revenue: 3200 },
      { month: 'Feb', revenue: 4200 },
      { month: 'Mar', revenue: 3800 },
      { month: 'Apr', revenue: 5100 },
      { month: 'May', revenue: 6200 },
      { month: 'Jun', revenue: 5800 },
    ]
  };

  // Mock products data
  const mockProductsData = [
    { category: 'Fruits', value: 45 },
    { category: 'Vegetables', value: 30 },
    { category: 'Dairy', value: 15 },
    { category: 'Meat', value: 10 },
  ];

  const topProducts = [
    { id: 1, name: 'Organic Apples', category: 'Fruits', sales: 245, revenue: 1225, stock: 50, rating: 4.8 },
    { id: 2, name: 'Fresh Tomatoes', category: 'Vegetables', sales: 189, revenue: 945, stock: 30, rating: 4.5 },
    { id: 3, name: 'Organic Potatoes', category: 'Vegetables', sales: 156, revenue: 780, stock: 45, rating: 4.7 },
    { id: 4, name: 'Carrots', category: 'Vegetables', sales: 134, revenue: 670, stock: 28, rating: 4.4 },
    { id: 5, name: 'Onions', category: 'Vegetables', sales: 98, revenue: 490, stock: 35, rating: 4.6 },
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

  const productAnalytics = async (period) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockProductsData };
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const farmerId = 'current-farmer-id';
      const [statsRes, productsRes] = await Promise.all([
        getFarmerStats(farmerId),
        productAnalytics(period),
      ]);
      
      setStats(statsRes.data);
      setProductsData(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data',
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
  const StatsCard = ({ title, value, change, color = 'green', icon }) => {
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
      <div className={`bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{icon}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color]}`}>
            {title}
          </span>
        </div>
        
        <div className="mb-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className={`text-sm font-medium ${changeColor}`}>
            {changeIcon} {Math.abs(change)}% from last period
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          Updated just now
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

    const maxValue = Math.max(...data.map(item => item.revenue));
    
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <div className="flex space-x-2">
            {['revenue', 'sales', 'orders'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedChart(type)}
                className={`text-xs px-3 py-1 rounded-full ${
                  selectedChart === type
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-end space-x-2 justify-center mt-8">
          {data.map((item, index) => {
            const height = (item.revenue / maxValue) * 100;
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all hover:opacity-90"
                  style={{ height: `${height}%` }}
                  title={`${item.month}: $${item.revenue}`}
                />
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs font-medium text-gray-900 mt-1">${item.revenue}</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-300 rounded mr-2"></div>
              <span>Target</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data, title, className = '' }) => {
    if (!data || data.length === 0) {
      return (
        <div className={`flex items-center justify-center h-80 ${className}`}>
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];
    
    let cumulativePercentage = 0;
    
    return (
      <div className={className}>
        <h4 className="font-semibold text-gray-900 mb-6">{title}</h4>
        
        <div className="flex items-center">
          {/* Pie Chart Visualization */}
          <div className="relative w-48 h-48 mr-8">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const sliceStyle = {
                '--percentage': percentage,
                '--color': colors[index % colors.length],
                '--cumulative': cumulativePercentage
              };
              
              cumulativePercentage += percentage;
              
              return (
                <div
                  key={index}
                  className="absolute w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      transparent 0% ${cumulativePercentage - percentage}%,
                      var(--color) ${cumulativePercentage - percentage}% ${cumulativePercentage}%,
                      transparent ${cumulativePercentage}% 100%
                    )`
                  }}
                />
              );
            })}
            
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full"></div>
          </div>
          
          {/* Legend */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded mr-3"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.category}</div>
                    <div className="text-sm text-gray-600">{percentage}% ({item.value} units)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Data Table Component
  const DataTable = ({ columns, data, emptyMessage = "data" }) => {
    if (!data || data.length === 0) {
      return (
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-gray-600">No {emptyMessage} available</p>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key]) : row[column.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => addNotification({
                      type: 'info',
                      title: 'Product Details',
                      message: `Viewing details for ${row.name}`
                    })}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
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
        <LoadingSpinner text="Loading analytics..." />
      </div>
    );
  }

  const productColumns = [
    { key: 'name', title: 'Product' },
    { key: 'category', title: 'Category' },
    { key: 'sales', title: 'Units Sold' },
    { key: 'revenue', title: 'Revenue', render: (value) => `$${value}` },
    { key: 'stock', title: 'Stock' },
    { key: 'rating', title: 'Rating' },
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farm Analytics Dashboard</h1>
          <p className="text-gray-600">Insights into your farm's performance and product sales</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
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
                fetchAnalyticsData();
                addNotification({
                  type: 'success',
                  title: 'Data Refreshed',
                  message: 'Analytics data has been updated'
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={stats?.revenueChange || 0}
          color="green"
          icon="💰"
        />
        
        <StatsCard
          title="Total Orders"
          value={(stats?.totalOrders || 0).toLocaleString()}
          change={stats?.ordersChange || 0}
          color="blue"
          icon="📦"
        />
        
        <StatsCard
          title="Active Products"
          value={(stats?.activeProducts || 0).toLocaleString()}
          change={stats?.productsChange || 0}
          color="purple"
          icon="🌱"
        />
        
        <StatsCard
          title="Customer Rating"
          value={(stats?.rating || 0).toFixed(1)}
          change={stats?.ratingChange || 0}
          color="yellow"
          icon="⭐"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <BarChart
            data={stats?.productPerformance}
            title="Revenue Trend"
            className="h-80"
          />
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <PieChart
            data={productsData}
            title="Sales by Category"
            className="h-80"
          />
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Best Selling Products</h3>
              <p className="text-gray-600">Your top performing products by revenue and units sold</p>
            </div>
            <Button
              onClick={() => addNotification({
                type: 'info',
                title: 'Export Started',
                message: 'Product data export has been initiated'
              })}
              variant="outline"
            >
              Export Data
            </Button>
          </div>
        </div>
        
        <DataTable
          columns={productColumns}
          data={topProducts}
          emptyMessage="products"
        />
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">📈</span>
            <h4 className="font-semibold text-blue-900">Peak Sales Period</h4>
          </div>
          <p className="text-blue-800 mb-2">Weekends (Sat-Sun)</p>
          <p className="text-sm text-blue-700">35% higher sales compared to weekdays</p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🏆</span>
            <h4 className="font-semibold text-green-900">Top Category</h4>
          </div>
          <p className="text-green-800 mb-2">Organic Fruits</p>
          <p className="text-sm text-green-700">Generates 45% of total revenue</p>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🎯</span>
            <h4 className="font-semibold text-yellow-900">Growth Opportunity</h4>
          </div>
          <p className="text-yellow-800 mb-2">Dairy Products</p>
          <p className="text-sm text-yellow-700">Only 15% market share, potential for 25% growth</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;