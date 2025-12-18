import api from "./axios";


export const adminUsers = () => api.get("/admin/users");
export const adminStats = () => api.get("/admin/stats");
export const adminPayments = () => api.get("/admin/payments");
export const adminProducts = () => api.get("/admin/products");
export const banUser = (id) => api.put(`/admin/user/${id}/ban`);
export const changeUserRole = (id, payload) => api.put(`/admin/user/${id}/role`, payload);