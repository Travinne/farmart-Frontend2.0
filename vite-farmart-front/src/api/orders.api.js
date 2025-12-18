import api from "./axios";


export const createOrder = (payload) => api.post("/orders", payload);
export const getOrders = () => api.get("/orders");
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrder = (id, payload) => api.put(`/orders/${id}`, payload);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
export const ordersByUser = (id) => api.get(`/orders/user/${id}`);
export const confirmOrder = (id) => api.post(`/orders/${id}/confirm`);
export const completeOrder = (id) => api.post(`/orders/${id}/complete`);