import api from './api';

/**
 * Service for managing categories
 */
const categoryService = {
  /**
   * Get all categories
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get a category by ID
   * @param {number|string} id Category ID
   * @returns {Promise<Object>} Category data
   */
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {Object} categoryData Category data
   * @returns {Promise<Object>} Created category
   */
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Update a category
   * @param {number|string} id Category ID
   * @param {Object} categoryData Updated category data
   * @returns {Promise<Object>} Updated category
   */
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {number|string} id Category ID
   * @returns {Promise<Object>} Response data
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get products by category ID
   * @param {number|string} id Category ID
   * @returns {Promise<Array>} List of products in the category
   */
  getProductsByCategory: async (id) => {
    try {
      const response = await api.get(`/categories/${id}/products`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for category ${id}:`, error);
      throw error;
    }
  },
};

export default categoryService;