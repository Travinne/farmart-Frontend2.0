import api from './axios';
import { setCache, getCache } from './storage';




export const getAdminStats = async () => {
  const cacheKey = 'admin_stats';
  
  try {
    const response = await api.get('/admin/stats');
    setCache(cacheKey, response.data, 10); 
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached admin stats due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};


export const getAdminUsers = async () => {
  const cacheKey = 'admin_users';
  
  try {
    const response = await api.get('/admin/users');
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached admin users due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const banUser = (id) => api.put(`/admin/user/${id}/ban`);

export const changeUserRole = (id, payload) => 
  api.put(`/admin/user/${id}/role`, payload);


export const getAdminProducts = async () => {
  const cacheKey = 'admin_products';
  
  try {
    const response = await api.get('/admin/products');
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached admin products due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};



export const adminDeleteProduct = (id) => api.delete(`/products/${id}`);

export const adminEditProduct = (id, payload) => api.put(`/products/${id}`, payload);


export const getAdminOrders = async () => {
  const cacheKey = 'admin_orders';
  
  try {
    const response = await api.get('/orders');
    setCache(cacheKey, response.data, 2);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached admin orders due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};

export const adminConfirmOrder = (id) => api.post(`/orders/${id}/confirm`);

export const adminCompleteOrder = (id) => api.post(`/orders/${id}/complete`);

export const adminUpdateOrderStatus = (id, payload) => api.put(`/orders/${id}`, payload);


export const getAdminAnalytics = getAdminStats;


export const deleteProduct = adminDeleteProduct;


export const getAdminPayments = async () => {
  const cacheKey = 'admin_payments';
  
  try {
    const response = await api.get('/admin/payments');
    setCache(cacheKey, response.data, 5);
    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getCache(cacheKey);
      if (cached) {
        console.warn('Using cached admin payments due to network error');
        return { data: cached, fromCache: true };
      }
    }
    throw error;
  }
};