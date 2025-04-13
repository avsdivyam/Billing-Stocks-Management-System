import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { Card, Button, Input, Table, Badge, Modal, FormField } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import CategoryForm from '../../components/inventory/CategoryForm';

// Mock API service for categories data
const fetchCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: 'Electronics', 
          description: 'Electronic devices and accessories',
          productCount: 24,
          status: 'active',
          createdAt: '2023-04-10',
          updatedAt: '2023-05-15'
        },
        { 
          id: 2, 
          name: 'Stationery', 
          description: 'Office and school supplies',
          productCount: 18,
          status: 'active',
          createdAt: '2023-04-12',
          updatedAt: '2023-05-12'
        },
        { 
          id: 3, 
          name: 'Groceries', 
          description: 'Food and household items',
          productCount: 32,
          status: 'active',
          createdAt: '2023-04-08',
          updatedAt: '2023-05-08'
        },
        { 
          id: 4, 
          name: 'Furniture', 
          description: 'Home and office furniture',
          productCount: 12,
          status: 'active',
          createdAt: '2023-04-15',
          updatedAt: '2023-05-10'
        },
        { 
          id: 5, 
          name: 'Clothing', 
          description: 'Apparel and accessories',
          productCount: 28,
          status: 'active',
          createdAt: '2023-04-20',
          updatedAt: '2023-05-05'
        },
        { 
          id: 6, 
          name: 'Toys', 
          description: 'Children toys and games',
          productCount: 15,
          status: 'inactive',
          createdAt: '2023-04-22',
          updatedAt: '2023-05-02'
        },
        { 
          id: 7, 
          name: 'Sports', 
          description: 'Sports equipment and accessories',
          productCount: 20,
          status: 'active',
          createdAt: '2023-04-25',
          updatedAt: '2023-05-01'
        },
      ]);
    }, 1000);
  });
};

// Mock API service for creating a category
const createCategory = (categoryData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000) + 8,
        ...categoryData,
        productCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }, 1000);
  });
};

// Mock API service for updating a category
const updateCategory = (id, categoryData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...categoryData,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }, 1000);
  });
};

// Mock API service for deleting a category
const deleteCategory = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const toast = useToast();

  // Fetch categories data
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.showError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
      toast.showSuccess('Categories refreshed');
    } catch (error) {
      console.error('Error refreshing categories:', error);
      toast.showError('Failed to refresh categories');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter categories based on search term and status
  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || category.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, selectedStatus]);

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Handle create category
  const handleCreateCategory = async (formData) => {
    setFormSubmitting(true);
    try {
      const newCategory = await createCategory(formData);
      setCategories(prev => [...prev, newCategory]);
      setIsCreateModalOpen(false);
      toast.showSuccess('Category created successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.showError('Failed to create category');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (formData) => {
    setFormSubmitting(true);
    try {
      const updatedCategory = await updateCategory(currentCategory.id, formData);
      setCategories(prev => 
        prev.map(cat => cat.id === currentCategory.id ? { ...cat, ...updatedCategory } : cat)
      );
      setIsEditModalOpen(false);
      toast.showSuccess('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.showError('Failed to update category');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async () => {
    setFormSubmitting(true);
    try {
      await deleteCategory(currentCategory.id);
      setCategories(prev => prev.filter(cat => cat.id !== currentCategory.id));
      setIsDeleteModalOpen(false);
      toast.showSuccess('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.showError('Failed to delete category');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Category',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.description}</div>
        </div>
      )
    },
    {
      Header: 'Products',
      accessor: 'productCount',
      Cell: ({ value }) => (
        <Badge variant="primary" size="sm">
          {value}
        </Badge>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusConfig = {
          active: { variant: 'success', label: 'Active' },
          inactive: { variant: 'gray', label: 'Inactive' },
        };
        
        const config = statusConfig[value] || { variant: 'gray', label: value };
        
        return (
          <Badge variant={config.variant} size="sm">
            {config.label}
          </Badge>
        );
      }
    },
    {
      Header: 'Last Updated',
      accessor: 'updatedAt',
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => openEditModal(row.original)}
            variant="outline" 
            size="sm"
            aria-label="Edit category"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            onClick={() => openDeleteModal(row.original)}
            variant="outline" 
            size="sm"
            aria-label="Delete category"
            className="text-danger-500 hover:text-danger-700"
          >
            <FiTrash2 size={16} />
          </Button>
        </div>
      )
    }
  ], []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <Card className='text-start'>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
              <p className="mt-1 text-gray-600">
                Manage product categories for better organization
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FiRefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <FiPlus className="mr-2" />
                Add Category
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3">
              <Input
                id="search"
                name="search"
                placeholder="Search by category name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<FiFilter />}
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Categories table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredCategories}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Empty state */}
      {filteredCategories.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating a new category.'}
          </p>
          <div className="mt-6">
            {searchTerm || selectedStatus ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <FiPlus className="mr-2" />
                Add Category
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Category"
      >
        <CategoryForm 
          onSubmit={handleCreateCategory}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={formSubmitting}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        {currentCategory && (
          <CategoryForm 
            initialData={currentCategory}
            onSubmit={handleEditCategory}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={formSubmitting}
          />
        )}
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the category "{currentCategory?.name}"? 
            This action cannot be undone.
          </p>
          <p className="mb-6 text-gray-700">
            {currentCategory?.productCount > 0 ? (
              <span className="text-danger-600 font-medium">
                Warning: This category contains {currentCategory?.productCount} products. 
                Deleting it may affect these products.
              </span>
            ) : (
              <span>This category has no products associated with it.</span>
            )}
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={formSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCategory}
              loading={formSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default Categories;