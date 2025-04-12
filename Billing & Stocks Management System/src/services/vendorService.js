import api from './api';

const vendorService = {
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
};

export default vendorService;