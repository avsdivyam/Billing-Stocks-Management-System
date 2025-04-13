import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already logged in
        if (authService.isAuthenticated()) {
          // Get user from localStorage
          const storedUser = authService.getCurrentUser();
          setUser(storedUser);
          
          try {
            // Verify token is valid by fetching profile
            const profile = await authService.getProfile();
            
            // Update user state with latest profile data
            setUser(profile);
          } catch (profileErr) {
            console.error('Error fetching profile:', profileErr);
            // If token is invalid or expired, log out
            handleLogout();
            setError('Session expired. Please log in again.');
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // If token is invalid, log out
        handleLogout();
        setError('Authentication error. Please log in again.');
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, []);

  // Periodically check token validity
  useEffect(() => {
    if (!initialized) return;
    
    const checkTokenInterval = setInterval(() => {
      if (authService.isAuthenticated() && authService.isTokenExpired()) {
        console.log('Token expired during session, logging out');
        handleLogout();
        setError('Your session has expired. Please log in again.');
        // We'll handle navigation in the component that uses this context
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkTokenInterval);
  }, [initialized]);

  // Handle logout with proper cleanup
  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMessage = err.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      const errorMessage = err.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    handleLogout();
    // Navigation will be handled by the component using this context
  };

  // Update profile function
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.updateUser(userId, userData);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMessage = err.error || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      throw { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.changePassword(currentPassword, newPassword);
      return data;
    } catch (err) {
      const errorMessage = err.error || 'Failed to change password. Please try again.';
      setError(errorMessage);
      throw { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isOwner: user?.role === 'owner',
    hasPermission: (requiredRole) => {
      if (!user) return false;
      if (user.role === 'admin') return true; // Admin has all permissions
      return user.role === requiredRole;
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;