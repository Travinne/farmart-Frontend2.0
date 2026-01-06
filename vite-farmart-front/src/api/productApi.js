import api from './axios';
import { setCache, getCache } from './storage';



export const getProducts = async () => {
  const cacheKey = 'products_all';
  
  try {
    const response = await api.get('/products');
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached products due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const addProduct = (payload) => api.post('/products', payload);

export const getProduct = async (id) => {
  const cacheKey = `product_${id}`;
  
  try {
    const response = await api.get(`/products/${id}`);
    setCache(cacheKey, response.data, 15);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached product ${id} due to network error`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const byCategory = async (name) => {
  const cacheKey = `products_category_${name}`;
  
  try {
    const response = await api.get(`/products/category/${name}`);
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached products for category ${name} due to network error`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const searchProducts = async (q) => {
  const cacheKey = `products_search_${q.toLowerCase().replace(/\s+/g, '_')}`;

  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(q)}`);
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn(`Using cached search results for "${q}" due to network error`);
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const getProductsByCategory = byCategory;

export const getFeaturedProducts = async () => {
  const cacheKey = 'products_featured';

  try {
    const response = await api.get('/products/featured');
    setCache(cacheKey, response.data, 10);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached featured products due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};