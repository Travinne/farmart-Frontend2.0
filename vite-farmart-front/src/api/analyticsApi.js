import api from './axios';
import { setCache, getCache } from './storage';



export const salesAnalytics = async () => {
  const cacheKey = 'analytics_sales';
  
  try {
    const response = await api.get('/analytics/sales');
    setCache(cacheKey, response.data, 15); 
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached sales analytics due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const orderAnalytics = async () => {
  const cacheKey = 'analytics_orders';
  
  try {
    const response = await api.get('/analytics/orders');
    setCache(cacheKey, response.data, 15);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached order analytics due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const productAnalytics = async () => {
  const cacheKey = 'analytics_products';
  
  try {
    const response = await api.get('/analytics/products');
    setCache(cacheKey, response.data, 15);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached product analytics due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const farmerAnalytics = async () => {
  const cacheKey = 'analytics_farmers';
  
  try {
    const response = await api.get('/analytics/farmers');
    setCache(cacheKey, response.data, 15);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached farmer analytics due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};