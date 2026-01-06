import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // Mock product data
  const mockProducts = [
    {
      id: '1',
      name: 'Organic Apples',
      description: 'Fresh organic apples from local farms',
      price: 4.99,
      originalPrice: 5.99,
      discount: 17,
      category: 'fruits',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewCount: 124,
      organic: true,
      farmName: 'Green Valley Farm'
    },
    {
      id: '2',
      name: 'Fresh Tomatoes',
      description: 'Juicy ripe tomatoes, perfect for salads',
      price: 3.49,
      category: 'vegetables',
      stock: 30,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
      rating: 4.2,
      reviewCount: 89,
      organic: true,
      farmName: 'Sunshine Organics'
    },
    {
      id: '3',
      name: 'Free-range Eggs',
      description: 'Farm fresh eggs from happy hens',
      price: 6.99,
      category: 'dairy',
      stock: 25,
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 156,
      organic: false,
      farmName: 'Happy Hens Farm'
    },
    {
      id: '4',
      name: 'Organic Chicken Breast',
      description: 'Premium organic chicken breast',
      price: 12.99,
      category: 'meat',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1604503468505-6f8c5e4f4c0d?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewCount: 67,
      organic: true,
      farmName: 'Organic Poultry Farm'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'organic', label: 'Organic' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  // Custom debounce hook
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);
    
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(search, 500);

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
  const getProducts = async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const filtered = mockProducts.filter(product => {
      if (params.category && params.category !== 'all' && product.category !== params.category) {
        return false;
      }
      if (params.q) {
        const searchTerm = params.q.toLowerCase();
        return product.name.toLowerCase().includes(searchTerm) || 
               product.description.toLowerCase().includes(searchTerm);
      }
      return true;
    });
    
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    
    return { 
      data: { 
        items: sorted, 
        totalPages: 1 
      } 
    };
  };

  const searchProducts = async (query, options = {}) => {
    return getProducts({ q: query, ...options });
  };

  const getProductsByCategory = async (cat, options = {}) => {
    return getProducts({ category: cat, ...options });
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, category, page, sortBy]);

  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    if (category !== 'all') params.category = category;
    setSearchParams(params);
  }, [debouncedSearch, category, setSearchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (debouncedSearch) {
        response = await searchProducts(debouncedSearch, { page, limit: 12 });
      } else if (category !== 'all') {
        response = await getProductsByCategory(category, { page, limit: 12 });
      } else {
        response = await getProducts({ page, limit: 12 });
      }

      setProducts(response.data.items || response.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} has been added to your cart`,
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

  // Product Card Component
  const ProductCard = ({ product, onViewDetails, onAddToCart }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {product.discount && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          )}
          {product.organic && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
              Organic
            </span>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating} ({product.reviewCount})
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">{product.stock} in stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => onViewDetails(product.id)}
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex-1"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Product List Component
  const ProductList = ({ products, onViewDetails, onAddToCart }) => {
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Fresh from local farms to your table</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {search && (
            <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
              Search: "{search}"
              <button
                onClick={() => setSearch('')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}
          {category !== 'all' && (
            <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
              Category: {categories.find(c => c.value === category)?.label}
              <button
                onClick={() => setCategory('all')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      {loading && products.length === 0 ? (
        <div className="py-12">
          <LoadingSpinner text="Loading products..." />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{products.length}</span> products
            </p>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>

          <ProductList
            products={products}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="small"
                >
                  ← Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      variant={page === pageNum ? 'primary' : 'outline'}
                      size="small"
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="small"
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;