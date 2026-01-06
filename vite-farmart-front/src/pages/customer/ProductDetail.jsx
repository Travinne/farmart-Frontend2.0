// ProductDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Mock product data - replace with actual API call
  const mockProduct = {
    id: 'PROD1001',
    name: 'Organic Apples',
    description: 'Fresh organic apples picked from our local farm. Perfect for snacking, baking, or making fresh juice.',
    price: 4.99,
    originalPrice: 5.99,
    discount: 17,
    category: 'Fruits',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570913199992-91d07c140e7a?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop',
    rating: 4.5,
    reviewCount: 124,
    weight: '1 lb',
    farmName: 'Green Valley Farm',
    organic: true
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

  // Mock API call
  const getProduct = async (productId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockProduct };
  };

  // Mock cart context
  const addItem = async (productId, qty) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Added ${qty} of product ${productId} to cart`);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProduct(id);
      setProduct(response.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Product not found');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load product details',
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addItem(product.id, quantity);
      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${quantity} × ${product.name} added to your cart`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add item to cart',
      });
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading product details..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-5xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button 
            onClick={() => navigate(-1)}
            className="mr-3"
          >
            Go Back
          </Button>
          <Button 
            onClick={() => navigate('/products')}
            variant="outline"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image].filter(Boolean);

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

      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-green-600"
            >
              Home
            </button>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <button 
                onClick={() => navigate('/products')}
                className="ml-1 text-sm font-medium text-gray-700 hover:text-green-600 md:ml-2"
              >
                Products
              </button>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                {product.name}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-xl">
                <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto py-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-green-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                  Save {product.discount}%
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                #{product.category}
              </span>
              <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-green-600'}`}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating || '4.5'} ({product.reviewCount || 124} reviews)
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || product.stock === 0}
                  variant="outline"
                  size="small"
                  className="w-10 h-10 p-0 rounded-l-lg"
                >
                  -
                </Button>
                <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                  <span className="text-lg font-medium">{quantity}</span>
                </div>
                <Button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || product.stock === 0}
                  variant="outline"
                  size="small"
                  className="w-10 h-10 p-0 rounded-r-lg"
                >
                  +
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <span className="font-medium">{product.stock}</span> available
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3 text-lg"
                size="large"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                variant="primary"
                className="flex-1 py-3 text-lg"
                size="large"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-600 mb-1">Category</dt>
                <dd className="text-lg font-medium text-gray-900">{product.category}</dd>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-600 mb-1">Weight</dt>
                <dd className="text-lg font-medium text-gray-900">{product.weight || 'N/A'}</dd>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-600 mb-1">Farm</dt>
                <dd className="text-lg font-medium text-gray-900">{product.farmName || 'Local Farm'}</dd>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-600 mb-1">Organic</dt>
                <dd className="text-lg font-medium text-gray-900">{product.organic ? 'Yes' : 'No'}</dd>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Free Shipping</span>
                <span className="font-medium text-green-600">Orders over $50</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Time</span>
                <span className="font-medium">2-5 business days</span>
              </div>
              <div className="flex justify-between">
                <span>Returns</span>
                <span className="font-medium">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;