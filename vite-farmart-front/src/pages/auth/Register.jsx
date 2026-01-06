import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    acceptTerms: false,
    newsletter: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  // Update password strength when password changes
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

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

  // Mock registration API
  const registerUser = async (userData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('farmart_users') || '[]');
    const emailExists = existingUsers.some(user => user.email === userData.email);
    
    if (emailExists) {
      throw new Error('Email already registered');
    }
    
    // Create new user
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      verified: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
    };
    
    // Save to localStorage
    localStorage.setItem('farmart_users', JSON.stringify([...existingUsers, newUser]));
    
    // Set current user
    localStorage.setItem('auth_token', 'mock_token_' + Date.now());
    localStorage.setItem('current_user', JSON.stringify({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.userType,
      avatar: newUser.avatar
    }));
    
    return { success: true, user: newUser };
  };

  // Form validation
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Please choose a stronger password';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(`input-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please correct the errors in the form'
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        userType: formData.userType,
        newsletter: formData.newsletter
      });
      
      addNotification({
        type: 'success',
        title: 'Registration Successful!',
        message: `Welcome to Farmart, ${formData.name}! Your account has been created.`
      });
      
      // Redirect based on user type
      setTimeout(() => {
        if (formData.userType === 'farmer') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'Unable to create account. Please try again.'
      });
      
      if (error.message.includes('Email already registered')) {
        setErrors(prev => ({ ...prev, email: error.message }));
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

  // Password Strength Indicator Component
  const PasswordStrengthIndicator = ({ strength }) => {
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const currentStrength = Math.min(strength, 5); // Cap at 5
    
    return (
      <div className="mt-2">
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-2 flex-1 rounded-full ${level <= currentStrength ? colors[currentStrength - 1] : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Password strength: <span className={`font-medium ${
            currentStrength === 1 ? 'text-red-600' :
            currentStrength === 2 ? 'text-orange-600' :
            currentStrength === 3 ? 'text-yellow-600' :
            currentStrength === 4 ? 'text-blue-600' :
            'text-green-600'
          }`}>{strengthLabels[currentStrength - 1] || 'None'}</span>
        </p>
      </div>
    );
  };

  // Password Requirements Component
  const PasswordRequirements = ({ password }) => {
    const requirements = [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'Contains number', met: /[0-9]/.test(password) },
      { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) }
    ];
    
    const metCount = requirements.filter(req => req.met).length;
    
    return (
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">Password requirements ({metCount}/4):</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-center text-xs">
              <span className={`inline-block w-4 h-4 mr-2 rounded-full flex items-center justify-center ${
                req.met ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {req.met ? '✓' : '○'}
              </span>
              <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                {req.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // User Type Selection Component
  const UserTypeSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => handleChange({ target: { name: 'userType', value: 'customer' } })}
        className={`p-4 border-2 rounded-xl text-left transition-all ${
          formData.userType === 'customer'
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
            formData.userType === 'customer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {formData.userType === 'customer' && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Customer</h4>
            <p className="text-sm text-gray-600 mt-1">Shop for fresh produce and local goods</p>
          </div>
        </div>
      </button>
      
      <button
        type="button"
        onClick={() => handleChange({ target: { name: 'userType', value: 'farmer' } })}
        className={`p-4 border-2 rounded-xl text-left transition-all ${
          formData.userType === 'farmer'
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
            formData.userType === 'farmer' ? 'border-green-500 bg-green-500' : 'border-gray-300'
          }`}>
            {formData.userType === 'farmer' && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Farmer/Seller</h4>
            <p className="text-sm text-gray-600 mt-1">Sell your products directly to customers</p>
          </div>
        </div>
      </button>
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
            to="/login" 
            className="text-green-600 hover:text-green-700 font-medium text-sm"
          >
            Already have an account? <span className="font-bold">Sign in →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Create your account
                </h1>
                <p className="text-gray-600">
                  Join thousands of customers and farmers on Farmart Marketplace
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    I want to join as a:
                  </label>
                  <UserTypeSelector />
                </div>

                {/* Name Field */}
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                />

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
                  placeholder="you@example.com"
                  helperText="We'll never share your email with anyone else"
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
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                
                {/* Password Strength & Requirements */}
                {formData.password && (
                  <>
                    <PasswordStrengthIndicator strength={passwordStrength} />
                    <PasswordRequirements password={formData.password} />
                  </>
                )}

                {/* Confirm Password Field */}
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  showPasswordToggle={true}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                {/* Terms and Newsletter */}
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="acceptTerms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <label htmlFor="acceptTerms" className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">
                        I agree to the{' '}
                        <Link to="/terms" className="text-green-600 hover:text-green-700">
                          Terms of Service
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-green-600 hover:text-green-700">
                          Privacy Policy
                        </Link>
                      </span>
                      <p className="text-gray-600 mt-1">
                        By creating an account, you agree to our terms and conditions.
                      </p>
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                  )}

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={handleChange}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <label htmlFor="newsletter" className="ml-3 text-sm">
                      <span className="font-medium text-gray-900">
                        Subscribe to our newsletter
                      </span>
                      <p className="text-gray-600 mt-1">
                        Get updates on new products, promotions, and farming tips.
                      </p>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="large"
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
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

              {/* Login Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-green-600 hover:text-green-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            {/* Benefits for Customers */}
            {formData.userType === 'customer' && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Benefits for Customers</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">🛒</span>
                    </div>
                    <span>Access fresh, locally-sourced products</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">🚚</span>
                    </div>
                    <span>Direct delivery from farmers</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">💰</span>
                    </div>
                    <span>Competitive prices, no middlemen</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">⭐</span>
                    </div>
                    <span>Exclusive deals and discounts</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Benefits for Farmers */}
            {formData.userType === 'farmer' && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Benefits for Farmers</h2>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">📈</span>
                    </div>
                    <span>Reach thousands of customers directly</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">💸</span>
                    </div>
                    <span>Higher profit margins, no commissions</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">📱</span>
                    </div>
                    <span>Easy-to-use management tools</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-lg">🤝</span>
                    </div>
                    <span>Build relationships with your customers</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Local Farmers</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Organic Farmer</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Farmart has completely transformed how I sell my produce. I've doubled my income while connecting directly with customers who appreciate quality!"
              </p>
            </div>

            {/* FAQ Link */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Need help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Check our FAQ or contact our support team
              </p>
              <Button
                as={Link}
                to="/faq"
                variant="outline"
                className="w-full"
              >
                Visit Help Center
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;