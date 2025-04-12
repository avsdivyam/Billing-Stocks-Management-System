import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is already logged in
        if (authService.isAuthenticated()) {
          // Get user from localStorage
          const storedUser = authService.getCurrentUser();
          
          // Verify token is valid by fetching profile
          const profile = await authService.getProfile();
          
          // Update user state with latest profile data
          setUser(profile);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        // If token is invalid, log out
        authService.logout();
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
      setError(err.error || 'Login failed');
      throw err;
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
      setError(err.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
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
      setError(err.error || 'Failed to update profile');
      throw err;
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
      setError(err.error || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
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
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
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