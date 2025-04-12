import api from './api';

const authService = {
  // Login user
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
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
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get profile' };
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

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;