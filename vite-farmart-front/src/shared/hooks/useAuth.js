import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, registerUser, resetAuthError, setUser } from '../../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { user, isLoading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  // Local states
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // 'customer', 'farmer'
    agreeToTerms: false,
  });

  const [resetPasswordData, setResetPasswordData] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Handle login
  const handleLogin = useCallback(async (e) => {
    e?.preventDefault();
    if (!loginData.email || !loginData.password) {
      return { success: false, error: 'Please fill in all fields' };
    }
    
    const result = await dispatch(loginUser({
      email: loginData.email,
      password: loginData.password,
    }));
    
    if (loginData.rememberMe && result.payload?.token) {
      localStorage.setItem('farmart_token', result.payload.token);
    }
    
    return result;
  }, [dispatch, loginData]);

  // Handle registration
  const handleRegister = useCallback(async (e) => {
    e?.preventDefault();
    
    // Validation
    if (!registerData.name || !registerData.email || !registerData.password) {
      return { success: false, error: 'Please fill in all required fields' };
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }
    
    if (!registerData.agreeToTerms) {
      return { success: false, error: 'You must agree to the terms and conditions' };
    }
    
    const result = await dispatch(registerUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role,
    }));
    
    return result;
  }, [dispatch, registerData]);

  // Handle logout
  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    localStorage.removeItem('farmart_token');
    localStorage.removeItem('farmart_user');
    navigate('/login');
  }, [dispatch, navigate]);

  // Handle password reset
  const handleResetPassword = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!resetPasswordData.email) {
      return { success: false, error: 'Please enter your email' };
    }
    
    // API call would go here
    console.log('Reset password request for:', resetPasswordData.email);
    
    return { success: true, message: 'Reset password email sent' };
  }, [resetPasswordData]);

  // Handle forgot password
  const handleForgotPassword = useCallback(async (email) => {
    if (!email) {
      return { success: false, error: 'Please enter your email' };
    }
    
    // API call would go here
    console.log('Forgot password request for:', email);
    
    return { success: true, message: 'Reset instructions sent to your email' };
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    // API call would go here
    console.log('Updating profile:', profileData);
    
    // Update local storage if needed
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('farmart_user', JSON.stringify(updatedUser));
    
    return { success: true, user: updatedUser };
  }, [user]);

  // Check if user is authenticated
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('farmart_token');
    const storedUser = localStorage.getItem('farmart_user');
    
    if (token && storedUser && !user) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    
    return !!token && !!storedUser;
  }, [dispatch, user]);

  // Clear auth error
  const clearError = useCallback(() => {
    dispatch(resetAuthError());
  }, [dispatch]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!user) return false;
    return user.role === role;
  }, [user]);

  // Get user dashboard path based on role
  const getDashboardPath = useCallback(() => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'farmer':
        return '/farmer/dashboard';
      case 'customer':
        return '/profile';
      default:
        return '/';
    }
  }, [user]);

  // Check if user can access route
  const canAccess = useCallback((allowedRoles = []) => {
    if (!user) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  }, [user]);

  // Update login form data
  const updateLoginData = useCallback((field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update register form data
  const updateRegisterData = useCallback((field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update reset password data
  const updateResetPasswordData = useCallback((field, value) => {
    setResetPasswordData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    loginData,
    registerData,
    resetPasswordData,
    
    // Actions
    handleLogin,
    handleRegister,
    handleLogout,
    handleResetPassword,
    handleForgotPassword,
    updateProfile,
    clearError,
    checkAuth,
    
    // Role checks
    hasRole,
    getDashboardPath,
    canAccess,
    
    // Form updates
    updateLoginData,
    updateRegisterData,
    updateResetPasswordData,
    
    // User info
    isAdmin: user?.role === 'admin',
    isFarmer: user?.role === 'farmer',
    isCustomer: user?.role === 'customer' || !user,
  };
};

// Hook for checking auth in components
export const useAuthCheck = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  return {
    isAuthenticated,
    isLoading,
    isChecking: isLoading,
  };
};

// Hook for protecting routes
export const useRouteProtection = (allowedRoles = []) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  
  const canAccess = () => {
    if (isLoading) return 'loading';
    if (!user) return 'unauthenticated';
    if (allowedRoles.length === 0) return 'allowed';
    return allowedRoles.includes(user.role) ? 'allowed' : 'unauthorized';
  };
  
  return {
    status: canAccess(),
    user,
    isLoading,
  };
};