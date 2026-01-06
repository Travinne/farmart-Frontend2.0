import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userType: 'customer'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for redirect from registration or other pages
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const registered = searchParams.get('registered');
    const reset = searchParams.get('reset');
    
    if (registered === 'true') {
      addNotification({
        type: 'success',
        title: 'Registration Successful!',
        message: 'Your account has been created. Please log in to continue.'
      });
    }
    
    if (reset === 'success') {
      addNotification({
        type: 'success',
        title: 'Password Reset',
        message: 'Your password has been reset successfully. Please log in with your new password.'
      });
    }
    
    // Check for saved login data
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, [location]);

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

  // Mock login API
  const loginUser = async (credentials) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get users from localStorage (from register)
    const users = JSON.parse(localStorage.getItem('farmart_users') || '[]');
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('No account found with this email');
    }
    
    // In a real app, we would hash and compare passwords
    if (credentials.password !== user.password) {
      throw new Error('Incorrect password');
    }
    
    // Check if account is locked (demo)
    if (loginAttempts >= 3) {
      throw new Error('Account temporarily locked. Try again in 15 minutes or reset your password.');
    }
    
    // Save to localStorage (simulated auth)
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('current_user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.userType || 'customer',
      avatar: user.avatar
    }));
    
    // Remember email if requested
    if (credentials.rememberMe) {
      localStorage.setItem('remembered_email', credentials.email);
    } else {
      localStorage.removeItem('remembered_email');
    }
    
    // Reset login attempts
    setLoginAttempts(0);
    
    return { success: true, user };
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle demo login
  const handleDemoLogin = (type) => {
    const demoCredentials = {
      customer: { email: 'customer@demo.com', password: 'demo123', userType: 'customer' },
      farmer: { email: 'farmer@demo.com', password: 'demo123', userType: 'farmer' },
      admin: { email: 'admin@demo.com', password: 'demo123', userType: 'admin' }
    };
    
    setFormData({
      email: demoCredentials[type].email,
      password: demoCredentials[type].password,
      userType: demoCredentials[type].userType,
      rememberMe: false
    });
    
    addNotification({
      type: 'info',
      title: 'Demo Mode',
      message: `Demo ${type} credentials filled. Click "Sign In" to continue.`
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please check the form for errors'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      addNotification({
        type: 'success',
        title: 'Login Successful!',
        message: `Welcome back, ${result.user.name}!`
      });
      
      // Redirect based on user type
      setTimeout(() => {
        switch(result.user.userType || 'customer') {
          case 'farmer':
            navigate('/farmer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 1500);
      
    } catch (error) {
      // Increment login attempts
      setLoginAttempts(prev => prev + 1);
      
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: error.message || 'Unable to sign in. Please try again.'
      });
      
      if (error.message.includes('Incorrect password')) {
        setErrors(prev => ({ ...prev, password: error.message }));
      } else if (error.message.includes('No account')) {
        setErrors(prev => ({ ...prev, email: error.message }));
      }
      
      // Lock account warning
      if (loginAttempts >= 2) {
        addNotification({
          type: 'warning',
          title: 'Account Lock Warning',
          message: 'One more failed attempt will temporarily lock your account.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Reusable Button Component
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

  // Improved Form Input Component
  const FormInput = ({ 
    label, 
    name, 
    type = 'text', 
    value, 
    onChange, 
    placeholder = '', 
    required = false, 
    error = '', 
    helperText = '', 
    autoComplete,
    className = '',
    showPasswordToggle = false,
    onTogglePassword = () => {}
  }) => {
    const inputId = `input-${name}`;
    
    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400 ${
              error ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {type === 'password' ? '👁️' : '🙈'}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  };

  // Demo Login Buttons Component
  const DemoLoginButtons = () => (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 text-center mb-2">Quick Demo Login:</p>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={() => handleDemoLogin('customer')}
          className="text-xs"
        >
          <span className="mr-1">👤</span> Customer
        </Button>
        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={() => handleDemoLogin('farmer')}
          className="text-xs"
        >
          <span className="mr-1">👨‍🌾</span> Farmer
        </Button>
        <Button
          type="button"
          variant="outline"
          size="small"
          onClick={() => handleDemoLogin('admin')}
          className="text-xs"
        >
          <span className="mr-1">⚙️</span> Admin
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 sm:py-12">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Farmart</span>
          </Link>
          <Link 
            to="/register" 
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            New to Farmart? <span className="font-bold">Sign up →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to your Farmart account to continue
                </p>
              </div>

              {/* Demo Login Buttons */}
              <DemoLoginButtons />

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Email Field */}
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  autoComplete="email"
                  placeholder="Enter your email address"
                />

                {/* Password Field */}
                <FormInput
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />

                {/* Login Attempts Warning */}
                {loginAttempts > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Login attempts:</span> {loginAttempts} failed attempt{loginAttempts !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link 
                      to="/forgot-password" 
                      className="font-medium text-green-600 hover:text-green-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="large"
                  disabled={loginAttempts >= 3}
                >
                  {loginAttempts >= 3 ? 'Account Locked' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or sign in with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => addNotification({
                      type: 'info',
                      title: 'Coming Soon',
                      message: 'Google authentication will be available soon'
                    })}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => addNotification({
                      type: 'info',
                      title: 'Coming Soon',
                      message: 'Facebook authentication will be available soon'
                    })}
                  >
                    <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>

              {/* Register Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
                  Create one now
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="space-y-8">
            {/* Security Notice */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Secure Login</h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-lg">🔒</span>
                  </div>
                  <span>End-to-end encrypted connections</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-lg">🛡️</span>
                  </div>
                  <span>Two-factor authentication available</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-lg">👁️</span>
                  </div>
                  <span>No password sharing or storage</span>
                </li>
                <li className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <span className="text-lg">📧</span>
                  </div>
                  <span>Immediate account activity alerts</span>
                </li>
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">MC</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-600">Regular Customer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Farmart makes it so easy to get fresh, local produce. I've been a customer for over a year and the quality never disappoints!"
              </p>
            </div>

            {/* Help Section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Need Help?</h4>
              <div className="space-y-3">
                <Button
                  as={Link}
                  to="/faq"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <span className="mr-2">❓</span> View FAQ
                </Button>
                <Button
                  as={Link}
                  to="/contact"
                  variant="outline"
                  className="w-full justify-start"
                >
                  <span className="mr-2">📞</span> Contact Support
                </Button>
                <Button
                  as={Link}
                  to="/privacy"
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <span className="mr-2">🔒</span> Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;