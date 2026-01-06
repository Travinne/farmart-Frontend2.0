import api from './axios';
import { setLocal, getLocal, getUserData } from './storage';


const USER_KEY = 'user';
const USER_PROFILE_KEY = 'user_profile';
const DEFAULT_CACHE_TTL_MINUTES = 10;




export const loginUser = async (payload) => {
  try {
    const response = await api.post('/auth/login', payload);

    return response;
  } catch (error) {
    console.error('Login failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const registerUser = async (payload) => {
  try {
    const response = await api.post('/auth/register', payload);

    return response;
  } catch (error) {
    console.error('Registration failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const logoutUser = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    console.warn('Logout API failed, clearing locally anyway.');
  }
};


export const refreshToken = async () => {
  try {
    return await api.post('/auth/refresh');
  } catch (error) {
    console.error('Token refresh failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const getUserProfile = async (ttlMinutes = DEFAULT_CACHE_TTL_MINUTES) => {
  try {
    const response = await api.get('/auth/profile');

    if (response.data) {
      setLocal(USER_PROFILE_KEY, response.data, ttlMinutes);
    }

    return response;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      const cached = getLocal(USER_PROFILE_KEY);
      const currentUser = getUserData();

      if (cached || currentUser) {
        console.warn('Using cached user profile due to network error');
        return {
          data: cached || currentUser,
          fromCache: true,
        };
      }
    }

    console.error('Fetching user profile failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const updateUserProfile = async (payload) => {
  try {
    const response = await api.put('/auth/profile', payload);

    if (response.data) {
      setLocal(USER_PROFILE_KEY, response.data, DEFAULT_CACHE_TTL_MINUTES);
    }

    return response;
  } catch (error) {
    console.error('Update user profile failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const changePassword = async (payload) => {
  try {
    const response = await api.post('/auth/change-password', payload);
    return response;
  } catch (error) {
    console.error('Change password failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  } catch (error) {
    console.error('Forgot password request failed:', error?.response?.data || error.message);
    throw error;
  }
};


export const resetPassword = async (payload) => {
  try {
    const response = await api.post('/auth/reset-password', payload);
    return response;
  } catch (error) {
    console.error('Reset password failed:', error?.response?.data || error.message);
    throw error;
  }
};
