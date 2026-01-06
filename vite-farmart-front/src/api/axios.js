import axios from 'axios';


const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (import.meta.env.PROD) {
    return 'https://localhost:5000/api';
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || 
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (!response) {
      return Promise.reject({ 
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR' 
      });
    }
    
    switch (response.status) {
      case 401:
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('unauthorized'));
        break;
      case 403:
        window.dispatchEvent(new CustomEvent('forbidden'));
        break;
    }
    
    return Promise.reject({
      status: response.status,
      message: response.data?.message || `Request failed with status ${response.status}`,
      data: response.data,
    });
  }
);

export default api;