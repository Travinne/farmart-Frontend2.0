import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('credit-card');
  const [saveAddress, setSaveAddress] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const navigate = useNavigate();
  
  // Mock cart items
  const [cartItems] = useState([
    { id: 1, name: 'Organic Apples', price: 4.99, quantity: 2, image: '🍎' },
    { id: 2, name: 'Fresh Tomatoes', price: 3.49, quantity: 3, image: '🍅' },
    { id: 3, name: 'Free-range Eggs', price: 6.99, quantity: 1, image: '🥚' },
  ]);
  
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping - couponDiscount;
  
  // States for US
  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  
  // Payment methods
  const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', icon: '🏦' },
    { id: 'apple-pay', name: 'Apple Pay', icon: '📱' },
    { id: 'cash-on-delivery', name: 'Cash on Delivery', icon: '💵' },
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
  const checkoutOrder = async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, orderId: 'ORD-' + Math.floor(Math.random() * 10000) };
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) newErrors.email = 'Email is invalid';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!shippingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!shippingInfo.city.trim()) newErrors.city = 'City is required';
    if (!shippingInfo.state.trim()) newErrors.state = 'State is required';
    if (!shippingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    return newErrors;
  };
  
  const validatePayment = () => {
    const newErrors = {};
    if (selectedPayment === 'credit-card') {
      if (!paymentInfo.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!paymentInfo.cardName.trim()) newErrors.cardName = 'Name on card is required';
      if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv.trim()) newErrors.cvv = 'CVV is required';
      else if (paymentInfo.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    }
    return newErrors;
  };
  
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleNextStep = () => {
    if (step === 1) {
      const validationErrors = validateShipping();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    } else if (step === 2) {
      const validationErrors = validatePayment();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    setStep(step + 1);
  };
  
  const handlePreviousStep = () => {
    setStep(step - 1);
  };
  
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setCouponDiscount(subtotal * 0.1);
      setCouponApplied(true);
      addNotification({
        type: 'success',
        title: 'Coupon Applied!',
        message: '10% discount has been applied to your order',
      });
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      if (shipping > 0) {
        setCouponDiscount(shipping);
        setCouponApplied(true);
        addNotification({
          type: 'success',
          title: 'Coupon Applied!',
          message: 'Free shipping has been applied to your order',
        });
      } else {
        addNotification({
          type: 'info',
          title: 'Coupon Not Needed',
          message: 'Your order already qualifies for free shipping',
        });
      }
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid Coupon',
        message: 'The coupon code you entered is invalid or expired',
      });
    }
    setCouponCode('');
  };
  
  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      addNotification({
        type: 'error',
        title: 'Terms Required',
        message: 'You must agree to the terms and conditions to place your order',
      });
      return;
    }
    
    setLoading(true);
    try {
      const orderData = {
        shippingInfo,
        paymentInfo,
        paymentMethod: selectedPayment,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        tax,
        shipping,
        discount: couponDiscount,
        total,
      };
      
      const response = await checkoutOrder(orderData);
      
      addNotification({
        type: 'success',
        title: 'Order Placed Successfully!',
        message: `Your order #${response.orderId} has been placed. You will receive a confirmation email shortly.`,
      });
      
      // Clear cart and redirect
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId: response.orderId,
            orderTotal: total,
            estimatedDelivery: '3-5 business days'
          } 
        });
      }, 2000);
      
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Checkout Failed',
        message: err.message || 'Failed to place order',
      });
      setErrors({ submit: err.message || 'Checkout failed' });
    } finally {
      setLoading(false);
    }
  };
  
  const steps = [
    { number: 1, title: 'Shipping', description: 'Enter your shipping details' },
    { number: 2, title: 'Payment', description: 'Enter your payment information' },
    { number: 3, title: 'Review', description: 'Review your order' },
  ];
  
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
    maxLength
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
          maxLength={maxLength}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your purchase in a few simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {steps.map((stepItem, index) => (
            <React.Fragment key={stepItem.number}>
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mr-3
                  ${step >= stepItem.number 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  {stepItem.number}
                </div>
                <div>
                  <div className={`font-medium ${step >= stepItem.number ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stepItem.title}
                  </div>
                  <div className="text-sm text-gray-500">{stepItem.description}</div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block flex-1 mx-4">
                  <div className={`h-0.5 ${step > stepItem.number ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {errors.submit && (
            <Alert
              type="error"
              title="Error"
              message={errors.submit}
              onDismiss={() => setErrors(prev => ({ ...prev, submit: '' }))}
            />
          )}

          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  error={errors.fullName}
                  required
                  placeholder="John Doe"
                />
                
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleShippingChange}
                  error={errors.email}
                  required
                  placeholder="john@example.com"
                />
                
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={handleShippingChange}
                  error={errors.phone}
                  required
                  placeholder="(123) 456-7890"
                />
                
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    error={errors.address}
                    required
                    placeholder="123 Main Street"
                  />
                </div>
                
                <Input
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingChange}
                  error={errors.city}
                  required
                  placeholder="New York"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      errors.state ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
                
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingChange}
                  error={errors.zipCode}
                  required
                  placeholder="10001"
                  maxLength="5"
                />
                
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700">
                    Save this address for future orders
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              
              {/* Payment Method Selection */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-4 border rounded-lg text-center transition-all ${
                        selectedPayment === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Credit Card Form */}
              {selectedPayment === 'credit-card' && (
                <div className="space-y-6">
                  <Input
                    label="Card Number"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    error={errors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                  
                  <Input
                    label="Name on Card"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    error={errors.cardName}
                    placeholder="John Doe"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input
                      label="Expiry Date (MM/YY)"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      error={errors.expiryDate}
                      placeholder="12/24"
                      maxLength="5"
                    />
                    
                    <Input
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      error={errors.cvv}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              )}
              
              {/* PayPal Notice */}
              {selectedPayment === 'paypal' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🏦</div>
                  <h3 className="font-semibold text-blue-900 mb-2">PayPal</h3>
                  <p className="text-blue-700 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <p className="text-sm text-blue-600">
                    After payment, you'll return here to complete your order.
                  </p>
                </div>
              )}
              
              {/* Apple Pay Notice */}
              {selectedPayment === 'apple-pay' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Apple Pay</h3>
                  <p className="text-gray-700 mb-4">
                    Use Apple Pay for a quick and secure checkout.
                  </p>
                  <p className="text-sm text-gray-600">
                    You'll authenticate with Face ID, Touch ID, or your passcode.
                  </p>
                </div>
              )}
              
              {/* Cash on Delivery Notice */}
              {selectedPayment === 'cash-on-delivery' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💵</div>
                  <h3 className="font-semibold text-green-900 mb-2">Cash on Delivery</h3>
                  <p className="text-green-700 mb-4">
                    Pay with cash when your order arrives.
                  </p>
                  <p className="text-sm text-green-600">
                    Please have exact change ready. A $2.00 cash handling fee applies.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Step 3: Review Order */}
          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Order</h2>
              
              <div className="space-y-8">
                {/* Shipping Information Review */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                    <Button
                      onClick={() => setStep(1)}
                      variant="ghost"
                      size="small"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="font-medium text-gray-900">{shippingInfo.fullName || 'Not provided'}</p>
                    <p className="text-gray-700">{shippingInfo.address || 'Not provided'}</p>
                    <p className="text-gray-700">{shippingInfo.city || 'Not provided'}, {shippingInfo.state || 'Not provided'} {shippingInfo.zipCode || 'Not provided'}</p>
                    <p className="text-gray-700">{shippingInfo.phone || 'Not provided'}</p>
                    <p className="text-gray-700">{shippingInfo.email || 'Not provided'}</p>
                  </div>
                </div>
                
                {/* Payment Information Review */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                    <Button
                      onClick={() => setStep(2)}
                      variant="ghost"
                      size="small"
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {paymentMethods.find(m => m.id === selectedPayment)?.icon}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {paymentMethods.find(m => m.id === selectedPayment)?.name}
                        </p>
                        {selectedPayment === 'credit-card' && (
                          <p className="text-gray-700">
                            Card ending in •••• {paymentInfo.cardNumber.slice(-4) || 'XXXX'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items Review */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                        <div className="flex items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                            <span className="text-2xl">{item.image}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agreeTerms" className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <button className="text-green-600 hover:text-green-700 font-medium">
                        Terms and Conditions
                      </button>
                      {' '}and{' '}
                      <button className="text-green-600 hover:text-green-700 font-medium">
                        Privacy Policy
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button
                onClick={handlePreviousStep}
                variant="outline"
              >
                ← Back
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={handleNextStep}>
                  Continue to {step === 1 ? 'Payment' : 'Review'} →
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  loading={loading}
                  disabled={!agreeTerms}
                  size="large"
                  className="px-8"
                >
                  Place Order
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Order Items Preview */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                        <span className="text-xl">{item.image}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              {/* Coupon Code */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={couponApplied}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Discount Applied</span>
                      <span className="text-sm font-bold text-green-800">-${couponDiscount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-green-700 mt-1">Coupon code applied successfully</p>
                  </div>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-medium">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Including all taxes and fees</p>
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🔒</span>
                <h4 className="font-semibold text-blue-900">Secure Checkout</h4>
              </div>
              <p className="text-sm text-blue-700">
                Your payment information is encrypted and secure. We never store your credit card details.
              </p>
              <div className="flex justify-center space-x-4 mt-4 text-gray-500">
                <span>💳</span>
                <span>🏦</span>
                <span>📱</span>
                <span>💵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;