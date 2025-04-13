import api from './api';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_THRESHOLD = 50 * 60 * 1000;

const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.access_token) {
        authService.setSession(response.data.access_token, response.data.user);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      // Check token validity before making the request
      if (authService.isTokenExpired()) {
        throw new Error('Token expired');
      }
      
      const response = await api.get('/auth/profile');
      
      // Update stored user data with latest from server
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === response.data.id) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get profile' };
    }
  },

  // Update user profile
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      
      // Update stored user data if it's the current user
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to change password' };
    }
  },

  // Set session data
  setSession: (token, user) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      // localStorage.removeItem(TOKEN_KEY);
      // localStorage.removeItem(USER_KEY);
    }
  },

  // Logout user
  logout: () => {
    authService.setSession(null, null);
  },

  // Check if token is expired
  isTokenExpired: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return true;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired or about to expire
      return decoded.exp < currentTime + TOKEN_EXPIRY_THRESHOLD / 1000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  },

  // Check if user is logged in with a valid token
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY) && !authService.isTokenExpired();
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role : null;
  },
  
  // Check if user is admin
  isAdmin: () => {
    return authService.getUserRole() === 'admin';
  }
};

export default authService;