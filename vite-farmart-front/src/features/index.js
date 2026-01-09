// Export all slices
export { default as authReducer } from './auth/authSlice';
export { default as cartReducer } from './cart/cartSlice';
export { default as notificationReducer } from './notifications/notificationSlice';

// Export all actions
export * from './auth/authSlice';
export * from './cart/cartSlice';
export * from './notifications/notificationSlice';

// Export all selectors
export {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthToken,
  selectUserRole,
  selectUserPermissions,
  selectLoginAttempts,
} from './auth/authSlice';

export {
  selectCartItems,
  selectCartTotalItems,
  selectCartTotalPrice,
  selectCartSubtotal,
  selectCartTax,
  selectCartShipping,
  selectCartTotal,
  selectCartIsEmpty,
  selectCartLoading,
  selectCartError,
  selectCartLastUpdated,
  selectShippingAddress,
  selectBillingAddress,
  selectShippingMethod,
  selectPaymentMethod,
} from './cart/cartSlice';

export {
  selectAllNotifications,
  selectUnreadNotifications,
  selectUnreadCount,
  selectNotificationsLoading,
  selectNotificationsError,
  selectLastFetched,
  selectNotificationsByType,
  selectHighPriorityNotifications,
} from './notifications/notificationSlice';