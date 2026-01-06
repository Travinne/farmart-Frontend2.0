import api from './axios';
import { setCache, getCache } from './storage';



export const createOrder = (orderData) => {
  return api.post('/orders', orderData);
};

export const getOrders = async (params = {}) => {
  const cacheKey = `orders_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get('/orders', { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached orders');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getOrder = async (orderId) => {
  const cacheKey = `order_${orderId}`;
  
  try {
    const response = await api.get(`/orders/${orderId}`);
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached order ${orderId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const updateOrder = (orderId, orderData) => {
  return api.put(`/orders/${orderId}`, orderData);
};

export const cancelOrder = (orderId, reason) => {
  return api.post(`/orders/${orderId}/cancel`, { reason });
};

export const getOrderByTracking = async (trackingNumber) => {
  const cacheKey = `order_tracking_${trackingNumber}`;
  
  try {
    const response = await api.get(`/orders/tracking/${trackingNumber}`);
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached order for tracking ${trackingNumber}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getOrdersByUser = async (userId, params = {}) => {
  const cacheKey = `orders_user_${userId}_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get(`/orders/user/${userId}`, { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached orders for user ${userId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const confirmOrder = (orderId) => {
  return api.post(`/orders/${orderId}/confirm`);
};

export const completeOrder = (orderId) => {
  return api.post(`/orders/${orderId}/complete`);
};