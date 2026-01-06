import React, { useState, useEffect, useCallback, useMemo } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkSelection, setBulkSelection] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;
  
  // Mock notification function - replace with actual implementation
  const addNotification = (notification) => {
    console.log('Notification:', notification);
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
  const getAdminUsers = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: generateMockUsers() };
  };

  const banUser = async (userId, reason) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  };

  const unbanUser = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  };

  const changeUserRole = async (userId, role) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  };

  // Mock data generator
  const generateMockUsers = () => {
    const roles = ['customer', 'farmer', 'admin'];
    const statuses = ['active', 'inactive', 'banned', 'pending'];
    const firstNames = ['John', 'Jane', 'Robert', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Jennifer'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
    
    return Array.from({ length: 50 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const lastLogin = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      
      return {
        id: `USER${1000 + i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1 (555) ${100 + i}-${1000 + i}`,
        role,
        status,
        avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
        createdAt: createdAt.toISOString(),
        lastLogin: lastLogin.toISOString(),
        orders: Math.floor(Math.random() * 100),
        totalSpent: parseFloat((Math.random() * 5000).toFixed(2)),
        address: `${Math.floor(Math.random() * 1000) + 1} Main St, City, State ${10000 + i}`,
        isVerified: Math.random() > 0.3,
        twoFactorEnabled: Math.random() > 0.7,
        preferences: {
          emailNotifications: Math.random() > 0.5,
          smsNotifications: Math.random() > 0.5,
          newsletter: Math.random() > 0.5
        }
      };
    });
  };

  const generateUserActivity = (userId) => {
    const activities = [
      { type: 'login', description: 'User logged in', timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) },
      { type: 'order', description: 'Placed order #ORD-1234', timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) },
      { type: 'profile', description: 'Updated profile information', timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) },
      { type: 'password', description: 'Changed password', timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) },
      { type: 'review', description: 'Posted product review', timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) }
    ];
    
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  };

  const roleOptions = useMemo(() => [
    { value: 'all', label: 'All Roles' },
    { value: 'customer', label: 'Customers', color: 'blue' },
    { value: 'farmer', label: 'Farmers', color: 'green' },
    { value: 'admin', label: 'Admins', color: 'purple' }
  ], []);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'banned', label: 'Banned', color: 'red' },
    { value: 'pending', label: 'Pending', color: 'yellow' }
  ], []);

  const roleChangeOptions = useMemo(() => [
    { value: 'customer', label: 'Customer' },
    { value: 'farmer', label: 'Farmer' },
    { value: 'admin', label: 'Admin' }
  ], []);

  const tabOptions = useMemo(() => [
    { id: 'all', label: 'All Users', count: 0 },
    { id: 'active', label: 'Active', count: 0 },
    { id: 'banned', label: 'Banned', count: 0 },
    { id: 'farmers', label: 'Farmers', count: 0 },
    { id: 'admins', label: 'Admins', count: 0 }
  ], []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load users',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update tab counts
  useEffect(() => {
    if (users.length > 0) {
      tabOptions[0].count = users.length;
      tabOptions[1].count = users.filter(u => u.status === 'active').length;
      tabOptions[2].count = users.filter(u => u.status === 'banned').length;
      tabOptions[3].count = users.filter(u => u.role === 'farmer').length;
      tabOptions[4].count = users.filter(u => u.role === 'admin').length;
    }
  }, [users, tabOptions]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...users];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      switch(activeTab) {
        case 'active':
          result = result.filter(user => user.status === 'active');
          break;
        case 'banned':
          result = result.filter(user => user.status === 'banned');
          break;
        case 'farmers':
          result = result.filter(user => user.role === 'farmer');
          break;
        case 'admins':
          result = result.filter(user => user.role === 'admin');
          break;
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
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
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
    setBulkSelection([]); // Clear bulk selection when filters change
    setShowBulkActions(false);
  }, [users, activeTab, searchTerm, roleFilter, statusFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkSelection = (userId) => {
    setBulkSelection(prev => {
      if (prev.includes(userId)) {
        const newSelection = prev.filter(id => id !== userId);
        setShowBulkActions(newSelection.length > 0);
        return newSelection;
      } else {
        const newSelection = [...prev, userId];
        setShowBulkActions(true);
        return newSelection;
      }
    });
  };

  const handleSelectAll = () => {
    if (bulkSelection.length === paginatedUsers.length) {
      setBulkSelection([]);
      setShowBulkActions(false);
    } else {
      const allIds = paginatedUsers.map(u => u.id);
      setBulkSelection(allIds);
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (bulkSelection.length === 0) return;
    
    setActionLoading(prev => ({ ...prev, bulk: true }));
    try {
      // Simulate bulk update
      await Promise.all(bulkSelection.map(id => new Promise(resolve => setTimeout(resolve, 100))));
      
      // Update local state
      setUsers(prev => prev.map(user => 
        bulkSelection.includes(user.id) ? { ...user, status: newStatus } : user
      ));
      
      addNotification({
        type: 'success',
        title: 'Bulk Update Successful',
        message: `${bulkSelection.length} user(s) status updated to ${newStatus}`,
      });
      
      setBulkSelection([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error('Failed to update users:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update users',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, bulk: false }));
    }
  };

  const handleBulkDelete = async () => {
    if (bulkSelection.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${bulkSelection.length} user(s)? This action cannot be undone.`)) {
      return;
    }
    
    setActionLoading(prev => ({ ...prev, bulkDelete: true }));
    try {
      // Simulate bulk delete
      await Promise.all(bulkSelection.map(id => new Promise(resolve => setTimeout(resolve, 100))));
      
      // Update local state
      setUsers(prev => prev.filter(user => !bulkSelection.includes(user.id)));
      
      addNotification({
        type: 'success',
        title: 'Bulk Delete Successful',
        message: `${bulkSelection.length} user(s) have been deleted`,
      });
      
      setBulkSelection([]);
      setShowBulkActions(false);
    } catch (err) {
      console.error('Failed to delete users:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete users',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, bulkDelete: false }));
    }
  };

  const handleBanUser = (user) => {
    setSelectedUser(user);
    setIsBanModalOpen(true);
  };

  const handleUnbanUser = async (user) => {
    if (!confirm(`Are you sure you want to unban ${user.name}?`)) return;
    
    setActionLoading(prev => ({ ...prev, [user.id]: true }));
    try {
      await unbanUser(user.id);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, status: 'active' } : u
      ));
      
      addNotification({
        type: 'success',
        title: 'User Unbanned',
        message: `${user.name} has been unbanned`,
      });
    } catch (err) {
      console.error('Failed to unban user:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to unban user',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [user.id]: false }));
    }
  };

  const confirmBanUser = async () => {
    if (!selectedUser || !banReason.trim()) return;
    
    setActionLoading(prev => ({ ...prev, ban: true }));
    try {
      await banUser(selectedUser.id, banReason);
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, status: 'banned' } : user
      ));
      
      addNotification({
        type: 'success',
        title: 'User Banned',
        message: `${selectedUser.name} has been banned`,
      });
      setIsBanModalOpen(false);
      setBanReason('');
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to ban user:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to ban user',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, ban: false }));
    }
  };

  const handleChangeRole = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const confirmChangeRole = async () => {
    if (!selectedUser || !selectedRole || selectedRole === selectedUser.role) return;
    
    setActionLoading(prev => ({ ...prev, role: true }));
    try {
      await changeUserRole(selectedUser.id, selectedRole);
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, role: selectedRole } : user
      ));
      
      addNotification({
        type: 'success',
        title: 'Role Updated',
        message: `${selectedUser.name}'s role has been updated to ${selectedRole}`,
      });
      setIsRoleModalOpen(false);
      setSelectedRole('');
      setSelectedUser(null);
    } catch (err) {
      console.error('Failed to update user role:', err);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update user role',
      });
    } finally {
      setActionLoading(prev => ({ ...prev, role: false }));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setUserActivity(generateUserActivity(user.id));
    setIsViewModalOpen(true);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      farmer: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      customer: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' }
    };
    return colors[role] || colors.customer;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
      banned: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' }
    };
    return colors[status] || colors.inactive;
  };

  const userColumns = useMemo(() => [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={bulkSelection.length === paginatedUsers.length && paginatedUsers.length > 0}
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
      title: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 mr-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={row.avatar}
              alt={row.name}
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      title: 'Role',
      sortable: true,
      render: (value) => {
        const color = getRoleColor(value);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text} ${color.border} border`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></span>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      title: 'Status',
      sortable: true,
      render: (value, row) => {
        const color = getStatusColor(value);
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color.bg} ${color.text} ${color.border} border`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-75 mr-2"></span>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        );
      }
    },
    { 
      key: 'orders', 
      title: 'Orders',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      key: 'totalSpent', 
      title: 'Total Spent',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold text-gray-900">${value.toFixed(2)}</span>
      )
    },
    { 
      key: 'lastLogin', 
      title: 'Last Login',
      sortable: true,
      render: (value) => {
        const date = new Date(value);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        let text = date.toLocaleDateString();
        let className = "text-gray-600";
        
        if (diffDays === 0) {
          text = 'Today';
          className = "text-green-600 font-medium";
        } else if (diffDays === 1) {
          text = 'Yesterday';
          className = "text-green-600";
        } else if (diffDays > 30) {
          className = "text-red-600";
        } else if (diffDays > 7) {
          className = "text-yellow-600";
        }
        
        return (
          <div>
            <div className={className}>{text}</div>
            <div className="text-xs text-gray-500">
              {diffDays === 0 ? 'Just now' : diffDays === 1 ? '1 day ago' : `${diffDays} days ago`}
            </div>
          </div>
        );
      }
    },
    { 
      key: 'actions', 
      title: 'Actions',
      align: 'right',
      render: (value, row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleViewUser(row)}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
            title="View Details"
          >
            View
          </button>
          <button
            onClick={() => handleChangeRole(row)}
            disabled={row.role === 'admin'}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change Role"
          >
            Role
          </button>
          {row.status === 'banned' ? (
            <button
              onClick={() => handleUnbanUser(row)}
              disabled={actionLoading[row.id]}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actionLoading[row.id] ? '...' : 'Unban'}
            </button>
          ) : (
            <button
              onClick={() => handleBanUser(row)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              title="Ban User"
            >
              Ban
            </button>
          )}
        </div>
      )
    },
  ], [bulkSelection, paginatedUsers, actionLoading]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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

  const Input = ({ label, name, value, onChange, placeholder = '', required = false, type = 'text', disabled = false }) => (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        required={required}
      />
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;
  const totalFarmers = users.filter(u => u.role === 'farmer').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalRevenue = users.reduce((sum, user) => sum + user.totalSpent, 0);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
          <button
            onClick={() => {
              // Export functionality can be added here
              addNotification({
                type: 'info',
                title: 'Export',
                message: 'User export functionality coming soon'
              });
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📥</span> Export
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">All registered users</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Users</p>
              <h3 className="text-3xl font-bold text-green-600">{activeUsers}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Currently active</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Banned Users</p>
              <h3 className="text-3xl font-bold text-red-600">{bannedUsers}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Suspended accounts</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Farmers</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalFarmers}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <span className="text-2xl">👨‍🌾</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Product suppliers</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Revenue</p>
              <h3 className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">From all users</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabOptions.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-600 font-medium">
                {bulkSelection.length} user(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkStatusChange('active')}
                disabled={actionLoading.bulk}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Mark Active
              </button>
              <button
                onClick={() => handleBulkStatusChange('banned')}
                disabled={actionLoading.bulk}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Mark Banned
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading.bulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading.bulkDelete ? 'Deleting...' : 'Delete Selected'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roleOptions.map(option => (
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
              <option value="createdAt">Join Date (Newest)</option>
              <option value="lastLogin">Last Login</option>
              <option value="totalSpent">Total Spent</option>
              <option value="orders">Order Count</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-2">
            {(roleFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setRoleFilter('all');
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Users List</h3>
          <p className="text-sm text-gray-600">Manage all registered users in the system</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {userColumns.map((column) => (
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
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {userColumns.map((column) => (
                      <td 
                        key={column.key} 
                        className={`px-6 py-4 whitespace-nowrap ${column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.render ? column.render(user[column.key], user) : user[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={userColumns.length} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">👤</span>
                      <p className="text-lg font-medium text-gray-700">No users found</p>
                      <p className="text-gray-600">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Users by Role</h3>
          <div className="space-y-4">
            {roleOptions.slice(1).map((role) => {
              const count = users.filter(u => u.role === role.value).length;
              const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
              const color = getRoleColor(role.value);
              
              return (
                <div key={role.value} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{role.label}</span>
                    <span className="font-semibold text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${color.bg.replace('bg-', 'bg-').replace('100', '500')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Users by Status</h3>
          <div className="space-y-4">
            {statusOptions.slice(1).map((status) => {
              const count = users.filter(u => u.status === status.value).length;
              const percentage = users.length > 0 ? (count / users.length * 100).toFixed(1) : 0;
              const color = getStatusColor(status.value);
              
              return (
                <div key={status.value} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{status.label}</span>
                    <span className="font-semibold text-gray-900">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${color.bg.replace('bg-', 'bg-').replace('100', '500')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        title={`Ban ${selectedUser?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <span className="text-red-600 text-2xl mr-3">⚠️</span>
            <p className="text-red-800">
              Are you sure you want to ban {selectedUser?.name}? This action will prevent them from accessing their account.
            </p>
          </div>
          
          <Input
            label="Reason for ban"
            name="banReason"
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
            placeholder="Enter reason for banning this user"
            required
          />
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setIsBanModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmBanUser}
              disabled={actionLoading.ban || !banReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading.ban ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Banning...
                </>
              ) : 'Ban User'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={`Change Role for ${selectedUser?.name}`}
        size="sm"
      >
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roleChangeOptions.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Current role: <span className="font-medium">{selectedUser?.role}</span>
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmChangeRole}
              disabled={actionLoading.role || selectedRole === selectedUser?.role}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading.role ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : 'Update Role'}
            </button>
          </div>
        </div>
      </Modal>

      {/* View User Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`User Details: ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <img
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role).bg} ${getRoleColor(selectedUser.role).text}`}>
                    {selectedUser.role}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.status).bg} ${getStatusColor(selectedUser.status).text}`}>
                    {selectedUser.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{selectedUser.email}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Login</p>
                    <p className="font-medium">{new Date(selectedUser.lastLogin).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verified</p>
                    <p className="font-medium">{selectedUser.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{selectedUser.orders}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${selectedUser.totalSpent.toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Account Status</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{selectedUser.status}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {userActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center text-sm p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 flex-1">{activity.description}</span>
                    <span className="text-gray-500 text-xs">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleChangeRole(selectedUser);
                }}
                disabled={selectedUser.role === 'admin'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Change Role
              </button>
              {selectedUser.status === 'banned' ? (
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleUnbanUser(selectedUser);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Unban User
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleBanUser(selectedUser);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Ban User
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;