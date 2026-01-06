import React, { useState, useEffect, useCallback, useMemo } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    farmer: '',
    image: ''
  });
  const [editProductData, setEditProductData] = useState({});
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

  // Mock API functions - replace with actual API calls
  const getAdminProducts = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: generateMockProducts() };
  };

  const deleteProduct = async (productId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  };

  const updateProduct = async (productId, data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data };
  };

  const createProduct = async (data) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, data: { ...data, id: `PROD${Date.now()}` } };
  };

  // Mock data generator
  const generateMockProducts = () => {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Grains', 'Beverages', 'Snacks'];
    const farmers = ['Green Valley Farm', 'Sunshine Organics', 'Fresh Harvest Co', 'Happy Hens Farm', 
                     'Organic Oasis', 'Mountain View Farm', 'River Bend Farm', 'Heritage Farms'];
    const statuses = ['active', 'inactive', 'out_of_season'];
    
    return Array.from({ length: 45 }, (_, i) => {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const farmer = farmers[Math.floor(Math.random() * farmers.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const stock = Math.floor(Math.random() * 100);
      const price = parseFloat((Math.random() * 50 + 1).toFixed(2));
      
      return {
        id: `PROD${1000 + i}`,
        sku: `SKU-${1000 + i}`,
        name: `${category === 'Fruits' ? 'Organic ' : ''}${category} Product ${i + 1}`,
        description: `Fresh, high-quality ${category.toLowerCase()} from local farms. Perfect for healthy meals.`,
        category,
        price,
        stock,
        status,
        farmer,
        unit: category === 'Meat' ? 'lb' : category === 'Dairy' ? 'dozen' : 'lb',
        minOrder: 1,
        maxOrder: 20,
        images: [`https://picsum.photos/seed/product${i}/300/200`],
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviews: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        featured: Math.random() > 0.7,
        discount: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0
      };
    });
  };

  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'All Categories' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Dairy', label: 'Dairy' },
    { value: 'Meat', label: 'Meat' },
    { value: 'Bakery', label: 'Bakery' },
    { value: 'Grains', label: 'Grains' },
    { value: 'Beverages', label: 'Beverages' },
    { value: 'Snacks', label: 'Snacks' }
  ], []);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'out_of_season', label: 'Out of Season', color: 'yellow' }
  ], []);

  const farmerOptions = useMemo(() => [
    { value: 'all', label: 'All Farmers' },
    { value: 'Green Valley Farm', label: 'Green Valley Farm' },
    { value: 'Sunshine Organics', label: 'Sunshine Organics' },
    { value: 'Fresh Harvest Co', label: 'Fresh Harvest Co' },
    { value: 'Happy Hens Farm', label: 'Happy Hens Farm' },
    { value: 'Organic Oasis', label: 'Organic Oasis' },
    { value: 'Mountain View Farm', label: 'Mountain View Farm' },
    { value: 'River Bend Farm', label: 'River Bend Farm' },
    { value: 'Heritage Farms', label: 'Heritage Farms' }
  ], []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminProducts();
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(product => product.status === statusFilter);
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
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
    setBulkSelection([]); // Clear bulk selection when filters change
    setShowBulkActions(false);
  }, [products, searchTerm, categoryFilter, statusFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkSelection = (productId) => {
    setBulkSelection(prev => {
      if (prev.includes(productId)) {
        const newSelection = prev.filter(id => id !== productId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, productId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  const handleSelectAll = () => {
    if (bulkSelection.length === paginatedProducts.length) {
      setBulkSelection([]);
      setShowBulkActions(false);
    } else {
      const allIds = paginatedProducts.map(p => p.id);
      setBulkSelection(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = async () => {
    if (bulkSelection.length === 0) return;
    
    setActionLoading(prev => ({ ...prev, bulk: true }));
    try {
      // Simulate bulk delete
      await Promise.all(bulkSelection.map(id => new Promise(resolve => setTimeout(resolve, 100))));
      
      // Update local state
      setProducts(prev => prev.filter(product => !bulkSelection.includes(product.id)));
      
      addNotification({
        type: 'success',
        title: 'Bulk Delete Successful',
        message: `${bulkSelection.length} product(s) have been deleted`,
      });
      
      setBulkSelection([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error('Failed to delete products:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete products',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, bulk: false }));
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (bulkSelection.length === 0) return;
    
    setActionLoading(prev => ({ ...prev, bulkStatus: true }));
    try {
      // Simulate bulk update
      await Promise.all(bulkSelection.map(id => new Promise(resolve => setTimeout(resolve, 100))));
      
      // Update local state
      setProducts(prev => prev.map(product => 
        bulkSelection.includes(product.id) ? { ...product, status: newStatus } : product
      ));
      
      addNotification({
        type: 'success',
        title: 'Bulk Update Successful',
        message: `${bulkSelection.length} product(s) status updated to ${newStatus}`,
      });
      
      setBulkSelection([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error('Failed to update products:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update products',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, bulkStatus: false }));
    }
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    setActionLoading(prev => ({ ...prev, [selectedProduct.id]: true }));
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      
      addNotification({
        type: 'success',
        title: 'Product Deleted',
        message: `${selectedProduct.name} has been deleted`,
      });
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedProduct.id]: false }));
    }
  };

  const handleEditProduct = (product) => {
    setEditProductData(product);
    setIsEditModalOpen(true);
  };

  const confirmEdit = async () => {
    setActionLoading(prev => ({ ...prev, edit: true }));
    try {
      await updateProduct(editProductData.id, editProductData);
      setProducts(prev => prev.map(p => 
        p.id === editProductData.id ? editProductData : p
      ));
      
      addNotification({
        type: 'success',
        title: 'Product Updated',
        message: `${editProductData.name} has been updated`,
      });
      setIsEditModalOpen(false);
      setEditProductData({});
    } catch (err) {
      console.error('Failed to update product:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update product',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const confirmAdd = async () => {
    setActionLoading(prev => ({ ...prev, add: true }));
    try {
      const response = await createProduct(newProduct);
      setProducts(prev => [response.data, ...prev]);
      
      addNotification({
        type: 'success',
        title: 'Product Added',
        message: `${newProduct.name} has been added`,
      });
      
      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        farmer: '',
        image: ''
      });
    } catch (err) {
      console.error('Failed to add product:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add product',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, add: false }));
    }
  };

  const getStatusColor = (product) => {
    if (product.status === 'inactive') {
      return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
    if (product.status === 'out_of_season') {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
    }
    
    // Active product - check stock
    if (product.stock === 0) {
      return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
    }
    if (product.stock <= 10) {
      return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
    }
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
  };

  const getStatusText = (product) => {
    if (product.status === 'inactive') return 'Inactive';
    if (product.status === 'out_of_season') return 'Out of Season';
    
    if (product.stock === 0) return 'Out of Stock';
    if (product.stock <= 10) return 'Low Stock';
    return 'In Stock';
  };

  const productColumns = useMemo(() => [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={bulkSelection.length === paginatedProducts.length && paginatedProducts.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      ),
      render: (value, row) => (
        <input
          type="checkbox"
          checked={bulkSelection.includes(row.id)}
          onChange={() => handleBulkSelection(row.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      )
    },
    { 
      key: 'name', 
      title: 'Product',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 mr-3">
            <img
              className="h-10 w-10 rounded-lg object-cover"
              src={row.images?.[0] || 'https://via.placeholder.com/300x200'}
              alt={row.name}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.sku}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'category', 
      title: 'Category',
      sortable: true,
      render: (value) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {value}
        </span>
      )
    },
    { 
      key: 'price', 
      title: 'Price',
      sortable: true,
      align: 'right',
      render: (value, row) => (
        <div className="text-right">
          <div className="font-semibold text-gray-900">${value.toFixed(2)}</div>
          {row.discount > 0 && (
            <div className="text-xs text-red-600">
              -{row.discount}% off
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'stock', 
      title: 'Stock',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'status', 
      title: 'Status',
      sortable: true,
      render: (value, row) => {
        const color = getStatusColor(row);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text} ${color.border} border`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></span>
            {getStatusText(row)}
          </span>
        );
      }
    },
    { 
      key: 'farmer', 
      title: 'Farmer',
      sortable: true,
      render: (value) => (
        <span className="text-gray-700">{value}</span>
      )
    },
    { 
      key: 'rating', 
      title: 'Rating',
      sortable: true,
      align: 'right',
      render: (value) => (
        <div className="text-right">
          <div className="flex items-center justify-end">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 font-medium">{value.toFixed(1)}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleEditProduct(row)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(row)}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      )
    },
  ], [bulkSelection, paginatedProducts]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const LoadingSpinner = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );

  const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;
    
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-2xl',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl'
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const ProductForm = ({ product, onChange, isEditing = false }) => {
    const categories = ['Fruits', 'Vegetables', 'Dairy', 'Meat', 'Bakery', 'Grains', 'Beverages', 'Snacks'];
    const farmers = ['Green Valley Farm', 'Sunshine Organics', 'Fresh Harvest Co', 'Happy Hens Farm', 
                     'Organic Oasis', 'Mountain View Farm', 'River Bend Farm', 'Heritage Farms'];
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU *
            </label>
            <input
              type="text"
              value={product.sku || `SKU-${Date.now()}`}
              onChange={(e) => onChange({ ...product, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter SKU"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farmer *
            </label>
            <select
              value={product.farmer}
              onChange={(e) => onChange({ ...product, farmer: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Farmer</option>
              {farmers.map(farmer => (
                <option key={farmer} value={farmer}>{farmer}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={product.price}
              onChange={(e) => onChange({ ...product, price: parseFloat(e.target.value) || '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              min="0"
              value={product.stock}
              onChange={(e) => onChange({ ...product, stock: parseInt(e.target.value) || '' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              required
            />
          </div>
          
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={product.status}
                onChange={(e) => onChange({ ...product, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_season">Out of Season</option>
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              value={product.unit || ''}
              onChange={(e) => onChange({ ...product, unit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., lb, dozen, piece"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={product.description}
            onChange={(e) => onChange({ ...product, description: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={product.image || product.images?.[0] || ''}
            onChange={(e) => onChange({ ...product, image: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        {isEditing && product.image && (
          <div className="mt-2">
            <img
              src={product.image}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading products..." />;
  }

  const totalProducts = products.length;
  const outOfStockProducts = products.filter(p => p.stock === 0 && p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.stock > 0 && p.status === 'active').length;
  const activeProducts = products.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage products, inventory, and pricing</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span> Add Product
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Products</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalProducts}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{activeProducts} active</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Out of Stock</p>
              <h3 className="text-3xl font-bold text-red-600">{outOfStockProducts}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Need restocking</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Low Stock</p>
              <h3 className="text-3xl font-bold text-yellow-600">{lowStockProducts}</h3>
            </div>
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
              <span className="text-2xl">📉</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">≤ 10 units</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Categories</p>
              <h3 className="text-3xl font-bold text-gray-900">{categoryOptions.length - 1}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <span className="text-2xl">🏷️</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Product categories</p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-600 font-medium">
                {bulkSelection.length} product(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange('active')}
                disabled={actionLoading.bulkStatus}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Mark Active
              </button>
              <button
                onClick={() => handleBulkStatusChange('inactive')}
                disabled={actionLoading.bulkStatus}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Mark Inactive
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading.bulk}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading.bulk ? 'Deleting...' : 'Delete Selected'}
              </button>
              <button
                onClick={() => {
                  setBulkSelection([]);
                  setShowBulkActions(false);
                }}
                className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
            <input
              type="text"
              placeholder="Search by name, SKU, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortConfig.key}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="stock">Stock (High to Low)</option>
              <option value="category">Category</option>
              <option value="createdAt">Date Added</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          <div className="flex gap-2">
            {(categoryFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setCategoryFilter('all');
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Products Inventory</h3>
          <p className="text-sm text-gray-600">Manage your product catalog and inventory levels</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {productColumns.map((column) => (
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
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    {productColumns.map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap ${column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.render ? column.render(product[column.key], product) : product[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={productColumns.length} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📦</span>
                      <p className="text-lg font-medium text-gray-700">No products found</p>
                      <p className="text-gray-600">Try adjusting your filters or search term</p>
                      <button
                        onClick={handleAddProduct}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Products by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categoryOptions.slice(1).map((category) => {
            const count = products.filter(p => p.category === category.value).length;
            const percentage = products.length > 0 ? (count / products.length * 100).toFixed(1) : 0;
            
            return (
              <div key={category.value} className="text-center p-4 rounded-lg border hover:shadow-md transition-shadow">
                <div className="text-lg font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600">{category.label}</div>
                <div className="text-xs text-gray-500 mt-1">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${selectedProduct?.name}`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <span className="text-red-600 text-2xl mr-3">⚠️</span>
            <p className="text-red-800">
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={actionLoading[selectedProduct?.id]}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading[selectedProduct?.id] ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${editProductData.name}`}
        size="lg"
      >
        <div className="space-y-6">
          <ProductForm
            product={editProductData}
            onChange={setEditProductData}
            isEditing={true}
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmEdit}
              disabled={actionLoading.edit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading.edit ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <div className="space-y-6">
          <ProductForm
            product={newProduct}
            onChange={setNewProduct}
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              disabled={actionLoading.add}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading.add ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;