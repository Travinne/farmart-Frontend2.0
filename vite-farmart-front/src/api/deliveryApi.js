import api from './axios';
import { setCache, getCache } from './storage';



export const assignDelivery = (deliveryData) => {
  return api.post('/delivery/assign', deliveryData);
};

export const trackDelivery = async (trackingId) => {
  const cacheKey = `delivery_tracking_${trackingId}`;
  
  try {
    const response = await api.get(`/delivery/track/${trackingId}`);
    setCache(cacheKey, response.data, 2);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached delivery tracking ${trackingId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const updateDeliveryStatus = (deliveryId, status, notes = '') => {
  return api.put(`/delivery/${deliveryId}/status`, { status, notes });
};

export const getDelivery = async (deliveryId) => {
  const cacheKey = `delivery_${deliveryId}`;
  
  try {
    const response = await api.get(`/delivery/${deliveryId}`);
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached delivery ${deliveryId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getRiderHistory = async (riderId, params = {}) => {
  const cacheKey = `rider_history_${riderId}_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get(`/delivery/rider/${riderId}`, { params });
    setCache(cacheKey, response.data, 30);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached rider history ${riderId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getActiveDeliveries = async () => {
  const cacheKey = 'delivery_active';
  
  try {
    const response = await api.get('/delivery/active');
    setCache(cacheKey, response.data, 1);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached active deliveries');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getDeliveryStats = async () => {
  const cacheKey = 'delivery_stats';
  
  try {
    const response = await api.get('/delivery/stats');
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached delivery stats');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};