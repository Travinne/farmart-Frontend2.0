import api from "./axios";


export const getProducts = () => api.get("/products");
export const addProduct = (payload) => api.post("/products", payload);
export const getProduct = (id) => api.get(`/products/${id}`);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const byCategory = (name) => api.get(`/products/category/${name}`);
export const searchProducts = (q) => api.get(`/products/search?q=${q}`);