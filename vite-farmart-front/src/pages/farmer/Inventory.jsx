import React, { useState, useEffect } from 'react';

const FarmerInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notifications, setNotifications] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    weight: '',
    organic: false,
    image: ''
  });

  // Mock products data
  const mockProducts = [
    { id: 1, name: 'Organic Apples', category: 'fruits', price: 4.99, stock: 50, description: 'Fresh organic apples from our orchard', weight: '1 lb', organic: true, image: '🍎', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Fresh Tomatoes', category: 'vegetables', price: 3.49, stock: 30, description: 'Juicy ripe tomatoes', weight: '1 lb', organic: true, image: '🍅', status: 'active', createdAt: '2024-01-10' },
    { id: 3, name: 'Organic Potatoes', category: 'vegetables', price: 2.99, stock: 45, description: 'Organic potatoes for baking or frying', weight: '2 lb', organic: true, image: '🥔', status: 'active', createdAt: '2024-01-05' },
    { id: 4, name: 'Carrots', category: 'vegetables', price: 1.99, stock: 28, description: 'Fresh crunchy carrots', weight: '1 lb', organic: false, image: '🥕', status: 'active', createdAt: '2024-01-12' },
    { id: 5, name: 'Onions', category: 'vegetables', price: 1.49, stock: 35, description: 'Yellow onions for cooking', weight: '1 lb', organic: false, image: '🧅', status: 'active', createdAt: '2024-01-08' },
    { id: 6, name: 'Free-range Eggs', category: 'dairy', price: 6.99, stock: 20, description: 'Farm fresh eggs from happy hens', weight: 'dozen', organic: true, image: '🥚', status: 'active', createdAt: '2024-01-03' },
    { id: 7, name: 'Organic Milk', category: 'dairy', price: 5.99, stock: 15, description: 'Fresh organic milk', weight: '1 gallon', organic: true, image: '🥛', status: 'low', createdAt: '2024-01-01' },
    { id: 8, name: 'Organic Chicken', category: 'meat', price: 12.99, stock: 8, description: 'Organic chicken breast', weight: '1 lb', organic: true, image: '🍗', status: 'low', createdAt: '2024-01-14' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'organic', label: 'Organic' },
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
  const getFarmerProducts = async (farmerId) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockProducts };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const farmerId = 'current-farmer-id';
      const response = await getFarmerProducts(farmerId);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      weight: '',
      organic: false,
      image: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      weight: product.weight,
      organic: product.organic,
      image: product.image
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      // Mock delete API call
      await new Promise(resolve => setTimeout(resolve, 300));
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: `${selectedProduct.name} has been removed from inventory`,
      });
      setIsDeleteModalOpen(false);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product',
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isAddModalOpen) {
        // Add new product
        const newProduct = {
          id: products.length + 1,
          ...formData,
          status: formData.stock > 10 ? 'active' : 'low',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setProducts(prev => [newProduct, ...prev]);
        addNotification({
          type: 'success',
          title: 'Product Added',
          message: `${formData.name} has been added to inventory`,
        });
      } else {
        // Update existing product
        setProducts(prev => prev.map(p => 
          p.id === selectedProduct.id 
            ? { ...p, ...formData, status: formData.stock > 10 ? 'active' : 'low' }
            : p
        ));
        addNotification({
          type: 'success',
          title: 'Product Updated',
          message: `${formData.name} has been updated`,
        });
      }
      
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: `Failed to ${isAddModalOpen ? 'add' : 'update'} product`,
      });
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  // Input Component
  const Input = ({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    error, 
    disabled = false,
    required = false,
    className = '',
    placeholder = '',
    min,
    max,
    step
  }) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows="3"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
              error ? 'border-red-300' : 'border-gray-300'
            } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
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

  // Product Status Badge
  const ProductStatus = ({ stock }) => {
    if (stock > 20) {
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          In Stock ({stock})
        </span>
      );
    } else if (stock > 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Out of Stock
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading inventory..." />
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
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Manage your farm's products and stock levels</p>
          </div>
          <Button 
            onClick={handleAddProduct}
            className="mt-4 md:mt-0"
          >
            <span className="mr-2">➕</span> Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-400">🔍</span>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stats Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total Products</div>
                  <div className="text-2xl font-bold text-gray-900">{filteredProducts.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">In Stock</div>
                  <div className="text-2xl font-bold text-green-600">
                    {filteredProducts.filter(p => p.stock > 0).length}
                  </div>
                </div>
              </div>
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

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new product.</p>
          <Button onClick={handleAddProduct}>
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                          <span className="text-xl">{product.image}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">{product.weight}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock} units</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ProductStatus stock={product.stock} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditProduct(product)}
                          variant="outline"
                          size="small"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteProduct(product)}
                          variant="danger"
                          size="small"
                        >
                          Delete
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

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="e.g., Organic Apples"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select a category</option>
                {categories.slice(1).map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleFormChange}
              required
              placeholder="e.g., 4.99"
            />
            
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleFormChange}
              required
              placeholder="e.g., 50"
            />
            
            <Input
              label="Weight/Unit"
              name="weight"
              value={formData.weight}
              onChange={handleFormChange}
              placeholder="e.g., 1 lb, dozen, etc."
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="organic"
                checked={formData.organic}
                onChange={handleFormChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Organic Product
              </label>
            </div>
          </div>
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            type="textarea"
            placeholder="Describe your product..."
          />
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${selectedProduct?.name}`}
        size="large"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="e.g., Organic Apples"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select a category</option>
                {categories.slice(1).map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleFormChange}
              required
              placeholder="e.g., 4.99"
            />
            
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleFormChange}
              required
              placeholder="e.g., 50"
            />
            
            <Input
              label="Weight/Unit"
              name="weight"
              value={formData.weight}
              onChange={handleFormChange}
              placeholder="e.g., 1 lb, dozen, etc."
            />
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="organic"
                checked={formData.organic}
                onChange={handleFormChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Organic Product
              </label>
            </div>
          </div>
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            type="textarea"
            placeholder="Describe your product..."
          />
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="small"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-1 text-sm text-red-700">
                  This action cannot be undone. This will permanently delete the product from your inventory.
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">You are about to delete:</p>
            <p className="font-medium text-gray-900">{selectedProduct?.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              Category: <span className="capitalize">{selectedProduct?.category}</span>
            </p>
            <p className="text-sm text-gray-600">Stock: {selectedProduct?.stock} units</p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteProduct}
              variant="danger"
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerInventory;