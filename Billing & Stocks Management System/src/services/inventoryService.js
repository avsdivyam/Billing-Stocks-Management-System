import api from './api';

const inventoryService = {
  // Categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/inventory/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get categories' };
    }
  },

  getCategoryById: async (categoryId) => {
    try {
      const response = await api.get(`/inventory/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get category' };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/inventory/categories', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create category' };
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await api.put(`/inventory/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update category' };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await api.delete(`/inventory/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete category' };
    }
  },

  // Products
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/inventory/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get products' };
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await api.get(`/inventory/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get product' };
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/inventory/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create product' };
    }
  },

  updateProduct: async (productId, productData) => {
    try {
      const response = await api.put(`/inventory/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update product' };
    }
  },

  deleteProduct: async (productId) => {
    try {
      const response = await api.delete(`/inventory/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete product' };
    }
  },

  getLowStockProducts: async () => {
    try {
      const response = await api.get('/inventory/products/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get low stock products' };
    }
  },
};

export default inventoryService;