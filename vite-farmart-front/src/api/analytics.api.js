import api from "./axios";


export const salesAnalytics = () => api.get("/analytics/sales");
export const orderAnalytics = () => api.get("/analytics/orders");
export const productAnalytics = () => api.get("/analytics/products");
export const farmerAnalytics = () => api.get("/analytics/farmers");