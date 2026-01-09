import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NOTIFICATION_TYPES } from '../../shared/utils/constants';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      if (!auth.isAuthenticated) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
      
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
};

// Helper function to calculate unread count
const calculateUnreadCount = (notifications) => {
  return notifications.filter(notification => !notification.read).length;
};

// Notification slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        type: action.payload.type || NOTIFICATION_TYPES.SYSTEM,
        title: action.payload.title,
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: action.payload.data || {},
        priority: action.payload.priority || 'normal', // 'low', 'normal', 'high', 'urgent'
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    addSystemNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        type: NOTIFICATION_TYPES.SYSTEM,
        title: action.payload.title,
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: action.payload.data || {},
        priority: action.payload.priority || 'normal',
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    addOrderNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        type: NOTIFICATION_TYPES.ORDER,
        title: action.payload.title || 'Order Update',
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          orderId: action.payload.orderId,
          status: action.payload.status,
          ...action.payload.data,
        },
        priority: action.payload.priority || 'normal',
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    addProductNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        type: NOTIFICATION_TYPES.PRODUCT,
        title: action.payload.title || 'Product Update',
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          productId: action.payload.productId,
          ...action.payload.data,
        },
        priority: action.payload.priority || 'normal',
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    addPromotionNotification: (state, action) => {
      const newNotification = {
        id: Date.now().toString(),
        type: NOTIFICATION_TYPES.PROMOTION,
        title: action.payload.title || 'Special Offer',
        message: action.payload.message,
        read: false,
        createdAt: new Date().toISOString(),
        data: {
          promotionId: action.payload.promotionId,
          discount: action.payload.discount,
          ...action.payload.data,
        },
        priority: action.payload.priority || 'normal',
      };
      
      state.notifications.unshift(newNotification);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    markLocalAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n.id === notificationId);
      
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = calculateUnreadCount(state.notifications);
      }
    },
    
    markAllLocalAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    
    deleteLocalNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
      state.unreadCount = calculateUnreadCount(state.notifications);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.lastFetched = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    setLastFetched: (state) => {
      state.lastFetched = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = calculateUnreadCount(action.payload);
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    
    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        
        if (notification) {
          notification.read = true;
          state.unreadCount = calculateUnreadCount(state.notifications);
        }
      });
    
    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      });
    
    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
        state.unreadCount = calculateUnreadCount(state.notifications);
      });
  },
});

// Selectors
export const selectAllNotifications = (state) => state.notifications.notifications;
export const selectUnreadNotifications = (state) => 
  state.notifications.notifications.filter(notification => !notification.read);
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state) => state.notifications.isLoading;
export const selectNotificationsError = (state) => state.notifications.error;
export const selectLastFetched = (state) => state.notifications.lastFetched;
export const selectNotificationsByType = (type) => (state) =>
  state.notifications.notifications.filter(notification => notification.type === type);
export const selectHighPriorityNotifications = (state) =>
  state.notifications.notifications.filter(notification => 
    notification.priority === 'high' || notification.priority === 'urgent'
  );

// Actions
export const {
  addNotification,
  addSystemNotification,
  addOrderNotification,
  addProductNotification,
  addPromotionNotification,
  markLocalAsRead,
  markAllLocalAsRead,
  deleteLocalNotification,
  clearAllNotifications,
  clearError,
  setLastFetched,
} = notificationSlice.actions;

// Reducer
export default notificationSlice.reducer;