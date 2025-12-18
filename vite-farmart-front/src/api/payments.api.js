import api from "./axios";


export const initiatePayment = (payload) => api.post("/payments/initiate", payload);
export const confirmPayment = (payload) => api.post("/payments/confirm", payload);
export const paymentsByOrder = (id) => api.get(`/payments/order/${id}`);
export const paymentsByUser = (id) => api.get(`/payments/user/${id}`);