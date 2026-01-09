import { configureStore } from '@reduxjs/toolkit';
import { 
  authReducer, 
  cartReducer, 
  notificationReducer 
} from './features';

// Configure store with reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    notifications: notificationReducer,
    // Add other reducers here as needed
  },
  
  // Middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'cart/addToCart',
          'cart/updateQuantity',
          'notifications/addNotification',
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'cart.lastUpdated',
          'notifications.notifications.createdAt',
        ],
      },
    }),
    
  // Enable Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// Subscribe to store changes to persist certain states
store.subscribe(() => {
  const state = store.getState();
  
  // Persist cart items
  if (state.cart?.items) {
    try {
      localStorage.setItem('farmart_cart', JSON.stringify(state.cart.items));
    } catch (error) {
      console.error('Error persisting cart:', error);
    }
  }
  
  // Persist user data if authenticated
  if (state.auth?.isAuthenticated && state.auth.user) {
    try {
      localStorage.setItem('farmart_user', JSON.stringify(state.auth.user));
    } catch (error) {
      console.error('Error persisting user:', error);
    }
  }
});

export default store;