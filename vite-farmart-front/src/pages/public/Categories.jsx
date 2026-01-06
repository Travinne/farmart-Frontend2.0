import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const categories = [
    { 
      id: 1, 
      name: "Vegetables", 
      description: "Fresh and organic vegetables directly from local farms", 
      icon: "🥦",
      color: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      productCount: 128,
      popularItems: ["Tomatoes", "Carrots", "Bell Peppers", "Lettuce"]
    },
    { 
      id: 2, 
      name: "Fruits", 
      description: "Seasonal fruits handpicked by farmers", 
      icon: "🍎",
      color: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      productCount: 96,
      popularItems: ["Apples", "Oranges", "Berries", "Bananas"]
    },
    { 
      id: 3, 
      name: "Grains & Cereals", 
      description: "High-quality grains for all your cooking needs", 
      icon: "🌾",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      productCount: 64,
      popularItems: ["Rice", "Wheat", "Oats", "Quinoa"]
    },
    { 
      id: 4, 
      name: "Dairy Products", 
      description: "Fresh milk, cheese, and other dairy products", 
      icon: "🥛",
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      productCount: 48,
      popularItems: ["Milk", "Cheese", "Yogurt", "Butter"]
    },
    { 
      id: 5, 
      name: "Meat & Poultry", 
      description: "Farm-raised meat and poultry products", 
      icon: "🍗",
      color: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      productCount: 32,
      popularItems: ["Chicken", "Beef", "Pork", "Lamb"]
    },
    { 
      id: 6, 
      name: "Organic", 
      description: "Certified organic produce and products", 
      icon: "🌱",
      color: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      productCount: 156,
      popularItems: ["Organic Vegetables", "Organic Fruits", "Organic Dairy", "Organic Grains"]
    },
    { 
      id: 7, 
      name: "Farm Equipment", 
      description: "Tools and equipment for efficient farming", 
      icon: "🔧",
      color: "bg-gray-50",
      borderColor: "border-gray-200",
      textColor: "text-gray-800",
      productCount: 42,
      popularItems: ["Tractors", "Irrigation Systems", "Harvesting Tools", "Storage"]
    },
    { 
      id: 8, 
      name: "Fertilizers", 
      description: "Eco-friendly fertilizers for sustainable farming", 
      icon: "🌿",
      color: "bg-brown-50",
      borderColor: "border-brown-200",
      textColor: "text-brown-800",
      productCount: 28,
      popularItems: ["Organic Compost", "Natural Fertilizers", "Plant Nutrients", "Soil Amendments"]
    },
    { 
      id: 9, 
      name: "Seeds", 
      description: "High-quality seeds for planting", 
      icon: "🌻",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      productCount: 73,
      popularItems: ["Vegetable Seeds", "Fruit Seeds", "Flower Seeds", "Herb Seeds"]
    },
    { 
      id: 10, 
      name: "Herbs & Spices", 
      description: "Fresh herbs and aromatic spices", 
      icon: "🌿",
      color: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      productCount: 57,
      popularItems: ["Basil", "Mint", "Cinnamon", "Turmeric"]
    },
    { 
      id: 11, 
      name: "Beverages", 
      description: "Farm-fresh juices and drinks", 
      icon: "🥤",
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      productCount: 39,
      popularItems: ["Fresh Juices", "Herbal Teas", "Milk Drinks", "Smoothies"]
    },
    { 
      id: 12, 
      name: "Eggs", 
      description: "Farm-fresh eggs from free-range hens", 
      icon: "🥚",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      productCount: 24,
      popularItems: ["Chicken Eggs", "Duck Eggs", "Organic Eggs", "Free-range Eggs"]
    }
  ];

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.popularItems.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleCategoryClick = (category) => {
    addNotification({
      type: 'info',
      title: 'Browsing Category',
      message: `Viewing products in ${category.name} category`
    });
    navigate(`/products?category=${category.name.toLowerCase()}`);
  };

  const handleQuickView = (category) => {
    setSelectedCategory(category);
  };

  const closeQuickView = () => {
    setSelectedCategory(null);
  };

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

  // Category Card Component
  const CategoryCard = ({ category }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {/* Category Header */}
        <div className={`p-6 border-b ${category.borderColor} ${category.color}`}>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">
              {category.icon}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              <div className="flex items-center mt-1">
                <span className="text-sm font-medium bg-white px-2 py-1 rounded-full">
                  {category.productCount} products
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{category.description}</p>
        </div>
        
        {/* Popular Items */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Popular Items</h4>
          <div className="flex flex-wrap gap-2 mb-6">
            {category.popularItems.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {item}
              </span>
            ))}
            {category.popularItems.length > 3 && (
              <span className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                +{category.popularItems.length - 3} more
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={() => handleCategoryClick(category)}
              className="flex-1"
            >
              View Products
            </Button>
            <Button
              onClick={() => handleQuickView(category)}
              variant="outline"
              className="px-3"
            >
              Quick View
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="text-2xl font-bold text-green-600 flex items-center"
              >
                🚜 FarmArt
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                All Products
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Cart
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Explore Categories</h1>
          <p className="text-gray-600 text-lg mb-8">
            Discover a wide range of products and equipment directly from trusted farmers. 
            Click on a category to browse items or use the search to find what you need.
          </p>
          
          {/* Search and Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Categories
                </label>
                <div className="relative">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories, products, or items..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400 text-lg">🔍</span>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-green-800">Total Categories</div>
                    <div className="text-2xl font-bold text-green-900">{categories.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-800">Total Products</div>
                    <div className="text-2xl font-bold text-green-900">
                      {categories.reduce((sum, cat) => sum + cat.productCount, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-green-700 mt-2">
                  Discover amazing products across all categories
                </div>
              </div>
            </div>
            
            {/* Search Tips */}
            {searchTerm && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredCategories.length} categories matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your search or browse all categories</p>
            <Button
              onClick={() => setSearchTerm('')}
              variant="outline"
            >
              Show All Categories
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        {/* Featured Categories Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Most Popular Categories</h2>
              <p className="text-gray-600">Top categories our customers love</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(0, 3).map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transform transition-all hover:scale-[1.02] ${category.color} border ${category.borderColor}`}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{category.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.productCount} products</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{category.description}</p>
                <button className="text-green-600 font-medium hover:text-green-700 flex items-center">
                  Browse Products
                  <span className="ml-2">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FarmArt</h3>
              <p className="text-gray-400 text-sm">
                Connecting farmers directly with customers for fresh, sustainable produce.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white">Vegetables</button></li>
                <li><button className="hover:text-white">Fruits</button></li>
                <li><button className="hover:text-white">Dairy</button></li>
                <li><button className="hover:text-white">Organic</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/products')} className="hover:text-white">All Products</button></li>
                <li><button onClick={() => navigate('/categories')} className="hover:text-white">Categories</button></li>
                <li><button onClick={() => navigate('/cart')} className="hover:text-white">Shopping Cart</button></li>
                <li><button onClick={() => navigate('/profile')} className="hover:text-white">My Account</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                Have questions? We're here to help.
              </p>
              <Button
                onClick={() => addNotification({
                  type: 'info',
                  title: 'Contact Support',
                  message: 'Our support team will contact you shortly'
                })}
                variant="outline"
                className="mt-4 w-full border-gray-700 text-white hover:bg-gray-800"
              >
                Contact Us
              </Button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 FarmArt. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Quick View Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={closeQuickView}
            ></div>
            
            {/* Modal panel */}
            <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-xl shadow-xl">
              {/* Header */}
              <div className={`p-6 border-b ${selectedCategory.borderColor} ${selectedCategory.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">{selectedCategory.icon}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{selectedCategory.name}</h3>
                      <p className="text-gray-600">{selectedCategory.productCount} products available</p>
                    </div>
                  </div>
                  <button
                    onClick={closeQuickView}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-6">{selectedCategory.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Popular Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.popularItems.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Average Price Range</p>
                      <p className="font-medium text-gray-900">$5 - $50</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Time</p>
                      <p className="font-medium text-gray-900">2-5 business days</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      handleCategoryClick(selectedCategory);
                      closeQuickView();
                    }}
                    className="flex-1"
                  >
                    Browse Products
                  </Button>
                  <Button
                    onClick={() => {
                      addNotification({
                        type: 'success',
                        title: 'Category Saved',
                        message: `${selectedCategory.name} added to your favorites`
                      });
                      closeQuickView();
                    }}
                    variant="outline"
                  >
                    Save Category
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;