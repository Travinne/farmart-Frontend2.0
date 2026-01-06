import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getAdminAnalytics, 
  getSalesAnalytics, 
  getOrderAnalytics, 
  getProductAnalytics, 
  getFarmerAnalytics 
} from '../../api/adminApi';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [farmersData, setFarmersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Mock notification function - replace with actual implementation
  const addNotification = (notification) => {
    console.log('Notification:', notification);
  };

  // Mock API functions for development
  const salesAnalytics = async (params) => {
    return { data: generateMockSalesData(params?.period || 'monthly') };
  };

  const orderAnalytics = async (params) => {
    return { data: generateMockOrdersData(params?.period || 'monthly') };
  };

  const productAnalytics = async (params) => {
    return { data: generateMockProductsData() };
  };

  const farmerAnalytics = async (params) => {
    return { data: generateMockFarmersData() };
  };

  // Mock data generators
  const generateMockSalesData = (period) => {
    const today = new Date();
    const data = [];
    
    switch(period) {
      case 'daily':
        for(let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          data.unshift({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 100) + 20
          });
        }
        break;
      case 'weekly':
        for(let i = 0; i < 4; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 7));
          data.unshift({
            date: `Week ${4-i}`,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            orders: Math.floor(Math.random() * 300) + 100
          });
        }
        break;
      case 'yearly':
        const years = [2020, 2021, 2022, 2023, 2024];
        years.forEach(year => {
          data.push({
            date: year.toString(),
            revenue: Math.floor(Math.random() * 100000) + 50000,
            orders: Math.floor(Math.random() * 2000) + 1000
          });
        });
        break;
      case 'monthly':
      default:
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months.forEach(month => {
          data.push({
            date: month,
            revenue: Math.floor(Math.random() * 25000) + 10000,
            orders: Math.floor(Math.random() * 500) + 200
          });
        });
    }
    
    return data;
  };

  const generateMockOrdersData = (period) => {
    const today = new Date();
    const data = [];
    
    switch(period) {
      case 'daily':
        for(let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          data.unshift({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            orders: Math.floor(Math.random() * 100) + 20,
            value: Math.floor(Math.random() * 5000) + 1000
          });
        }
        break;
      case 'weekly':
        for(let i = 0; i < 4; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - (i * 7));
          data.unshift({
            date: `Week ${4-i}`,
            orders: Math.floor(Math.random() * 300) + 100,
            value: Math.floor(Math.random() * 15000) + 5000
          });
        }
        break;
      case 'monthly':
      default:
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months.forEach(month => {
          data.push({
            date: month,
            orders: Math.floor(Math.random() * 500) + 200,
            value: Math.floor(Math.random() * 25000) + 10000
          });
        });
    }
    
    return data;
  };

  const generateMockProductsData = () => {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Grains'];
    return categories.map(category => ({
      category,
      value: Math.floor(Math.random() * 10000) + 5000,
      percentage: Math.floor(Math.random() * 30) + 10
    }));
  };

  const generateMockFarmersData = () => {
    const farmers = ['Green Valley Farm', 'Sunshine Organics', 'Fresh Harvest Co', 
                     'Happy Hens Farm', 'Organic Oasis', 'Mountain View Farm'];
    return farmers.map(farmer => ({
      farmer,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      products: Math.floor(Math.random() * 50) + 10
    })).sort((a, b) => b.revenue - a.revenue);
  };

  const generateMockTopProducts = () => {
    return [
      { id: 1, name: 'Organic Apples', category: 'Fruits', sales: 245, revenue: 1225, growth: 15 },
      { id: 2, name: 'Fresh Tomatoes', category: 'Vegetables', sales: 189, revenue: 945, growth: 8 },
      { id: 3, name: 'Free-range Eggs', category: 'Dairy', sales: 156, revenue: 780, growth: 12 },
      { id: 4, name: 'Whole Wheat Bread', category: 'Bakery', sales: 134, revenue: 670, growth: -3 },
      { id: 5, name: 'Organic Chicken', category: 'Meat', sales: 98, revenue: 980, growth: 22 },
      { id: 6, name: 'Avocado', category: 'Fruits', sales: 87, revenue: 870, growth: 18 },
      { id: 7, name: 'Spinach', category: 'Vegetables', sales: 76, revenue: 380, growth: 5 },
      { id: 8, name: 'Milk', category: 'Dairy', sales: 65, revenue: 325, growth: 9 },
      { id: 9, name: 'Honey', category: 'Sweeteners', sales: 54, revenue: 540, growth: 25 },
      { id: 10, name: 'Potatoes', category: 'Vegetables', sales: 43, revenue: 215, growth: 7 }
    ];
  };

  const periodOptions = useMemo(() => [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'yearly', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ], []);

  const productColumns = useMemo(() => [
    { 
      key: 'name', 
      title: 'Product',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'category', 
      title: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {value}
        </span>
      )
    },
    { 
      key: 'sales', 
      title: 'Units Sold',
      sortable: true,
      align: 'right',
      render: (value) => value.toLocaleString()
    },
    { 
      key: 'revenue', 
      title: 'Revenue',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-green-600">
          ${value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'growth',
      title: 'Growth',
      sortable: true,
      align: 'right',
      render: (value) => {
        const isPositive = value >= 0;
        return (
          <span className={`inline-flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">{isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(value)}%</span>
          </span>
        );
      }
    }
  ], []);

  const statsCards = useMemo(() => [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue ? `$${analytics.totalRevenue.toLocaleString()}` : '$0',
      change: analytics?.revenueChange || 12.5,
      color: "green",
      icon: "💰",
      description: "Total sales revenue"
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders?.toLocaleString() || '0',
      change: analytics?.ordersChange || 8.2,
      color: "blue",
      icon: "📦",
      description: "Number of orders placed"
    },
    {
      title: "Average Order Value",
      value: analytics?.avgOrderValue ? `$${analytics.avgOrderValue.toFixed(2)}` : '$0',
      change: analytics?.aovChange || 4.2,
      color: "purple",
      icon: "💵",
      description: "Average value per order"
    },
    {
      title: "Active Users",
      value: analytics?.activeUsers?.toLocaleString() || '0',
      change: analytics?.userGrowth || 5.7,
      color: "yellow",
      icon: "👥",
      description: "Active customers"
    },
    {
      title: "Conversion Rate",
      value: analytics?.conversionRate ? `${analytics.conversionRate.toFixed(1)}%` : '0%',
      change: analytics?.conversionChange || 2.3,
      color: "indigo",
      icon: "📈",
      description: "Visitor to order conversion"
    },
    {
      title: "Total Products",
      value: analytics?.totalProducts?.toLocaleString() || '0',
      change: analytics?.productGrowth || 3.4,
      color: "pink",
      icon: "📊",
      description: "Active products listed"
    }
  ], [analytics]);

  const sortedTopProducts = useMemo(() => {
    if (!sortConfig.key) return topProducts;
    
    return [...topProducts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [topProducts, sortConfig]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTopProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTopProducts, currentPage]);

  const totalPages = Math.ceil(sortedTopProducts.length / itemsPerPage);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setError(null);
      const isRefreshing = !loading;
      if (isRefreshing) {
        setRefreshing(true);
      }

      const params = {
        period,
        ...(period === 'custom' && {
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0]
        })
      };

      const [
        analyticsRes, 
        salesRes, 
        ordersRes, 
        productsRes, 
        farmersRes
      ] = await Promise.all([
        getAdminAnalytics(params),
        salesAnalytics(params),
        orderAnalytics(params),
        productAnalytics(params),
        farmerAnalytics(params)
      ]);
      
      setAnalytics(analyticsRes.data);
      setSalesData(salesRes.data);
      setOrdersData(ordersRes.data);
      setProductsData(productsRes.data);
      setFarmersData(farmersRes.data);
      setTopProducts(generateMockTopProducts());
      
      if (isRefreshing) {
        addNotification({
          type: 'success',
          title: 'Success',
          message: 'Analytics data refreshed successfully',
        });
      }
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load analytics data',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, dateRange, loading]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const handlePeriodChange = (value) => {
    setPeriod(value);
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setPeriod('custom');
  };

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleExportData = () => {
    const data = {
      analytics,
      salesData,
      ordersData,
      productsData,
      farmersData,
      topProducts,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: 'Analytics data exported successfully',
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const LoadingSpinner = ({ text = "Loading...", fullScreen = false }) => {
    const containerClass = fullScreen 
      ? "min-h-screen flex items-center justify-center"
      : "py-12 flex flex-col items-center justify-center";
    
    return (
      <div className={containerClass}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">{text}</p>
      </div>
    );
  };

  const StatsCard = ({ title, value, change, color, icon, description, compact = false }) => {
    const colorClasses = {
      green: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' }
    };
    
    const config = colorClasses[color] || colorClasses.blue;
    
    return (
      <div className={`bg-white rounded-xl shadow-sm border ${config.border} p-${compact ? '4' : '6'} hover:shadow-md transition-all`}>
        <div className="flex items-center justify-between mb-3">
          <div className={`p-3 rounded-lg ${config.bg} ${config.text}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
        <h3 className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>{value}</h3>
        <p className="text-gray-700 font-medium mt-1">{title}</p>
        {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
      </div>
    );
  };

  const DataTable = ({ columns, data, emptyMessage = "No data available", loading = false, className = "" }) => {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.className || ''}`}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : ''}`}>
                      {column.title}
                      {column.sortable && sortConfig.key === column.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((row, index) => (
                  <tr 
                    key={row.id || index} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap ${column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const ChartContainer = ({ title, description, children, height = 300, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div style={{ height: `${height}px` }} className="relative">
        {children}
      </div>
    </div>
  );

  const renderChart = (data, type = 'bar', color = 'blue') => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available
        </div>
      );
    }

    const maxValue = Math.max(...data.map(d => d.revenue || d.orders || d.value || 0));
    const colors = {
      blue: { bar: 'bg-blue-500', line: 'bg-blue-200', hover: 'hover:bg-blue-600' },
      green: { bar: 'bg-green-500', line: 'bg-green-200', hover: 'hover:bg-green-600' },
      purple: { bar: 'bg-purple-500', line: 'bg-purple-200', hover: 'hover:bg-purple-600' }
    };
    const colorSet = colors[color] || colors.blue;

    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end space-x-2 pb-6">
          {data.map((item, index) => {
            const value = item.revenue || item.orders || item.value || 0;
            const height = (value / maxValue) * 80;
            return (
              <div key={index} className="flex-1 flex flex-col items-center group">
                {type === 'bar' ? (
                  <div
                    className={`w-3/4 ${colorSet.bar} ${colorSet.hover} rounded-t transition-all relative`}
                    style={{ height: `${height}%` }}
                    title={`${item.date || item.category || item.farmer}: $${value.toLocaleString()}`}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${value.toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      className={`w-2 h-2 ${colorSet.bar} rounded-full absolute -left-1`}
                      style={{ bottom: `${height}%` }}
                    />
                    {index < data.length - 1 && (
                      <div
                        className={`absolute w-4 h-0.5 ${colorSet.bar} rotate-45`}
                        style={{ 
                          left: '50%',
                          bottom: `${height}%`,
                          transformOrigin: 'left center'
                        }}
                      />
                    )}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                  {item.date || item.category || item.farmer}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          {type === 'bar' ? (data[0]?.revenue ? 'Revenue ($)' : 'Orders') : 'Value'}
        </div>
      </div>
    );
  };

  const renderPieChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No data available
        </div>
      );
    }

    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    let currentAngle = 0;

    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          {data.map((item, index) => {
            const percentage = ((item.value || 0) / total) * 100;
            const angle = (percentage / 100) * 360;
            const sliceAngle = currentAngle + angle;
            
            const slice = (
              <div
                key={index}
                className="absolute inset-0 rounded-full"
                style={{
                  clipPath: `conic-gradient(${colors[index % colors.length]} ${currentAngle}deg, transparent ${sliceAngle}deg)`,
                  transform: `rotate(${currentAngle}deg)`
                }}
              />
            );
            
            currentAngle = sliceAngle;
            return slice;
          })}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 w-full max-w-xs">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-700 truncate">{item.category}</span>
              <span className="text-sm font-medium text-gray-900 ml-auto">
                {((item.value || 0) / total * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner text="Loading analytics dashboard..." fullScreen />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your business performance
          </p>
          {analytics?.lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </button>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📥</span> Export
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Picker for Custom Period */}
      {showDatePicker && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateRangeChange({
                  ...dateRange,
                  startDate: new Date(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateRangeChange({
                  ...dateRange,
                  endDate: new Date(e.target.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchAnalyticsData}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} compact />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer 
          title="Sales Performance" 
          description="Revenue trends over time"
          height={300}
        >
          {renderChart(salesData, 'line', 'green')}
          {salesData.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Total: ${salesData.reduce((sum, d) => sum + (d.revenue || 0), 0).toLocaleString()}
                </span>
                <span className="text-gray-600">
                  Avg: ${(salesData.reduce((sum, d) => sum + (d.revenue || 0), 0) / salesData.length).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </ChartContainer>
        
        <ChartContainer 
          title="Order Volume" 
          description="Number of orders by period"
          height={300}
        >
          {renderChart(ordersData, 'bar', 'blue')}
          {ordersData.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Total Orders: {ordersData.reduce((sum, d) => sum + (d.orders || 0), 0)}
                </span>
                <span className="text-gray-600">
                  Period: {period}
                </span>
              </div>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer 
          title="Product Categories" 
          description="Sales distribution by category"
          height={300}
        >
          {renderPieChart(productsData)}
        </ChartContainer>
        
        <ChartContainer 
          title="Top Farmers" 
          description="Revenue contribution by farmer"
          height={300}
        >
          {renderChart(farmersData, 'bar', 'purple')}
          {farmersData.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Top Farmer: {farmersData[0]?.farmer}
                </span>
                <span className="text-gray-600">
                  Revenue: ${farmersData[0]?.revenue?.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Top Performing Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Top Performing Products
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Best selling products by revenue and growth
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {topProducts.length} Products
            </span>
          </div>
        </div>
        
        <DataTable
          columns={productColumns}
          data={paginatedProducts}
          emptyMessage="No product data available"
          loading={refreshing}
          className="rounded-lg"
        />

        {topProducts.length > 0 && (
          <>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedTopProducts.length)} of {sortedTopProducts.length} products
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Total Revenue: ${topProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                </span>
                <span>
                  Total Units Sold: {topProducts.reduce((sum, p) => sum + p.sales, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Additional Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Customer Retention</span>
              <span className="font-medium text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Delivery Time</span>
              <span className="font-medium text-blue-600">2.4 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Return Rate</span>
              <span className="font-medium text-yellow-600">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Customer Satisfaction</span>
              <span className="font-medium text-purple-600">4.8/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {[
              { description: 'New order #ORD-1045 placed', time: '10 min ago' },
              { description: 'Product "Organic Apples" stock updated', time: '25 min ago' },
              { description: 'Weekly sales report generated', time: '1 hour ago' },
              { description: 'New farmer "Green Valley Farm" registered', time: '2 hours ago' },
              { description: 'System backup completed', time: '4 hours ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">{activity.description}</span>
                <span className="ml-auto text-gray-500 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Performance Summary</h4>
          <p className="text-sm text-gray-600 mb-4">
            Your store is performing well with {analytics?.ordersChange || 8.2}% growth in orders compared to last period. Customer satisfaction remains high at 92%.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Growth Target</span>
              <span className="font-medium">15%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${Math.min((analytics?.revenueChange || 12.5) / 15 * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleRefresh}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Detailed Report
            </button>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 pt-4 border-t">
        Data last updated: {analytics?.lastUpdated ? 
          new Date(analytics.lastUpdated).toLocaleString() : 
          new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default AdminAnalytics;