import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantityUpdating, setQuantityUpdating] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Mock cart data - replace with actual API call
  const mockCartItems = [
    {
      id: '1',
      productId: 'PROD1001',
      name: 'Organic Apples',
      price: 4.99,
      quantity: 2,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
      category: 'Fruits',
      unit: 'lb',
      farmer: 'Green Valley Farm'
    },
    {
      id: '2',
      productId: 'PROD1002',
      name: 'Fresh Tomatoes',
      price: 3.49,
      quantity: 3,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w-400&h=400&fit=crop',
      category: 'Vegetables',
      unit: 'lb',
      farmer: 'Sunshine Organics'
    },
    {
      id: '3',
      productId: 'PROD1003',
      name: 'Free-range Eggs',
      price: 6.99,
      quantity: 1,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
      category: 'Dairy',
      unit: 'dozen',
      farmer: 'Happy Hens Farm'
    }
  ];

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99;
  const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount for promo
  const total = subtotal + tax + shipping - discount;

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

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setCartItems(mockCartItems);
      addNotification({
        type: 'success',
        title: 'Cart Loaded',
        message: 'Your cart items are ready'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load cart items'
      });
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateCartItem = async (itemId, quantity) => {
    if (quantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    
    setQuantityUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
      );
      
      addNotification({
        type: 'success',
        title: 'Cart Updated',
        message: 'Item quantity updated'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update item quantity'
      });
    } finally {
      setQuantityUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setCartItems([]);
    } catch (error) {
      throw error;
    }
  };

  // Apply promo code
  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    
    const validPromoCodes = ['SAVE10', 'FARMART20', 'WELCOME15'];
    
    if (validPromoCodes.includes(promoCode.toUpperCase())) {
      setAppliedPromo(promoCode.toUpperCase());
      addNotification({
        type: 'success',
        title: 'Promo Applied',
        message: `Promo code ${promoCode.toUpperCase()} applied successfully!`
      });
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid Code',
        message: 'The promo code you entered is invalid or expired'
      });
    }
    
    setPromoCode('');
  };

  // Handle checkout
  const handleCheckout = () => {
    addNotification({
      type: 'success',
      title: 'Proceeding to Checkout',
      message: `Your order total is $${total.toFixed(2)}`
    });
    
    // Navigate to checkout page
    setTimeout(() => {
      navigate('/checkout');
    }, 1500);
  };

  useEffect(() => {
    fetchCart();
  }, []);

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
    as = 'button',
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
    
    const Component = as;
    
    return (
      <Component
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
      </Component>
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

  // Cart Item Component
  const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    const [localQuantity, setLocalQuantity] = useState(item.quantity);
    
    const handleQuantityChange = (change) => {
      const newQuantity = localQuantity + change;
      if (newQuantity >= 1 && newQuantity <= item.stock) {
        setLocalQuantity(newQuantity);
        onUpdateQuantity(item.id, newQuantity);
      }
    };
    
    const handleInputChange = (e) => {
      const value = parseInt(e.target.value) || 1;
      const clampedValue = Math.max(1, Math.min(value, item.stock));
      setLocalQuantity(clampedValue);
      onUpdateQuantity(item.id, clampedValue);
    };
    
    return (
      <div className="flex items-center py-6 border-b border-gray-200">
        {/* Product Image */}
        <div className="flex-shrink-0 w-24 h-24">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        
        {/* Product Details */}
        <div className="ml-4 flex-1">
          <div className="flex justify-between">
            <div>
              <Link to={`/products/${item.productId}`} className="font-medium text-gray-900 hover:text-green-600">
                {item.name}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {item.category} • {item.farmer}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} per {item.unit}</p>
            </div>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={localQuantity <= 1 || quantityUpdating[item.id]}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={localQuantity}
                onChange={handleInputChange}
                className="w-12 h-8 text-center border-t border-b border-gray-300"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={localQuantity >= item.stock || quantityUpdating[item.id]}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
              <span className="ml-3 text-sm text-gray-500">
                {quantityUpdating[item.id] ? 'Updating...' : `${item.stock} in stock`}
              </span>
            </div>
            
            <button
              onClick={() => onRemove(item.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Order Summary Component
  const OrderSummary = ({ items, subtotal, tax, shipping, discount, total, onCheckout }) => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({itemCount})</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="text-green-600 font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Including all taxes and fees</p>
          </div>
        </div>
        
        <Button
          onClick={onCheckout}
          className="w-full mt-6"
          size="large"
        >
          Proceed to Checkout
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Secure checkout powered by</p>
          <div className="flex justify-center space-x-4 mt-2">
            <span className="text-gray-400">💳</span>
            <span className="text-gray-400">🏦</span>
            <span className="text-gray-400">📱</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadingSpinner text="Loading your cart..." />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">🛒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as={Link} to="/products" className="sm:w-auto">
              Browse Products
            </Button>
            <Button as={Link} to="/" variant="outline" className="sm:w-auto">
              Return Home
            </Button>
          </div>
          
          {/* Popular Products Suggestion */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Organic Apples', price: '$4.99/lb', image: '🍎' },
                { name: 'Fresh Tomatoes', price: '$3.49/lb', image: '🍅' },
                { name: 'Free-range Eggs', price: '$6.99/dozen', image: '🥚' }
              ].map((product, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{product.image}</div>
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-gray-600 text-sm">{product.price}</p>
                  <Button
                    as={Link}
                    to="/products"
                    variant="outline"
                    size="small"
                    className="w-full mt-3"
                  >
                    View Product
                  </Button>
                </div>
              ))}
            </div>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">Review and manage your items</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <Button
            as={Link}
            to="/products"
            variant="outline"
            className="mr-3"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your entire cart?')) {
                clearCart();
                addNotification({
                  type: 'success',
                  title: 'Cart Cleared',
                  message: 'All items have been removed from your cart'
                });
              }
            }}
            variant="danger"
          >
            Clear Cart
          </Button>
        </div>
      </div>
      
      {/* Cart Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Items ({cartItems.length})
                </h2>
                <span className="text-sm text-gray-500">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} total items
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateCartItem}
                  onRemove={async (itemId) => {
                    try {
                      await removeCartItem(itemId);
                      addNotification({
                        type: 'success',
                        title: 'Item Removed',
                        message: 'Item has been removed from your cart'
                      });
                    } catch (error) {
                      addNotification({
                        type: 'error',
                        title: 'Error',
                        message: 'Failed to remove item'
                      });
                    }
                  }}
                />
              ))}
            </div>
            
            {/* Cart Summary Mobile */}
            <div className="p-6 border-t border-gray-200 lg:hidden">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Promo Code Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Code</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <Button
                onClick={handleApplyPromo}
                disabled={!promoCode.trim() || appliedPromo}
              >
                {appliedPromo ? 'Applied!' : 'Apply'}
              </Button>
            </div>
            {appliedPromo && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-800 font-medium">Promo code {appliedPromo} applied</span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-green-600 hover:text-green-800"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-green-700 mt-1">10% discount applied to your order</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Available Promo Codes:</p>
              <div className="space-y-1">
                <div className="flex items-center text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">SAVE10</span>
                  <span className="text-gray-600">10% off your order</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded mr-2">FARMART20</span>
                  <span className="text-gray-600">$20 off orders over $100</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Free Shipping</span>
                <span className="font-medium text-green-600">Orders over $50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Time</span>
                <span className="font-medium">2-5 business days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Returns</span>
                <span className="font-medium">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={cartItems}
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            discount={discount}
            total={total}
            onCheckout={handleCheckout}
          />
          
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h3>
            <div className="grid grid-cols-4 gap-2">
              {['💳', '🏦', '📱', '💵'].map((method, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg text-center">
                  <span className="text-2xl">{method}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Your payment information is secure and encrypted. We never store your credit card details.
            </p>
          </div>
          
          {/* Need Help */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Have questions about your order or need assistance?
            </p>
            <div className="space-y-3">
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                className="w-full"
              >
                Contact Support
              </Button>
              <Button
                as={Link}
                to="/faq"
                variant="ghost"
                className="w-full"
              >
                View FAQ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;