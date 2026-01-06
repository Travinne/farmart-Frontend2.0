import api from "./axios";


export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const logoutUser = () => api.post("/auth/logout");
export const refreshToken = () => api.post("/auth/refresh");
export const getUserProfile = () => api.get("/auth/profile");


export const getCart = () => api.get("/cart");
export const addToCart = (payload) => api.post("/cart", payload);
export const updateCartItem = (id, payload) => api.put(`/cart/${id}`, payload);
export const removeCartItem = (id) => api.delete(`/cart/${id}`);
export const clearCart = () => api.delete("/cart/clear");


export const getOrders = () => api.get("/orders");
export const createOrder = (payload) => api.post("/orders", payload);
export const getOrderById = (id) => api.get(`/orders/${id}`);


export const checkoutOrder = (payload) => api.post("/checkout", payload);
