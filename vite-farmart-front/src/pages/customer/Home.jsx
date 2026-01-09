import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const notificationIdCounter = useRef(0); // ✅ FIX: Use a counter instead of Date.now()

  // Mock data for featured products
  const mockFeaturedProducts = [
    {
      id: '1',
      name: 'Organic Apples',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
      category: 'Fruits',
      farmer: 'Green Valley Farm',
      rating: 4.8,
      unit: 'lb',
      description: 'Fresh organic apples from local orchards'
    },
    {
      id: '2',
      name: 'Fresh Tomatoes',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
      category: 'Vegetables',
      farmer: 'Sunshine Organics',
      rating: 4.6,
      unit: 'lb',
      description: 'Vine-ripened tomatoes, perfect for salads'
    },
    {
      id: '3',
      name: 'Free-range Eggs',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
      category: 'Dairy',
      farmer: 'Happy Hens Farm',
      rating: 4.9,
      unit: 'dozen',
      description: 'Fresh eggs from free-range chickens'
    },
    {
      id: '4',
      name: 'Organic Carrots',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1598170845058-78131a90f4bf?w=400&h=400&fit=crop',
      category: 'Vegetables',
      farmer: 'Rooted Gardens',
      rating: 4.5,
      unit: 'lb',
      description: 'Sweet and crunchy organic carrots'
    }
  ];

  // Stats data
  const stats = [
    { id: 'stat-1', title: 'Total Products', value: '1,234', change: '+12%', color: 'blue' },
    { id: 'stat-2', title: 'Active Farmers', value: '89', change: '+8%', color: 'green' },
    { id: 'stat-3', title: 'Orders Today', value: '156', change: '+23%', color: 'yellow' },
    { id: 'stat-4', title: 'Happy Customers', value: '4,567', change: '+15%', color: 'purple' }
  ];

  // ✅ FIX: Use a unique ID generator instead of Date.now()
  const generateUniqueId = () => {
    return `notification-${++notificationIdCounter.current}-${Date.now()}`;
  };

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: generateUniqueId(), // ✅ FIXED: Use unique ID
      ...notification,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // Fetch featured products
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setFeaturedProducts(mockFeaturedProducts);
      addNotification({
        type: 'success',
        title: 'Welcome!',
        message: 'Discover fresh produce from local farmers'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Connection Issue',
        message: 'Unable to load featured products'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart`
    });
    
    // In a real app, you would dispatch to cart context or API
    console.log('Add to cart:', product);
  };

  // Handle view details
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    fetchFeaturedProducts();
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
  const Alert = ({ id, type = 'info', title, message, onDismiss, className = '' }) => {
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
  const StatsCard = ({ title, value, change, color }) => {
    const colorClasses = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' }
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-500 text-sm">{title}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${colorClasses[color].bg} ${colorClasses[color].text}`}>
            {change}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    );
  };

  // Product Card Component
  const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
            {product.category}
          </div>
        </div>
        
        {/* Product Details */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.farmer}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 block">per {product.unit}</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400 mr-2">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => onViewDetails(product.id)}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              onClick={() => onAddToCart(product)}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Loading fresh produce..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map(notification => (
          <Alert
            key={notification.id} // ✅ FIXED: Now using unique ID
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onDismiss={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-16 md:py-24"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&fit=crop")',
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(5, 150, 105, 0.8)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Fresh Produce Direct from Local Farmers
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Discover organic fruits, vegetables, and dairy products delivered fresh to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={Link}
                to="/products"
                variant="primary"
                size="large"
                className="bg-white text-green-800 hover:bg-gray-100"
              >
                Shop Now
              </Button>
              <Button
                as={Link}
                to="/farmer/dashboard"
                variant="outline"
                size="large"
                className="!text-white !border-white hover:!bg-white/10"
              >
                Meet Our Farmers
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => (
            <StatsCard
              key={stat.id} // ✅ Already has unique ID
              title={stat.title}
              value={stat.value}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-1">Fresh picks from local farmers</p>
          </div>
          <Button
            as={Link}
            to="/products"
            variant="outline"
            className="mt-4 sm:mt-0"
          >
            View All Products
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={`product-${product.id}`} // ✅ Unique key with prefix
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Empty State */}
        {featuredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🌱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600 mb-6">Check back soon for fresh produce!</p>
            <Button as={Link} to="/products" variant="outline">
              Browse All Categories
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-t border-gray-200 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to shop fresh?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy fresh produce delivered weekly.
            Support local farmers and get the best quality produce straight to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/register"
              size="large"
            >
              Get Started for Free
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="outline"
              size="large"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Fresh produce delivered within 24 hours</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Organic</h3>
            <p className="text-gray-600">Certified organic produce from trusted farmers</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💚</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Support Local</h3>
            <p className="text-gray-600">Directly supporting local farming communities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;