
export const setLocal = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to set localStorage key "${key}":`, error);
    return false;
  }
};

export const getLocal = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to get localStorage key "${key}":`, error);
    
    const rawItem = localStorage.getItem(key);
    if (typeof rawItem === 'string' && rawItem !== 'null' && rawItem !== 'undefined') {
      return rawItem;
    }
    return defaultValue;
  }
};

export const removeLocal = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove localStorage key "${key}":`, error);
    return false;
  }
};


export const setSession = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    sessionStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to set sessionStorage key "${key}":`, error);
    return false;
  }
};

export const getSession = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Failed to get sessionStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const removeSession = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove sessionStorage key "${key}":`, error);
    return false;
  }
};


export const setToken = (token, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;
  try {
    storage.setItem('token', token);
    return true;
  } catch (error) {
    console.error('Failed to store token:', error);
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};


const USER_KEY = 'user';
export const setUserData = (user) => setLocal(USER_KEY, user);
export const getUserData = () => getLocal(USER_KEY, null);
export const removeUserData = () => removeLocal(USER_KEY);


const CART_KEY = 'cart_data';
export const setCartData = (cart) => setLocal(CART_KEY, cart);
export const getCartData = () => getLocal(CART_KEY, { items: [] });
export const removeCartData = () => removeLocal(CART_KEY);


export const setCache = (key, value, ttlMinutes = 5) => {
  try {
    const item = { value, timestamp: Date.now(), ttl: ttlMinutes * 60 * 1000 };
    setLocal(`cache_${key}`, item);
    return true;
  } catch (error) {
    console.error(`Failed to cache "${key}":`, error);
    return false;
  }
};

export const getCache = (key) => {
  try {
    const item = getLocal(`cache_${key}`);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      removeLocal(`cache_${key}`);
      return null;
    }

    return item.value;
  } catch (error) {
    console.error(`Failed to get cache "${key}":`, error);
    return null;
  }
};

export const clearCache = (pattern = 'cache_') => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(pattern)) localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
};
