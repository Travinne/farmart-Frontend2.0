import api from './axios';
import { setCartData, getCartData, removeCartData } from './storage';




export const getCart = async () => {
  try {
    const response = await api.get('/cart');
    
    if (response.data) {
      setCartData(response.data); 
    }
    
    return response;
  } catch (error) {
    const cachedCart = getCartData();
    if (error.code === 'NETWORK_ERROR' && cachedCart?.items?.length > 0) {
      console.warn('Using cached cart data');
      return { data: cachedCart, fromCache: true };
    }
    throw error;
  }
};


export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart/items', { productId, quantity });
  if (response.data) setCartData(response.data);
  return response;
};


export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, { quantity });
  if (response.data) setCartData(response.data);
  return response;
};


export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  if (response.data) setCartData(response.data);
  return response;
};


export const clearCart = async () => {
  const response = await api.delete('/cart/clear');
  removeCartData(); 
  return response;
};


export const applyCoupon = async (couponCode) => {
  const response = await api.post('/cart/coupon', { couponCode });
  if (response.data) setCartData(response.data);
  return response;
};


export const removeCoupon = async () => {
  const response = await api.delete('/cart/coupon');
  if (response.data) setCartData(response.data);
  return response;
};


export const getCartSummary = async () => {
  try {
    const response = await api.get('/cart/summary');
    return response;
  } catch (error) {
    const cachedCart = getCartData();
    if (error.code === 'NETWORK_ERROR' && cachedCart?.items?.length > 0) {
      console.warn('Using cached cart summary');
      const subtotal = cachedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { 
        data: {
          subtotal,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: subtotal
        },
        fromCache: true
      };
    }
    throw error;
  }
};
