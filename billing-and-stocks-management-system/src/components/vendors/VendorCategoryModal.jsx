import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Modal, Button, FormField, Badge } from '../ui';

const VendorCategoryModal = ({
  isOpen,
  onClose,
  categories = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isSubmitting = false
}) => {
  const [mode, setMode] = useState('list'); // list, create, edit
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Reset form when modal is opened/closed
  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setErrors({});
    setMode('list');
    setCurrentCategory(null);
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.name.length > 50) {
      newErrors.name = 'Category name must be less than 50 characters';
    }
    
    if (formData.description.length > 200) {
      newErrors.description = 'Description must be less than 200 characters';
    }
    
    // Check for duplicate category name (only in create mode)
    if (mode === 'create' && categories.some(cat => cat.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'A category with this name already exists';
    }
    
    // Check for duplicate category name (in edit mode, excluding current category)
    if (mode === 'edit' && categories.some(cat => 
      cat.id !== currentCategory.id && 
      cat.name.toLowerCase() === formData.name.toLowerCase()
    )) {
      newErrors.name = 'A category with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await onCreateCategory(formData);
    if (success) {
      resetForm();
    }
  };

  // Handle edit category
  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await onUpdateCategory(currentCategory.id, formData);
    if (success) {
      resetForm();
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      const success = await onDeleteCategory(category.id);
      if (success) {
        resetForm();
      }
    }
  };

  // Start edit mode
  const startEditMode = (category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setMode('edit');
  };

  // Render category list
  const renderCategoryList = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Vendor Categories</h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setMode('create')}
        >
          <FiPlus className="mr-2" />
          Add Category
        </Button>
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No categories found. Create your first category.</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendors
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-gray-500">{category.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="primary" size="sm">
                      {category.vendorCount || 0}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => startEditMode(category)}
                      >
                        <FiEdit2 size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-danger-500 hover:text-danger-700"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={category.vendorCount > 0}
                        title={category.vendorCount > 0 ? "Cannot delete category with vendors" : "Delete category"}
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <Button
          variant="outline"
          onClick={handleClose}
        >
          Close
        </Button>
      </div>
    </div>
  );

  // Render category form
  const renderCategoryForm = () => (
    <form onSubmit={mode === 'create' ? handleCreateCategory : handleEditCategory} className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {mode === 'create' ? 'Add New Category' : 'Edit Category'}
      </h3>
      
      <div className="space-y-4">
        <FormField
          label="Category Name"
          name="name"
          id="category-name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter category name"
          maxLength={50}
        />
        
        <FormField
          label="Description"
          name="description"
          id="category-description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter category description"
          maxLength={200}
          textarea
          rows={3}
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setMode('list')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {mode === 'create' ? 'Create Category' : 'Update Category'}
        </Button>
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Vendor Categories"
      size="lg"
    >
      {mode === 'list' ? renderCategoryList() : renderCategoryForm()}
    </Modal>
  );
};

export default VendorCategoryModal;