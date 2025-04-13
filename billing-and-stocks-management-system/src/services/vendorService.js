import api from './api';

/**
 * Service for managing vendors and vendor categories
 */
const vendorService = {
  // Vendor methods
  
  // Get all vendors
  getAllVendors: async () => {
    try {
      const response = await api.get('/vendors');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get vendors' };
    }
  },

  // Get vendor by ID
  getVendorById: async (vendorId) => {
    try {
      const response = await api.get(`/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get vendor' };
    }
  },

  // Create new vendor
  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/vendors', vendorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create vendor' };
    }
  },

  // Update vendor
  updateVendor: async (vendorId, vendorData) => {
    try {
      const response = await api.put(`/vendors/${vendorId}`, vendorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update vendor' };
    }
  },

  // Delete vendor
  deleteVendor: async (vendorId) => {
    try {
      const response = await api.delete(`/vendors/${vendorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete vendor' };
    }
  },
  
  // Vendor Category methods
  
  // Get all vendor categories
  getVendorCategories: async () => {
    try {
      const response = await api.get('/vendor-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get vendor categories' };
    }
  },
  
  // Get vendor category by ID
  getVendorCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/vendor-categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get vendor category' };
    }
  },
  
  // Create new vendor category
  createVendorCategory: async (categoryData) => {
    try {
      const response = await api.post('/vendor-categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create vendor category' };
    }
  },
  
  // Update vendor category
  updateVendorCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/vendor-categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update vendor category' };
    }
  },
  
  // Delete vendor category
  deleteVendorCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/vendor-categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete vendor category' };
    }
  },
  
  // Get vendors by category
  getVendorsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/vendor-categories/${categoryId}/vendors`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get vendors by category' };
    }
  },
};

export default vendorService;