import api from './api';

const billingService = {
  // Customers
  getAllCustomers: async () => {
    try {
      const response = await api.get('/billing/customers');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get customers' };
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await api.get(`/billing/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get customer' };
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/billing/customers', customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create customer' };
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await api.put(`/billing/customers/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update customer' };
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      const response = await api.delete(`/billing/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete customer' };
    }
  },

  // Sales
  getAllSales: async (params = {}) => {
    try {
      const response = await api.get('/billing/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get sales' };
    }
  },

  getSaleById: async (saleId) => {
    try {
      const response = await api.get(`/billing/sales/${saleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get sale' };
    }
  },

  createSale: async (saleData) => {
    try {
      const response = await api.post('/billing/sales', saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create sale' };
    }
  },

  updateSale: async (saleId, saleData) => {
    try {
      const response = await api.put(`/billing/sales/${saleId}`, saleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update sale' };
    }
  },

  deleteSale: async (saleId) => {
    try {
      const response = await api.delete(`/billing/sales/${saleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete sale' };
    }
  },

  // Purchases
  getAllPurchases: async (params = {}) => {
    try {
      const response = await api.get('/billing/purchases', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get purchases' };
    }
  },

  getPurchaseById: async (purchaseId) => {
    try {
      const response = await api.get(`/billing/purchases/${purchaseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get purchase' };
    }
  },

  createPurchase: async (purchaseData) => {
    try {
      const response = await api.post('/billing/purchases', purchaseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create purchase' };
    }
  },

  updatePurchase: async (purchaseId, purchaseData) => {
    try {
      const response = await api.put(`/billing/purchases/${purchaseId}`, purchaseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update purchase' };
    }
  },

  deletePurchase: async (purchaseId) => {
    try {
      const response = await api.delete(`/billing/purchases/${purchaseId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete purchase' };
    }
  },
};

export default billingService;