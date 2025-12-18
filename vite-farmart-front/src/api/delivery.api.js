import api from "./axios";


export const assignDelivery = (payload) => api.post("/delivery/assign", payload);
export const trackDelivery = (id) => api.get(`/delivery/track/${id}`);
export const updateDeliveryStatus = (id, payload) => api.put(`/delivery/${id}/status`, payload);
export const riderHistory = (id) => api.get(`/delivery/rider/${id}`);