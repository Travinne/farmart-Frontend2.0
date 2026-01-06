// OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD001',
      orderNumber: 'ORD-001',
      date: '2024-01-15T10:30:00Z',
      total: 45.99,
      status: 'delivered',
      items: [
        { id: 1, name: 'Organic Apples', quantity: 2, price: 4.99, image: '🍎' },
        { id: 2, name: 'Fresh Tomatoes', quantity: 3, price: 3.49, image: '🍅' }
      ],
      deliveryAddress: '123 Main St, New York, NY 10001',
      estimatedDelivery: '2024-01-18',
      deliveredAt: '2024-01-18T14:30:00Z',
      trackingId: 'TRK78901234'
    },
    {
      id: 'ORD002',
      orderNumber: 'ORD-002',
      date: '2024-01-12T14:20:00Z',
      total: 89.50,
      status: 'processing',
      items: [
        { id: 3, name: 'Free-range Eggs', quantity: 1, price: 6.99, image: '🥚' },
        { id: 4, name: 'Organic Potatoes', quantity: 5, price: 2.99, image: '🥔' },
        { id: 5, name: 'Carrots', quantity: 3, price: 1.99, image: '🥕' }
      ],
      deliveryAddress: '456 Oak Ave, Brooklyn, NY 11201',
      estimatedDelivery: '2024-01-17',
      trackingId: 'TRK78901235'
    },
    {
      id: 'ORD003',
      orderNumber: 'ORD-003',
      date: '2024-01-10T09:15:00Z',
      total: 24.99,
      status: 'shipped',
      items: [
        { id: 6, name: 'Onions', quantity: 4, price: 1.49, image: '🧅' },
        { id: 7, name: 'Organic Milk', quantity: 2, price: 5.99, image: '🥛' }
      ],
      deliveryAddress: '789 Pine St, Queens, NY 11355',
      estimatedDelivery: '2024-01-14',
      shippedAt: '2024-01-13T11:45:00Z',
      trackingId: 'TRK78901236'
    },
    {
      id: 'ORD004',
      orderNumber: 'ORD-004',
      date: '2024-01-08T16:45:00Z',
      total: 67.45,
      status: 'delivered',
      items: [
        { id: 8, name: 'Organic Chicken', quantity: 1, price: 12.99, image: '🍗' },
        { id: 9, name: 'Fresh Lettuce', quantity: 2, price: 3.99, image: '🥬' },
        { id: 10, name: 'Bell Peppers', quantity: 4, price: 2.49, image: '🫑' }
      ],
      deliveryAddress: '321 Maple Ave, Bronx, NY 10451',
      estimatedDelivery: '2024-01-12',
      deliveredAt: '2024-01-12T09:15:00Z',
      trackingId: 'TRK78901237'
    },
    {
      id: 'ORD005',
      orderNumber: 'ORD-005',
      date: '2024-01-05T11:30:00Z',
      total: 32.97,
      status: 'cancelled',
      items: [
        { id: 11, name: 'Strawberries', quantity: 3, price: 5.99, image: '🍓' },
        { id: 12, name: 'Bananas', quantity: 6, price: 0.99, image: '🍌' }
      ],
      deliveryAddress: '654 Elm St, Manhattan, NY 10016',
      cancelledAt: '2024-01-06T10:20:00Z',
      trackingId: 'TRK78901238'
    },
    {
      id: 'ORD006',
      orderNumber: 'ORD-006',
      date: '2024-01-03T13:50:00Z',
      total: 58.95,
      status: 'delivered',
      items: [
        { id: 13, name: 'Avocados', quantity: 5, price: 2.99, image: '🥑' },
        { id: 14, name: 'Cucumbers', quantity: 3, price: 1.49, image: '🥒' },
        { id: 15, name: 'Organic Spinach', quantity: 2, price: 4.99, image: '🍃' }
      ],
      deliveryAddress: '987 Cedar St, Staten Island, NY 10301',
      estimatedDelivery: '2024-01-07',
      deliveredAt: '2024-01-07T16:30:00Z',
      trackingId: 'TRK78901239'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'cancelled', label: 'Cancelled' }
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

  // Mock API function
  const getOrders = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockOrders };
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load order history',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status and search
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalSpent: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0)
      .toFixed(2)
  };

  const handleViewDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/tracking/${orderId}`);
  };

  const handleReorder = (order) => {
    addNotification({
      type: 'success',
      title: 'Order Recreated',
      message: `${order.items.length} items from order ${order.orderNumber} added to cart`
    });
  };

  const handleDownloadInvoice = (order) => {
    addNotification({
      type: 'info',
      title: 'Invoice Download',
      message: `Invoice for order ${order.orderNumber} is being prepared`
    });
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

  // Order Card Component
  const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'delivered': return '✅';
        case 'processing': return '🔄';
        case 'shipped': return '🚚';
        case 'cancelled': return '❌';
        default: return '📦';
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Order Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <span className="text-xl mr-2">{getStatusIcon(order.status)}</span>
              <h3 className="font-semibold text-gray-900">Order #{order.orderNumber}</h3>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(order.date).toLocaleDateString()} • {order.items.length} items
            </p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        {/* Order Items Preview */}
        <div className="mb-4">
          <div className="flex -space-x-2 mb-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-lg">
                {item.image}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {order.items.slice(0, 2).map(item => item.name).join(', ')}
            {order.items.length > 2 && ` and ${order.items.length - 2} more`}
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Address</span>
            <span className="text-gray-900 truncate ml-2 max-w-[150px]">{order.deliveryAddress}</span>
          </div>
          {order.estimatedDelivery && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimated Delivery</span>
              <span className="text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={() => handleViewDetails(order.id)}
            variant="outline"
            size="small"
            className="flex-1"
          >
            View Details
          </Button>
          {order.status !== 'cancelled' && (
            <Button
              onClick={() => handleTrackOrder(order.id)}
              variant="ghost"
              size="small"
              className="flex-1"
            >
              Track Order
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading order history..." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        <p className="text-gray-600">View and manage all your past orders</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Delivered</div>
          <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Processing</div>
          <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Shipped</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.shipped}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Cancelled</div>
          <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalSpent}</div>
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
                placeholder="Search by order # or product..."
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
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              defaultValue="all"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || filterStatus !== 'all' ? 'No matching orders' : 'No orders yet'}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search criteria' 
              : 'Start shopping to see your order history here'}
          </p>
          <Button onClick={() => navigate('/products')}>
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 