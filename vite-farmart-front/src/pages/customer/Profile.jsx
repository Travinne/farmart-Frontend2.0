import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data
  const [user, setUser] = useState({
    id: 'user123',
    email: 'john.doe@example.com',
    role: 'customer',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T14:20:00Z',
    isActive: true
  });

  // Mock profile data
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(123) 456-7890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  });

  const [formData, setFormData] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  // Mock orders
  const [orders, setOrders] = useState([
    {
      id: 'ORD001',
      date: '2024-12-01',
      total: 45.99,
      status: 'delivered',
      items: 3
    },
    {
      id: 'ORD002',
      date: '2024-11-15',
      total: 89.50,
      status: 'processing',
      items: 5
    },
    {
      id: 'ORD003',
      date: '2024-11-05',
      total: 24.99,
      status: 'shipped',
      items: 2
    }
  ]);

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

  // Mock fetch profile
  const fetchProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProfile(profile);
      setFormData(profile);
    } catch (err) {
      setError('Failed to load profile');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load profile information'
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock update profile
  const updateProfile = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfile(data);
    setUser(prev => ({ ...prev, updatedAt: new Date().toISOString() }));
    return data;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setUpdateLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
      });
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update profile',
      });
      setErrors({ submit: err.message || 'Update failed' });
    } finally {
      setUpdateLoading(false);
    }
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
    placeholder = ''
  }) => {
    return (
      <div className={className}>
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
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  };

  // Order Item Component
  const OrderItem = ({ order }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'delivered': return 'bg-green-100 text-green-800';
        case 'processing': return 'bg-blue-100 text-blue-800';
        case 'shipped': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
            <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">{order.items} items</p>
            <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
          </div>
          <Button
            onClick={() => navigate(`/orders/${order.id}`)}
            variant="outline"
            size="small"
          >
            View Details
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSpinner text="Loading profile..." />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your profile, orders, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {/* User Info */}
            <div className="flex items-center mb-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-green-100"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-medium ${
                  activeTab === 'profile'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                👤 Profile Information
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-medium ${
                  activeTab === 'orders'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                📦 My Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-medium ${
                  activeTab === 'settings'
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                ⚙️ Account Settings
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                🛒 My Cart
              </button>
              <button
                onClick={() => {
                  // Handle logout
                  addNotification({
                    type: 'success',
                    title: 'Logged Out',
                    message: 'You have been successfully logged out'
                  });
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50"
              >
                🔓 Sign Out
              </button>
            </nav>
          </div>

          {/* Account Stats */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-green-900 mb-4">Account Status</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Member Since</span>
                <span className="text-sm font-medium text-green-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Account Type</span>
                <span className="text-sm font-medium text-green-900 capitalize">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Manage your personal details and contact information</p>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outline' : 'primary'}
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
              </div>

              {error && (
                <Alert
                  type="error"
                  message={error}
                  className="mb-6"
                />
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      disabled={!isEditing}
                      required
                      placeholder="Enter your full name"
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      disabled={!isEditing}
                      required
                      placeholder="Enter your email"
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      disabled={!isEditing}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="New York"
                    />

                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="NY"
                    />

                    <Input
                      label="ZIP Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="10001"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={updateLoading}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
                <p className="text-gray-600">View and manage your recent orders</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl">📦</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                  <Button onClick={() => navigate('/products')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
                <p className="text-gray-600">Manage your account preferences and security</p>
              </div>

              <div className="space-y-8">
                {/* Security Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="small">
                        Change
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="small">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive text message updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t border-red-200 pt-6">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                      </div>
                      <Button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            addNotification({
                              type: 'warning',
                              title: 'Account Deleted',
                              message: 'Your account has been scheduled for deletion'
                            });
                            navigate('/');
                          }
                        }}
                        variant="danger"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;