import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Mock API function
  const forgotPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
      
      // Show success notification
      const event = new CustomEvent('show-notification', {
        detail: {
          type: 'success',
          title: 'Email Sent',
          message: 'Check your email for password reset instructions'
        }
      });
      window.dispatchEvent(event);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
      
      // Show error notification
      const event = new CustomEvent('show-notification', {
        detail: {
          type: 'error',
          title: 'Reset Failed',
          message: err.message || 'Please try again'
        }
      });
      window.dispatchEvent(event);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Check your email
              </h3>
              <p className="text-gray-600">
                We've sent a password reset link to your email address.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <Alert
                  type="error"
                  message={error}
                  className="mb-6"
                  onDismiss={() => setError('')}
                />
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Send reset link
                </Button>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;