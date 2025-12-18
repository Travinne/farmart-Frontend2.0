import api from "./axios";


export const getInventory = () => api.get("/inventory");
export const addInventory = (payload) => api.post("/inventory", payload);
export const updateInventory = (id, payload) => api.put(`/inventory/${id}`, payload);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);
export const lowStock = () => api.get("/inventory/low-stock");