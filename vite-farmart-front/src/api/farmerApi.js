import api from "./axios";


export const getFarmers = () => api.get("/farmers");
export const createFarmer = (payload) => api.post("/farmers", payload);
export const getFarmer = (id) => api.get(`/farmers/${id}`);
export const updateFarmer = (id, payload) => api.put(`/farmers/${id}`, payload);
export const deleteFarmer = (id) => api.delete(`/farmers/${id}`);
export const getFarmerProducts = (id) => api.get(`/farmers/${id}/products`);
export const getFarmerOrders = (id) => api.get(`/farmers/${id}/orders`);