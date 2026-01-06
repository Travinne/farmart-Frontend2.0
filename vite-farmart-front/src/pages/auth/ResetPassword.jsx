import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email') || '';
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock API function
  const resetPassword = async (resetData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  // Password validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { valid: false, message: `Password must be at least ${minLength} characters long` };
    }
    if (!hasUpperCase) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { valid: false, message: 'Password must contain at least one special character' };
    }
    
    return { valid: true, message: 'Password is valid' };
  };

  useEffect(() => {
    // Simulate token validation
    const validateToken = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!token) {
        const event = new CustomEvent('show-notification', {
          detail: {
            type: 'error',
            title: 'Invalid Reset Link',
            message: 'The password reset link is invalid or has expired.'
          }
        });
        window.dispatchEvent(event);
      }
      setLoading(false);
    };

    validateToken();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const resetData = {
        token,
        email,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      
      await resetPassword(resetData);
      
      setIsSuccess(true);
      
      const event = new CustomEvent('show-notification', {
        detail: {
          type: 'success',
          title: 'Password Reset Successful',
          message: 'Your password has been reset successfully. You can now log in with your new password.'
        }
      });
      window.dispatchEvent(event);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.message || 'Failed to reset password. Please try again.';
      
      const event = new CustomEvent('show-notification', {
        detail: {
          type: 'error',
          title: 'Reset Failed',
          message: errorMessage
        }
      });
      window.dispatchEvent(event);
      
      if (error.status === 400 || error.status === 401) {
        setErrors({ 
          general: 'The reset link is invalid or has expired. Please request a new reset link.' 
        });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const Input = ({ label, name, type = 'text', value, onChange, placeholder = '', required = false, error = '', helperText = '', autoComplete }) => (
    <div>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );

  const Button = ({ type = 'button', onClick, loading = false, children, className = '', variant = 'primary', disabled = false, ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
      outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={loading || disabled}
        className={`${baseClasses} ${variantClasses[variant]} ${className} disabled:cursor-not-allowed`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : children}
      </button>
    );
  };

  const Alert = ({ type = 'info', title, message, className = '', onDismiss }) => {
    const styles = {
      success: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        icon: '✅'
      },
      error: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        icon: '⚠️'
      },
      warning: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        icon: '⚠️'
      },
      info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        icon: 'ℹ️'
      }
    };

    const style = styles[type] || styles.info;

    return (
      <div className={`rounded-lg border p-4 ${style.bg} ${style.border} ${style.text} ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            <span className="text-lg">{style.icon}</span>
          </div>
          <div className="flex-1">
            {title && <h3 className="text-sm font-medium">{title}</h3>}
            <div className="text-sm mt-1">{message}</div>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-auto pl-3 flex-shrink-0"
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-lg">×</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const LoadingSpinner = ({ size = 'medium', text = '' }) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      medium: 'h-8 w-8',
      large: 'h-12 w-12'
    };
    
    return (
      <div className="flex flex-col items-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
        {text && <p className="mt-2 text-gray-600">{text}</p>}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <LoadingSpinner size="large" text="Validating reset link..." />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Password Reset Successful!
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Your password has been reset
              </h3>
              <p className="text-gray-600 mb-6">
                You will be redirected to the login page in a few seconds.
              </p>
              <div className="flex justify-center">
                <LoadingSpinner size="small" />
              </div>
              <div className="mt-8">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Go to Login Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Invalid Reset Link
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
            <Alert
              type="error"
              title="Link Expired or Invalid"
              message="The password reset link is invalid or has expired. Please request a new reset link."
            />
            
            <div className="mt-6 space-y-4">
              <Button
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {email && `Resetting password for: ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {errors.general && (
            <Alert
              type="error"
              title="Error"
              message={errors.general}
              className="mb-6"
              onDismiss={() => setErrors(prev => ({ ...prev, general: '' }))}
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your new password"
              required
              helperText="At least 8 characters with uppercase, lowercase, number, and special character"
              autoComplete="new-password"
            />
            
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your new password"
              required
              autoComplete="new-password"
            />
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  At least 8 characters
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Contains lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Contains uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Contains number
                </li>
                <li className={`flex items-center ${/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Contains special character
                </li>
                <li className={`flex items-center ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-600' : ''}`}>
                  <svg className={`w-4 h-4 mr-2 ${formData.password === formData.confirmPassword && formData.confirmPassword ? 'text-green-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Passwords match
                </li>
              </ul>
            </div>
            
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
            
            <div className="text-center mt-4">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            By resetting your password, you agree to our{' '}
            <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;