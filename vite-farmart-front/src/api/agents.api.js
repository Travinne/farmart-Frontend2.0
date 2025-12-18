import api from "./axios";


export const getAgents = () => api.get("/agents");
export const addAgent = (payload) => api.post("/agents", payload);
export const getAgent = (id) => api.get(`/agents/${id}`);
export const updateAgent = (id, payload) => api.put(`/agents/${id}`, payload);
export const deleteAgent = (id) => api.delete(`/agents/${id}`);