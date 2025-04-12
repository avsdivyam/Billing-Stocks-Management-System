import api from './api';

const reportService = {
  // Sales reports
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/sales', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get sales report' };
    }
  },

  // Purchases reports
  getPurchasesReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/purchases', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get purchases report' };
    }
  },

  // GST reports
  getGSTReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/gst', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get GST report' };
    }
  },

  // Inventory reports
  getInventoryReport: async (params = {}) => {
    try {
      const response = await api.get('/reports/inventory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get inventory report' };
    }
  },

  // Download report in different formats
  downloadReport: async (reportType, format, params = {}) => {
    try {
      // Set responseType to blob for file download
      const response = await api.get(`/reports/${reportType}`, {
        params: { ...params, format },
        responseType: 'blob',
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error.response?.data || { error: `Failed to download ${reportType} report` };
    }
  },
};

export default reportService;