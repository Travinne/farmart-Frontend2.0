// OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  // Mock order data
  const mockOrder = {
    id: 'ORD001',
    orderNumber: 'ORD-001',
    createdAt: '2024-01-15T10:30:00Z',
    total: 45.99,
    status: 'shipped',
    deliveryId: 'TRK78901234',
    estimatedDelivery: '2024-01-18T14:30:00Z',
    deliveryAddress: '123 Main St, New York, NY 10001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '(123) 456-7890'
    },
    items: [
      { id: 1, name: 'Organic Apples', quantity: 2, price: 4.99, image: '🍎', category: 'Fruits' },
      { id: 2, name: 'Fresh Tomatoes', quantity: 3, price: 3.49, image: '🍅', category: 'Vegetables' }
    ],
    payment: {
      method: 'Credit Card',
      lastFour: '7890',
      amount: 45.99
    },
    shipping: {
      method: 'Standard Shipping',
      cost: 5.99,
      carrier: 'FarmArt Logistics',
      trackingUrl: '#'
    }
  };

  // Mock delivery data
  const mockDelivery = {
    id: 'TRK78901234',
    status: 'shipped',
    currentLocation: 'New York Distribution Center',
    estimatedDelivery: '2024-01-18T14:30:00Z',
    driver: {
      name: 'Michael Johnson',
      phone: '(987) 654-3210',
      vehicle: 'Delivery Van #NY-789'
    },
    steps: [
      { 
        id: 1, 
        title: 'Order Placed', 
        description: 'Your order has been received', 
        timestamp: '2024-01-15T10:30:00Z',
        completed: true
      },
      { 
        id: 2, 
        title: 'Order Confirmed', 
        description: 'Seller has confirmed your order', 
        timestamp: '2024-01-15T12:45:00Z',
        completed: true
      },
      { 
        id: 3, 
        title: 'Processing', 
        description: 'Preparing your order for shipment', 
        timestamp: '2024-01-16T09:15:00Z',
        completed: true
      },
      { 
        id: 4, 
        title: 'Shipped', 
        description: 'Your order is on its way', 
        timestamp: '2024-01-17T14:20:00Z',
        completed: true,
        current: true
      },
      { 
        id: 5, 
        title: 'Out for Delivery', 
        description: 'Your order is being delivered today', 
        timestamp: null,
        completed: false
      },
      { 
        id: 6, 
        title: 'Delivered', 
        description: 'Order delivered successfully', 
        timestamp: null,
        completed: false
      }
    ]
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

  // Mock API functions
  const getOrderByTracking = async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockOrder };
  };

  const trackDelivery = async (deliveryId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockDelivery };
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      const orderResponse = await getOrderByTracking(id);
      setOrder(orderResponse.data);
      
      if (orderResponse.data.deliveryId) {
        const deliveryResponse = await trackDelivery(orderResponse.data.deliveryId);
        setDelivery(deliveryResponse.data);
        
        // Find active step
        const currentStepIndex = deliveryResponse.data.steps.findIndex(step => step.current || (!step.completed && step.timestamp));
        setActiveStep(Math.max(0, currentStepIndex));
      }
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError('Order not found or tracking unavailable');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load order tracking information',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    addNotification({
      type: 'info',
      title: 'Contact Support',
      message: 'Connecting you to customer support...'
    });
  };

  const handleDownloadInvoice = () => {
    addNotification({
      type: 'success',
      title: 'Invoice Downloaded',
      message: 'Order invoice has been downloaded'
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

  // Delivery Tracker Component
  const DeliveryTracker = ({ steps }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Progress</h2>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex">
                {/* Step indicator */}
                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center mr-6 ${
                  step.completed ? 'bg-green-100 border-4 border-green-300' : 
                  step.current ? 'bg-blue-100 border-4 border-blue-300' : 
                  'bg-gray-100 border-4 border-gray-200'
                }`}>
                  <div className={`text-2xl ${
                    step.completed ? 'text-green-600' : 
                    step.current ? 'text-blue-600' : 
                    'text-gray-400'
                  }`}>
                    {step.completed ? '✅' : step.current ? '🚚' : '⏳'}
                  </div>
                </div>
                
                {/* Step content */}
                <div className="pt-2 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-semibold ${
                        step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                    {step.timestamp && (
                      <div className="text-sm text-gray-500">
                        {new Date(step.timestamp).toLocaleDateString()}
                        <br />
                        {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                  
                  {/* Current step info */}
                  {step.current && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-3">📍</span>
                        <div>
                          <p className="font-medium text-blue-900">Current Location</p>
                          <p className="text-blue-700">{delivery?.currentLocation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Estimated Delivery */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Estimated Delivery</p>
              <p className="text-2xl font-bold text-green-900">
                {new Date(order?.estimatedDelivery || delivery?.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-green-700">
                {new Date(order?.estimatedDelivery || delivery?.estimatedDelivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading order tracking..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The order you're looking for doesn't exist."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/orders')}>
              View Order History
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600">Track your order #{order.orderNumber}</p>
          </div>
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="mt-4 md:mt-0"
          >
            ← Back to Orders
          </Button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="font-medium text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium text-blue-600">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tracking and Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Tracker */}
          <DeliveryTracker steps={delivery?.steps || []} />

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                      <span className="text-2xl">{item.image}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${item.price.toFixed(2)} each</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${order.shipping?.cost?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info and Actions */}
        <div className="space-y-6">
          {/* Delivery Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipping Method</p>
                <p className="font-medium text-gray-900">{order.shipping?.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-medium text-gray-900">{order.shipping?.carrier}</p>
              </div>
              {delivery?.driver && (
                <div>
                  <p className="text-sm text-gray-600">Delivery Driver</p>
                  <p className="font-medium text-gray-900">{delivery.driver.name}</p>
                  <p className="text-sm text-gray-600">{delivery.driver.vehicle}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{order.customer?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{order.customer?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{order.customer?.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-gray-900">{order.payment?.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-medium text-gray-900">${order.payment?.amount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="w-full justify-center"
              >
                <span className="mr-2">📞</span> Contact Support
              </Button>
              <Button
                onClick={handleDownloadInvoice}
                variant="outline"
                className="w-full justify-center"
              >
                <span className="mr-2">📄</span> Download Invoice
              </Button>
              <Button
                onClick={() => navigate('/help')}
                variant="ghost"
                className="w-full justify-center"
              >
                <span className="mr-2">❓</span> View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;