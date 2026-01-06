import React, { useState, useEffect } from 'react';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Mock orders data
  const mockOrders = [
    { 
      id: 1, 
      orderNumber: 'ORD-001', 
      product: 'Organic Apples', 
      quantity: 10, 
      amount: 50.00, 
      customer: 'John Doe', 
      email: 'john@example.com',
      phone: '(123) 456-7890',
      status: 'pending',
      createdAt: '2024-01-15T10:30:00Z',
      estimatedDelivery: '2024-01-20',
      address: '123 Main St, New York, NY 10001',
      notes: 'Please package carefully',
      items: [
        { product: 'Organic Apples', quantity: 10, price: 4.99, total: 49.90 }
      ]
    },
    { 
      id: 2, 
      orderNumber: 'ORD-002', 
      product: 'Fresh Tomatoes', 
      quantity: 5, 
      amount: 25.00, 
      customer: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '(123) 456-7891',
      status: 'processing',
      createdAt: '2024-01-15T09:15:00Z',
      estimatedDelivery: '2024-01-19',
      address: '456 Oak Ave, Brooklyn, NY 11201',
      notes: 'Customer prefers morning delivery',
      items: [
        { product: 'Fresh Tomatoes', quantity: 5, price: 3.49, total: 17.45 },
        { product: 'Organic Potatoes', quantity: 3, price: 2.99, total: 8.97 }
      ]
    },
    { 
      id: 3, 
      orderNumber: 'ORD-003', 
      product: 'Organic Potatoes', 
      quantity: 20, 
      amount: 40.00, 
      customer: 'Bob Wilson', 
      email: 'bob@example.com',
      phone: '(123) 456-7892',
      status: 'shipped',
      createdAt: '2024-01-14T14:20:00Z',
      estimatedDelivery: '2024-01-18',
      address: '789 Pine St, Queens, NY 11355',
      notes: '',
      items: [
        { product: 'Organic Potatoes', quantity: 20, price: 2.99, total: 59.80 }
      ]
    },
    { 
      id: 4, 
      orderNumber: 'ORD-004', 
      product: 'Carrots', 
      quantity: 15, 
      amount: 30.00, 
      customer: 'Alice Brown', 
      email: 'alice@example.com',
      phone: '(123) 456-7893',
      status: 'delivered',
      createdAt: '2024-01-14T11:45:00Z',
      deliveredAt: '2024-01-17T14:30:00Z',
      address: '321 Maple Ave, Bronx, NY 10451',
      notes: 'Left at front door',
      items: [
        { product: 'Carrots', quantity: 15, price: 1.99, total: 29.85 }
      ]
    },
    { 
      id: 5, 
      orderNumber: 'ORD-005', 
      product: 'Onions', 
      quantity: 8, 
      amount: 16.00, 
      customer: 'Charlie Davis', 
      email: 'charlie@example.com',
      phone: '(123) 456-7894',
      status: 'cancelled',
      createdAt: '2024-01-13T16:10:00Z',
      cancelledAt: '2024-01-14T09:30:00Z',
      address: '654 Elm St, Manhattan, NY 10016',
      notes: 'Customer requested cancellation',
      items: [
        { product: 'Onions', quantity: 8, price: 1.49, total: 11.92 }
      ]
    },
    { 
      id: 6, 
      orderNumber: 'ORD-006', 
      product: 'Free-range Eggs', 
      quantity: 2, 
      amount: 13.98, 
      customer: 'David Miller', 
      email: 'david@example.com',
      phone: '(123) 456-7895',
      status: 'delivered',
      createdAt: '2024-01-13T08:30:00Z',
      deliveredAt: '2024-01-16T11:15:00Z',
      address: '987 Cedar St, Staten Island, NY 10301',
      notes: '',
      items: [
        { product: 'Free-range Eggs', quantity: 2, price: 6.99, total: 13.98 }
      ]
    },
    { 
      id: 7, 
      orderNumber: 'ORD-007', 
      product: 'Organic Milk', 
      quantity: 3, 
      amount: 17.97, 
      customer: 'Eva Wilson', 
      email: 'eva@example.com',
      phone: '(123) 456-7896',
      status: 'pending',
      createdAt: '2024-01-12T13:45:00Z',
      estimatedDelivery: '2024-01-17',
      address: '147 Birch St, New York, NY 10022',
      notes: 'Requires refrigeration',
      items: [
        { product: 'Organic Milk', quantity: 3, price: 5.99, total: 17.97 }
      ]
    },
    { 
      id: 8, 
      orderNumber: 'ORD-008', 
      product: 'Organic Chicken', 
      quantity: 1, 
      amount: 12.99, 
      customer: 'Frank Taylor', 
      email: 'frank@example.com',
      phone: '(123) 456-7897',
      status: 'processing',
      createdAt: '2024-01-12T10:20:00Z',
      estimatedDelivery: '2024-01-16',
      address: '258 Spruce St, Brooklyn, NY 11215',
      notes: 'Customer will be home after 5 PM',
      items: [
        { product: 'Organic Chicken', quantity: 1, price: 12.99, total: 12.99 }
      ]
    },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const statusActions = {
    pending: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

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

  // Mock API function
  const getFarmerOrders = async (farmerId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockOrders };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const farmerId = 'current-farmer-id';
      const response = await getFarmerOrders(farmerId);
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load orders',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: newStatus,
              ...(newStatus === 'delivered' && { deliveredAt: new Date().toISOString() }),
              ...(newStatus === 'cancelled' && { cancelledAt: new Date().toISOString() })
            }
          : order
      ));
      
      addNotification({
        type: 'success',
        title: 'Status Updated',
        message: `Order status updated to ${newStatus}`,
      });
      
      setUpdateModalOpen(false);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update order status',
      });
    }
  };

  const handleOpenUpdateModal = (order, status) => {
    setSelectedOrder(order);
    setSelectedStatus(status);
    setUpdateModalOpen(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.amount, 0)
      .toFixed(2)
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

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
      small: 'max-w-md',
      medium: 'max-w-lg',
      large: 'max-w-2xl',
      xlarge: 'max-w-4xl'
    };
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          ></div>
          
          {/* Modal panel */}
          <div className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: 'bg-gray-100 text-gray-800', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      shipped: { color: 'bg-yellow-100 text-yellow-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading orders..." />
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage orders for your farm products</p>
          </div>
          
          <Button
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                fetchOrders();
                addNotification({
                  type: 'success',
                  title: 'Orders Refreshed',
                  message: 'Order list has been updated'
                });
              }, 300);
            }}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            Refresh Orders
          </Button>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Processing</div>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Shipped</div>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Delivered</div>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by order #, product, or customer..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Actions */}
            <div className="flex items-end">
              <Button
                onClick={() => {
                  const pendingOrders = orders.filter(o => o.status === 'pending');
                  if (pendingOrders.length === 0) {
                    addNotification({
                      type: 'info',
                      title: 'No Pending Orders',
                      message: 'There are no pending orders to process'
                    });
                    return;
                  }
                  addNotification({
                    type: 'info',
                    title: 'Batch Processing',
                    message: `Processing ${pendingOrders.length} pending orders`
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Process All Pending
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error}
          onDismiss={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.product}</div>
                      {order.items.length > 1 && (
                        <div className="text-xs text-gray-500">+ {order.items.length - 1} more items</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {statusActions[order.status]?.map((action) => (
                          <Button
                            key={action}
                            onClick={() => handleOpenUpdateModal(order, action)}
                            size="small"
                            variant={action === 'cancelled' ? 'danger' : 'primary'}
                            className="text-xs"
                          >
                            {action === 'processing' && 'Process'}
                            {action === 'shipped' && 'Ship'}
                            {action === 'delivered' && 'Deliver'}
                            {action === 'cancelled' && 'Cancel'}
                          </Button>
                        ))}
                        <Button
                          onClick={() => handleViewOrder(order)}
                          variant="outline"
                          size="small"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={`Order ${selectedOrder?.orderNumber}`}
        size="large"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Order Status</div>
                  <div className="mt-1">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Order Date</div>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Estimated Delivery</div>
                  <div className="text-sm text-gray-900">
                    {selectedOrder.estimatedDelivery || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${selectedOrder.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="text-sm text-gray-900">{selectedOrder.customer}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="text-sm text-gray-900">{selectedOrder.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="text-sm text-gray-900">{selectedOrder.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Address</div>
                    <div className="text-sm text-gray-900">{selectedOrder.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.product}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total</td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        ${selectedOrder.amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Order Notes */}
            {selectedOrder.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                onClick={() => setViewModalOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title={`Update Order Status`}
        size="small"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Updating status for:</p>
              <p className="font-medium text-gray-900">{selectedOrder.orderNumber}</p>
              <p className="text-sm text-gray-600">{selectedOrder.product}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-3">Current Status:</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <div className="space-y-2">
                  {statusActions[selectedOrder.status]?.map((action) => (
                    <button
                      key={action}
                      onClick={() => setSelectedStatus(action)}
                      className={`w-full text-left px-4 py-3 rounded-lg border ${
                        selectedStatus === action
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium capitalize">{action}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {action === 'processing' && 'Move order to processing queue'}
                        {action === 'shipped' && 'Mark order as shipped to customer'}
                        {action === 'delivered' && 'Confirm order has been delivered'}
                        {action === 'cancelled' && 'Cancel the order'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => setUpdateModalOpen(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => handleUpdateStatus(selectedOrder.id, selectedStatus)}
                disabled={!selectedStatus}
              >
                Update Status
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FarmerOrders;