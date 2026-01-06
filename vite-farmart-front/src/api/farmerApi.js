import api from './axios';
import { setCache, getCache } from './storage';



export const getFarmers = async (params = {}) => {
  const cacheKey = `farmers_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get('/farmers', { params });
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached farmers list');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getFarmer = async (farmerId) => {
  const cacheKey = `farmer_${farmerId}`;
  
  try {
    const response = await api.get(`/farmers/${farmerId}`);
    setCache(cacheKey, response.data, 15);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached farmer ${farmerId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const createFarmer = (farmerData) => {
  return api.post('/farmers', farmerData);
};

export const updateFarmer = (farmerId, farmerData) => {
  return api.put(`/farmers/${farmerId}`, farmerData);
};

export const deleteFarmer = (farmerId) => {
  return api.delete(`/farmers/${farmerId}`);
};

export const getFarmerProducts = async (farmerId, params = {}) => {
  const cacheKey = `farmer_products_${farmerId}_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get(`/farmers/${farmerId}/products`, { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached products for farmer ${farmerId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getFarmerOrders = async (farmerId, params = {}) => {
  const cacheKey = `farmer_orders_${farmerId}_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get(`/farmers/${farmerId}/orders`, { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached orders for farmer ${farmerId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getFarmerStats = async (farmerId) => {
  const cacheKey = `farmer_stats_${farmerId}`;
  
  try {
    const response = await api.get(`/farmers/${farmerId}/stats`);
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached stats for farmer ${farmerId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};