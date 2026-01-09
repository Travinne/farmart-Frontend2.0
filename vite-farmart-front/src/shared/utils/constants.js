// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: 'Farmart',
  APP_DESCRIPTION: 'Fresh farm produce delivered to your doorstep',
  APP_VERSION: '1.0.0',
  CONTACT_EMAIL: 'support@farmart.com',
  CONTACT_PHONE: '+1 (234) 567-8900',
  COMPANY_ADDRESS: '123 Farm Street, Agriculture City, AC 12345',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  VERIFY_EMAIL: '/api/auth/verify-email',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_CATEGORIES: '/api/products/categories',
  PRODUCT_REVIEWS: '/api/products/:id/reviews',
  
  // Orders
  ORDERS: '/api/orders',
  ORDER_DETAILS: '/api/orders/:id',
  ORDER_TRACKING: '/api/orders/:id/tracking',
  
  // Cart
  CART: '/api/cart',
  CART_ITEM: '/api/cart/:id',
  
  // Users
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  
  // Admin
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ORDERS: '/api/admin/orders',
  
  // Farmer
  FARMER_INVENTORY: '/api/farmer/inventory',
  FARMER_ORDERS: '/api/farmer/orders',
  FARMER_STATS: '/api/farmer/stats',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  { id: 'vegetables', name: 'Fresh Vegetables', icon: '🥬', color: '#22c55e' },
  { id: 'fruits', name: 'Organic Fruits', icon: '🍎', color: '#ef4444' },
  { id: 'dairy', name: 'Dairy Products', icon: '🥛', color: '#3b82f6' },
  { id: 'meat', name: 'Farm Eggs & Meat', icon: '🥩', color: '#dc2626' },
  { id: 'grains', name: 'Grains & Cereals', icon: '🌾', color: '#d97706' },
  { id: 'herbs', name: 'Herbs & Spices', icon: '🌿', color: '#10b981' },
  { id: 'organic', name: 'Organic Products', icon: '🌱', color: '#16a34a' },
  { id: 'seasonal', name: 'Seasonal Specials', icon: '🎯', color: '#8b5cf6' },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: { value: 'pending', label: 'Pending', color: '#f59e0b' },
  CONFIRMED: { value: 'confirmed', label: 'Confirmed', color: '#3b82f6' },
  PROCESSING: { value: 'processing', label: 'Processing', color: '#8b5cf6' },
  SHIPPED: { value: 'shipped', label: 'Shipped', color: '#6366f1' },
  DELIVERED: { value: 'delivered', label: 'Delivered', color: '#10b981' },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', color: '#ef4444' },
  REFUNDED: { value: 'refunded', label: 'Refunded', color: '#6b7280' },
};

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '💰' },
  { id: 'stripe', name: 'Stripe', icon: '💲' },
  { id: 'cash_on_delivery', name: 'Cash on Delivery', icon: '💵' },
  { id: 'bank_transfer', name: 'Bank Transfer', icon: '🏦' },
];

// Delivery Options
export const DELIVERY_OPTIONS = [
  { id: 'standard', name: 'Standard Delivery', price: 5.99, days: '3-5 business days' },
  { id: 'express', name: 'Express Delivery', price: 12.99, days: '1-2 business days' },
  { id: 'same_day', name: 'Same Day Delivery', price: 19.99, days: 'Same day (by 9 PM)' },
  { id: 'pickup', name: 'Store Pickup', price: 0, days: 'Ready in 2 hours' },
];

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PRODUCT: 'product',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
  SECURITY: 'security',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-()]+$/,
  ZIPCODE: /^\d{5}(-\d{4})?$/,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'farmart_token',
  USER_DATA: 'farmart_user',
  CART_ITEMS: 'farmart_cart',
  RECENT_SEARCHES: 'farmart_searches',
  THEME_PREFERENCE: 'farmart_theme',
};

// Theme Settings
export const THEME = {
  COLORS: {
    PRIMARY: '#16a34a',
    SECONDARY: '#d97706',
    SUCCESS: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#3b82f6',
    LIGHT: '#f8fafc',
    DARK: '#1e293b',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
};

// Navigation Constants
export const NAVIGATION = {
  PUBLIC_PATHS: [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/products',
    '/categories',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
  ],
  PROTECTED_PATHS: {
    CUSTOMER: [
      '/profile',
      '/cart',
      '/checkout',
      '/orders/history',
      '/orders/tracking',
    ],
    FARMER: [
      '/farmer/dashboard',
      '/farmer/inventory',
      '/farmer/orders',
      '/farmer/analytics',
    ],
    ADMIN: [
      '/admin/dashboard',
      '/admin/users',
      '/admin/products',
      '/admin/orders',
      '/admin/analytics',
    ],
  },
};

// API Configuration - FIXED: Using import.meta.env for Vite
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Currency Settings
export const CURRENCY = {
  SYMBOL: '$',
  CODE: 'USD',
  NAME: 'US Dollar',
  DECIMAL_PLACES: 2,
};

// Default Values
export const DEFAULTS = {
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 10,
  USERS_PER_PAGE: 20,
  REVIEWS_PER_PAGE: 5,
  MAX_CART_ITEMS: 100,
  MAX_WISHLIST_ITEMS: 50,
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
};

// Export everything as default
export default {
  APP_CONSTANTS,
  API_ENDPOINTS,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  PAYMENT_METHODS,
  DELIVERY_OPTIONS,
  NOTIFICATION_TYPES,
  VALIDATION_RULES,
  STORAGE_KEYS,
  THEME,
  NAVIGATION,
  API_CONFIG,
  CURRENCY,
  DEFAULTS,
};