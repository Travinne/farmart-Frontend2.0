import api from './axios';



export const initiatePayment = (paymentData) => {
  return api.post('/payments/initiate', paymentData);
};

export const confirmPayment = (paymentData) => {
  return api.post('/payments/confirm', paymentData);
};

export const getPayment = (paymentId) => {
  return api.get(`/payments/${paymentId}`);
};

export const getPaymentsByOrder = (orderId) => {
  return api.get(`/payments/order/${orderId}`);
};

export const getPaymentsByUser = (userId) => {
  return api.get(`/payments/user/${userId}`);
};

export const refundPayment = (paymentId, reason) => {
  return api.post(`/payments/${paymentId}/refund`, { reason });
};

export const getPaymentMethods = () => {
  return api.get('/payments/methods');
};

export const verifyPayment = (paymentReference) => {
  return api.get(`/payments/verify/${paymentReference}`);
};

export const savePaymentMethod = (paymentMethodData) => {
  return api.post('/payments/methods', paymentMethodData);
};

export const deletePaymentMethod = (methodId) => {
  return api.delete(`/payments/methods/${methodId}`);
};