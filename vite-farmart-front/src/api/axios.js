import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("access_token", data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API Endpoints
export const ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
  },
  farmers: {
    base: "/farmers",
    products: (id) => `/farmers/${id}/products`,
    orders: (id) => `/farmers/${id}/orders`,
  },
  products: {
    base: "/products",
    byId: (id) => `/products/${id}`,
    byCategory: (name) => `/products/category/${name}`,
    search: (q) => `/products/search?q=${q}`,
  },
  equipment: {
    base: "/equipment",
    byId: (id) => `/equipment/${id}`,
  },
  orders: {
    base: "/orders",
    byUser: (id) => `/orders/user/${id}`,
    confirm: (id) => `/orders/${id}/confirm`,
    complete: (id) => `/orders/${id}/complete`,
  },
  payments: {
    initiate: "/payments/initiate",
    confirm: "/payments/confirm",
    byOrder: (id) => `/payments/order/${id}`,
    byUser: (id) => `/payments/user/${id}`,
  },
  inventory: {
    base: "/inventory",
    lowStock: "/inventory/low-stock",
  },
  delivery: {
    assign: "/delivery/assign",
    track: (id) => `/delivery/track/${id}`,
    status: (id) => `/delivery/${id}/status`,
    rider: (id) => `/delivery/rider/${id}`,
  },
  agents: {
    base: "/agents",
  },
  admin: {
    users: "/admin/users",
    stats: "/admin/stats",
    payments: "/admin/payments",
    products: "/admin/products",
    ban: (id) => `/admin/user/${id}/ban`,
    role: (id) => `/admin/user/${id}/role`,
  },
  analytics: {
    sales: "/analytics/sales",
    orders: "/analytics/orders",
    products: "/analytics/products",
    farmers: "/analytics/farmers",
  },
};
