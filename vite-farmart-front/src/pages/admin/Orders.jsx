import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminOrders, adminConfirmOrder, adminCompleteOrder } from '../../api/adminApi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const itemsPerPage = 10;
  
  // Mock notification function - replace with actual implementation
  const addNotification = (notification) => {
    console.log('Notification:', notification);
    // In a real app, this would show a toast notification
    const event = new CustomEvent('show-notification', { 
      detail: {
        type: notification.type || 'info',
        title: notification.title,
        message: notification.message
      }
    });
    window.dispatchEvent(event);
  };

  // Mock data for development - replace with actual API calls
  const generateMockOrders = () => {
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const customers = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Emily Davis'];
    const products = [
      { name: 'Organic Apples', price: 5 },
      { name: 'Fresh Tomatoes', price: 3 },
      { name: 'Free-range Eggs', price: 6 },
      { name: 'Whole Wheat Bread', price: 4 },
      { name: 'Organic Chicken', price: 12 }
    ];
    
    return Array.from({ length: 50 }, (_, i) => {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const items = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        return {
          product: product.name,
          price: product.price,
          quantity,
          subtotal: product.price * quantity
        };
      });
      
      const total = items.reduce((sum, item) => sum + item.subtotal, 0);
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return {
        id: `ORD${1000 + i}`,
        orderNumber: `ORD-${1000 + i}`,
        customerName: customer,
        customerEmail: `${customer.toLowerCase().replace(' ', '.')}@example.com`,
        customerPhone: `+1 (555) ${100 + i}-${1000 + i}`,
        customerAddress: `${Math.floor(Math.random() * 1000) + 1} Main St, City, State ${10000 + i}`,
        total,
        status,
        items,
        createdAt: createdAt.toISOString(),
        updatedAt: new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: ['Credit Card', 'PayPal', 'Cash on Delivery'][Math.floor(Math.random() * 3)],
        shippingMethod: ['Standard', 'Express', 'Pickup'][Math.floor(Math.random() * 3)],
        notes: Math.random() > 0.7 ? 'Handle with care' : null
      };
    });
  };

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Statuses', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'processing', label: 'Processing', color: 'purple' },
    { value: 'shipped', label: 'Shipped', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ], []);

  const dateOptions = useMemo(() => [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ], []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // For development, use mock data. Replace with actual API call:
      // const response = await getAdminOrders();
      // setOrders(response.data || []);
      
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(term) ||
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term) ||
        order.customerPhone.includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch(dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
      
      result = result.filter(order => new Date(order.createdAt) >= startDate);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, statusFilter, dateFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleConfirmOrder = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In production, use: await adminConfirmOrder(orderId);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'confirmed' } : order
      ));
      
      addNotification({
        type: 'success',
        title: 'Order Confirmed',
        message: `Order ${orderId} has been confirmed`,
      });
    } catch (err) {
      console.error('Failed to confirm order:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to confirm order',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setActionLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      // For development, simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In production, use: await adminCompleteOrder(orderId);
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'delivered' } : order
      ));
      
      addNotification({
        type: 'success',
        title: 'Order Completed',
        message: `Order ${orderId} has been marked as completed`,
      });
    } catch (err) {
      console.error('Failed to complete order:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to complete order',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleExportOrders = () => {
    const data = {
      orders: filteredOrders,
      filters: { searchTerm, statusFilter, dateFilter },
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    addNotification({
      type: 'success',
      title: 'Export Started',
      message: 'Orders data exported successfully',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' }
    };
    return colors[status] || colors.pending;
  };

  const orderColumns = useMemo(() => [
    { 
      key: 'orderNumber', 
      title: 'Order #',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-semibold text-gray-900">{value}</span>
      )
    },
    { 
      key: 'customerName', 
      title: 'Customer',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.customerEmail}</div>
        </div>
      )
    },
    { 
      key: 'total', 
      title: 'Amount',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      sortable: true,
      render: (value) => {
        const color = getStatusColor(value);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text} ${color.border} border`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></span>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    { 
      key: 'createdAt', 
      title: 'Date',
      sortable: true,
      render: (value) => (
        <div>
          <div>{new Date(value).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    { 
      key: 'items', 
      title: 'Items',
      render: (value) => (
        <span className="text-gray-600">{value.length} item{value.length !== 1 ? 's' : ''}</span>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center justify-end space-x-2">
          {row.status === 'pending' && (
            <button
              onClick={() => handleConfirmOrder(row.id)}
              disabled={actionLoading[row.id]}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {actionLoading[row.id] ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : 'Confirm'}
            </button>
          )}
          {row.status === 'confirmed' && (
            <button
              onClick={() => handleCompleteOrder(row.id)}
              disabled={actionLoading[row.id]}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {actionLoading[row.id] ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : 'Complete'}
            </button>
          )}
          <button
            onClick={() => handleViewOrder(row)}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
          >
            View
          </button>
        </div>
      )
    },
  ], [actionLoading]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );

  const OrderModal = () => {
    if (!selectedOrder) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                <p className="text-gray-600">{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customerEmail}</p>
                  <p><span className="font-medium">Phone:</span> {selectedOrder.customerPhone}</p>
                  <p><span className="font-medium">Address:</span> {selectedOrder.customerAddress}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(selectedOrder.status).bg} ${getStatusColor(selectedOrder.status).text}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </p>
                  <p><span className="font-medium">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><span className="font-medium">Last Updated:</span> {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                  <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                  <p><span className="font-medium">Shipping Method:</span> {selectedOrder.shippingMethod}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.product}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${item.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</td>
                      <td className="px-4 py-3 text-lg font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {selectedOrder.notes && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  {selectedOrder.notes}
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                <button
                  onClick={() => {
                    if (selectedOrder.status === 'pending') {
                      handleConfirmOrder(selectedOrder.id);
                    } else if (selectedOrder.status === 'confirmed') {
                      handleCompleteOrder(selectedOrder.id);
                    }
                    setShowOrderModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {selectedOrder.status === 'pending' ? 'Confirm Order' : 'Mark as Delivered'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading orders..." />;
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and process customer orders</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={handleExportOrders}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> Export
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Orders</p>
              <h3 className="text-3xl font-bold text-gray-900">{orders.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">All time orders</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">From all orders</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Pending Orders</p>
              <h3 className="text-3xl font-bold text-gray-900">{pendingOrders}</h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Need attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Orders</label>
            <input
              type="text"
              placeholder="Search by order #, customer, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex gap-2">
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear Status Filter
              </button>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Customer Orders</h3>
          <p className="text-sm text-gray-600">Manage and process customer orders</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {orderColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.align === 'right' ? 'text-right' : ''}`}
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
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    {orderColumns.map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap ${column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.render ? column.render(order[column.key], order) : order[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={orderColumns.length} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📭</span>
                      <p className="text-lg font-medium text-gray-700">No orders found</p>
                      <p className="text-gray-600">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Orders by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {statusOptions.slice(1).map((status) => {
            const count = orders.filter(order => order.status === status.value).length;
            const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
            
            return (
              <div key={status.value} className="text-center p-4 rounded-lg border">
                <div className={`text-lg font-bold mb-1 ${getStatusColor(status.value).text}`}>
                  {count}
                </div>
                <div className="text-sm text-gray-600">{status.label}</div>
                <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && <OrderModal />}
    </div>
  );
};

export default AdminOrders;