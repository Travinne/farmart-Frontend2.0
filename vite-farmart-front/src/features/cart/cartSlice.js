import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../shared/utils/constants';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Async thunks
export const syncCartWithServer = createAsyncThunk(
  'cart/sync',
  async (cartItems, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      if (!auth.isAuthenticated) {
        return cartItems; // Return local cart if not authenticated
      }
      
      const response = await fetch('/api/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }
      
      const data = await response.json();
      return data.items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveCartToServer = createAsyncThunk(
  'cart/save',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth, cart } = getState();
      
      if (!auth.isAuthenticated) {
        throw new Error('User not authenticated');
      }
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ items: cart.items }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save cart');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: loadCartFromStorage(),
  isLoading: false,
  error: null,
  lastUpdated: null,
  cartId: null,
  shippingAddress: null,
  billingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
          addedAt: new Date().toISOString(),
        });
      }
      
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state.items);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state.items);
    },
    
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        state.lastUpdated = new Date().toISOString();
        saveCartToStorage(state.items);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state.items);
    },
    
    mergeCart: (state, action) => {
      const serverItems = action.payload;
      
      // Merge local and server cart items
      const mergedItems = [...state.items];
      
      serverItems.forEach(serverItem => {
        const existingItemIndex = mergedItems.findIndex(item => item.id === serverItem.id);
        
        if (existingItemIndex >= 0) {
          // Use the larger quantity
          mergedItems[existingItemIndex].quantity = Math.max(
            mergedItems[existingItemIndex].quantity,
            serverItem.quantity
          );
        } else {
          mergedItems.push(serverItem);
        }
      });
      
      state.items = mergedItems;
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state.items);
    },
    
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    
    setBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
    
    setShippingMethod: (state, action) => {
      state.shippingMethod = action.payload;
    },
    
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },
    
    resetCartState: (state) => {
      state.items = [];
      state.shippingAddress = null;
      state.billingAddress = null;
      state.shippingMethod = null;
      state.paymentMethod = null;
      state.cartId = null;
      state.lastUpdated = new Date().toISOString();
      saveCartToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    // Sync cart
    builder
      .addCase(syncCartWithServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.lastUpdated = new Date().toISOString();
        saveCartToStorage(state.items);
      })
      .addCase(syncCartWithServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    
    // Save cart
    builder
      .addCase(saveCartToServer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveCartToServer.fulfilled, (state) => {
        state.isLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(saveCartToServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartSubtotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartTax = (state) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal * 0.08; // 8% tax rate
};
export const selectCartShipping = (state) => {
  const subtotal = selectCartSubtotal(state);
  return subtotal > 50 ? 0 : 5.99; // Free shipping over $50
};
export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  return subtotal + tax + shipping;
};
export const selectCartIsEmpty = (state) => state.cart.items.length === 0;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectCartLastUpdated = (state) => state.cart.lastUpdated;
export const selectShippingAddress = (state) => state.cart.shippingAddress;
export const selectBillingAddress = (state) => state.cart.billingAddress;
export const selectShippingMethod = (state) => state.cart.shippingMethod;
export const selectPaymentMethod = (state) => state.cart.paymentMethod;

// Actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  mergeCart,
  setShippingAddress,
  setBillingAddress,
  setShippingMethod,
  setPaymentMethod,
  setCartId,
  resetCartState,
} = cartSlice.actions;

// Reducer
export default cartSlice.reducer;