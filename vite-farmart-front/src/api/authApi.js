import api from "./axios";

export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const logout = () => api.post("/auth/logout");
export const refresh = () => api.post("/auth/refresh");
export const getProfile = () => api.get("/auth/profile");