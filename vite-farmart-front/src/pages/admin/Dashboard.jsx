import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminStats, getSalesAnalytics, getOrderAnalytics } from '../api/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [orderFilter, setOrderFilter] = useState('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Mock notification function - replace with your actual implementation
  const addNotification = (notification) => {
    console.log('Notification:', notification);
  };

  // Mock API functions - replace with your actual API calls
  const salesAnalytics = async () => {
    return { data: generateMockSalesData(period) };
  };

  const orderAnalytics = async () => {
    return { data: generateMockOrdersData(period) };
  };

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
    const statuses = ['Delivered', 'Processing', 'Shipped', 'Pending', 'Cancelled'];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      orderNumber: `ORD-${1000 + i}`,
      customer: ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'][i % 5],
      email: 'customer@example.com',
      amount: Math.floor(Math.random() * 500) + 50,
      status: statuses[i % 5],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: Math.floor(Math.random() * 10) + 1
    }));
  };

  const statsCards = useMemo(() => [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : '$0',
      change: stats?.revenueChange || 12.5,
      color: "green",
      icon: "💰",
      trend: "up",
      description: "Total sales revenue"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toLocaleString() || '0',
      change: stats?.ordersChange || 8.2,
      color: "blue",
      icon: "📦",
      trend: "up",
      description: "Number of orders placed"
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers?.toLocaleString() || '0',
      change: stats?.customersChange || 5.7,
      color: "purple",
      icon: "👥",
      trend: "up",
      description: "Active customers"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toLocaleString() || '0',
      change: stats?.productsChange || 3.4,
      color: "yellow",
      icon: "📊",
      trend: "up",
      description: "Active products listed"
    },
    {
      title: "Avg. Order Value",
      value: stats?.avgOrderValue ? `$${stats.avgOrderValue.toFixed(2)}` : '$0',
      change: stats?.aovChange || 4.2,
      color: "indigo",
      icon: "💵",
      trend: "up",
      description: "Average value per order"
    },
    {
      title: "Conversion Rate",
      value: stats?.conversionRate ? `${stats.conversionRate.toFixed(1)}%` : '0%',
      change: stats?.conversionChange || 2.3,
      color: "pink",
      icon: "📈",
      trend: "up",
      description: "Visitor to order conversion"
    }
  ], [stats]);

  const orderColumns = useMemo(() => [
    { 
      key: 'orderNumber', 
      title: 'Order #',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">
          {value}
        </span>
      )
    },
    { 
      key: 'customer', 
      title: 'Customer',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          {row.email && <div className="text-xs text-gray-500">{row.email}</div>}
        </div>
      )
    },
    { 
      key: 'amount', 
      title: 'Amount',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          ${value.toFixed(2)}
        </span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      sortable: true,
      render: (value) => {
        const statusConfig = {
          'Delivered': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
          'Processing': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
          'Shipped': { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' },
          'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
          'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
        };
        const config = statusConfig[value] || statusConfig.Pending;
        
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
            <span className={`w-2 h-2 rounded-full ${config.dot} mr-2`}></span>
            {value}
          </span>
        );
      }
    },
    { 
      key: 'date', 
      title: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },
    {
      key: 'actions',
      title: '',
      align: 'right',
      render: (_, row) => (
        <button
          onClick={() => handleViewOrder(row)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View
        </button>
      )
    }
  ], []);

  const orderFilterOptions = useMemo(() => [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ], []);

  const periodOptions = useMemo(() => [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'quarterly', label: 'This Quarter' },
    { value: 'yearly', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ], []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const [statsRes, salesRes, ordersRes] = await Promise.all([
        getAdminStats(),
        salesAnalytics(),
        orderAnalytics(),
      ]);
      
      setStats(statsRes.data);
      setSalesData(salesRes.data);
      setOrdersData(ordersRes.data);
      
      // Filter recent orders
      const filteredOrders = generateMockOrdersData(period).slice(0, 10);
      setRecentOrders(filteredOrders);
      
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Unable to load dashboard data. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const handlePeriodChange = (value) => {
    setPeriod(value);
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleOrderFilterChange = (value) => {
    setOrderFilter(value);
    // In real app, you would filter orders here
    const filtered = generateMockOrdersData(period)
      .filter(order => value === 'all' || order.status.toLowerCase() === value.toLowerCase())
      .slice(0, 10);
    setRecentOrders(filtered);
  };

  const handleViewOrder = (order) => {
    console.log('View order:', order);
    addNotification({
      type: 'info',
      title: 'Order Details',
      message: `Viewing order ${order.orderNumber}`,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleExportData = () => {
    // Export logic here
    const data = {
      stats,
      salesData,
      ordersData,
      recentOrders
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: 'Dashboard data exported successfully',
    });
  };

  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );

  const StatsCard = ({ title, value, change, color, icon, description }) => {
    const colorClasses = {
      green: 'bg-green-50 text-green-800',
      blue: 'bg-blue-50 text-blue-800',
      purple: 'bg-purple-50 text-purple-800',
      yellow: 'bg-yellow-50 text-yellow-800',
      indigo: 'bg-indigo-50 text-indigo-800',
      pink: 'bg-pink-50 text-pink-800'
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        </div>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        <p className="text-gray-600 mt-2">{title}</p>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
    );
  };

  const DataTable = ({ columns, data, onRowClick, emptyMessage = "No data available", className = "" }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const sortedData = useMemo(() => {
      if (!sortConfig.key) return data;
      
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }, [data, sortConfig]);

    const paginatedData = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key) => {
      setSortConfig(current => ({
        key,
        direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
      }));
    };

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
                    }`}
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
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr 
                    key={row.id || index} 
                    className="hover:bg-gray-50 transition-colors"
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          column.align === 'right' ? 'text-right' : ''
                        }`}
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
        
        {sortedData.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
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
        )}
      </div>
    );
  };

  const ChartContainer = ({ title, children, height = 300, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height: `${height}px` }} className="relative">
        {children}
      </div>
    </div>
  );

  const renderSimpleChart = (data, type = 'bar') => {
    const maxValue = Math.max(...data.map(d => d.revenue || d.orders || 0));
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 flex items-end space-x-2">
          {data.map((item, index) => {
            const height = ((item.revenue || item.orders || 0) / maxValue) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${type === 'bar' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} rounded-t transition-all`}
                  style={{ height: `${height}%` }}
                  title={`${item.date}: $${item.revenue || item.orders}`}
                />
                <div className="mt-2 text-xs text-gray-500 truncate w-full text-center">
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          {type === 'bar' ? 'Revenue ($)' : 'Orders'}
        </div>
      </div>
    );
  };

  if (loading && !refreshing) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
          {stats?.lastUpdated && (
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
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Sales Overview" height={300}>
          {renderSimpleChart(salesData, 'bar')}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total: ${salesData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</span>
              <span className="text-gray-600">Period: {period}</span>
            </div>
          </div>
        </ChartContainer>
        
        <ChartContainer title="Order Trends" height={300}>
          {renderSimpleChart(ordersData, 'line')}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Orders: {ordersData.reduce((sum, d) => sum + d.orders, 0)}</span>
              <span className="text-gray-600">Avg: {(ordersData.reduce((sum, d) => sum + d.orders, 0) / ordersData.length).toFixed(0)}/day</span>
            </div>
          </div>
        </ChartContainer>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <p className="text-sm text-gray-600">Latest orders from your store</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={orderFilter}
                onChange={(e) => handleOrderFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {orderFilterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {recentOrders.length} Orders
              </span>
            </div>
          </div>
        </div>
        
        <DataTable
          columns={orderColumns}
          data={recentOrders}
          onRowClick={handleViewOrder}
          emptyMessage="No orders found"
        />
        
        {recentOrders.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total Revenue: ${recentOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
              </span>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Orders →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Top Selling Categories</h4>
          <div className="space-y-4">
            {['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery'].map((category, index) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${70 - (index * 10)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${(Math.random() * 5000 + 1000).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium text-blue-800">Add New Product</div>
              <div className="text-sm text-blue-600">Create a new product listing</div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium text-green-800">View Reports</div>
              <div className="text-sm text-green-600">Generate detailed analytics reports</div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium text-purple-800">Manage Users</div>
              <div className="text-sm text-purple-600">View and manage customer accounts</div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Summary</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer Satisfaction</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Fulfillment Time</span>
              <span className="font-semibold text-blue-600">2.4 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Return Rate</span>
              <span className="font-semibold text-yellow-600">3.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Promotions</span>
              <span className="font-semibold text-purple-600">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;