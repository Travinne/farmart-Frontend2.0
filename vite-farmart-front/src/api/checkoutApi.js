import api from './axios';



export const checkoutOrder = (checkoutData) => {
  return api.post('/checkout', checkoutData);
};

export const verifyCheckout = (checkoutData) => {
  return api.post('/checkout/verify', checkoutData);
};

export const getShippingMethods = () => {
  return api.get('/checkout/shipping-methods');
};

export const getPaymentMethods = () => {
  return api.get('/checkout/payment-methods');
};

export const validateAddress = (address) => {
  return api.post('/checkout/validate-address', address);
};

export const calculateShipping = (shippingData) => {
  return api.post('/checkout/calculate-shipping', shippingData);
};

export const getCheckoutSummary = () => {
  return api.get('/checkout/summary');
};