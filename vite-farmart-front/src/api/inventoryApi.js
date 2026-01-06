import api from './axios';
import { setCache, getCache } from './storage';



export const getInventory = async (params = {}) => {
  const cacheKey = `inventory_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get('/inventory', { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached inventory');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getInventoryItem = async (itemId) => {
  const cacheKey = `inventory_item_${itemId}`;
  
  try {
    const response = await api.get(`/inventory/${itemId}`);
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached inventory item ${itemId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const addInventory = (inventoryData) => {
  return api.post('/inventory', inventoryData);
};

export const updateInventory = (itemId, inventoryData) => {
  return api.put(`/inventory/${itemId}`, inventoryData);
};

export const deleteInventory = (itemId) => {
  return api.delete(`/inventory/${itemId}`);
};

export const getLowStock = async () => {
  const cacheKey = 'inventory_low_stock';
  
  try {
    const response = await api.get('/inventory/low-stock');
    setCache(cacheKey, response.data, 2);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached low stock inventory');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getInventoryByProduct = async (productId) => {
  const cacheKey = `inventory_product_${productId}`;
  
  try {
    const response = await api.get(`/inventory/product/${productId}`);
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached inventory for product ${productId}`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const updateStockLevel = (itemId, quantity, reason) => {
  return api.post(`/inventory/${itemId}/stock`, { quantity, reason });
};

export const getInventoryHistory = async (params = {}) => {
  const cacheKey = `inventory_history_${JSON.stringify(params)}`;
  
  try {
    const response = await api.get('/inventory/history', { params });
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached inventory history');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};