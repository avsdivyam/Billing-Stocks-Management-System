import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiRefreshCw, FiTag } from 'react-icons/fi';
import { Card, Button, Input, Table, Badge, Modal, FormField } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import VendorForm from '../../components/vendors/VendorForm';
import VendorCategoryModal from '../../components/vendors/VendorCategoryModal';

// Mock API service for vendors data
const fetchVendors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: 'Supplier X', 
          contactPerson: 'John Doe',
          email: 'john@supplierx.com',
          phone: '+91 9876543210',
          address: '123 Main St, Mumbai',
          category: 'Electronics',
          status: 'active',
          createdAt: '2023-04-10',
          updatedAt: '2023-05-15'
        },
        { 
          id: 2, 
          name: 'Supplier Y', 
          contactPerson: 'Jane Smith',
          email: 'jane@suppliery.com',
          phone: '+91 9876543211',
          address: '456 Market St, Delhi',
          category: 'Stationery',
          status: 'active',
          createdAt: '2023-04-12',
          updatedAt: '2023-05-12'
        },
        { 
          id: 3, 
          name: 'Supplier Z', 
          contactPerson: 'Mike Johnson',
          email: 'mike@supplierz.com',
          phone: '+91 9876543212',
          address: '789 Park Ave, Bangalore',
          category: 'Groceries',
          status: 'active',
          createdAt: '2023-04-08',
          updatedAt: '2023-05-08'
        },
        { 
          id: 4, 
          name: 'Furniture Depot', 
          contactPerson: 'Sarah Williams',
          email: 'sarah@furnituredepot.com',
          phone: '+91 9876543213',
          address: '101 Wood St, Chennai',
          category: 'Furniture',
          status: 'inactive',
          createdAt: '2023-04-15',
          updatedAt: '2023-05-10'
        },
        { 
          id: 5, 
          name: 'Fashion Hub', 
          contactPerson: 'David Brown',
          email: 'david@fashionhub.com',
          phone: '+91 9876543214',
          address: '202 Style Ave, Hyderabad',
          category: 'Clothing',
          status: 'active',
          createdAt: '2023-04-20',
          updatedAt: '2023-05-05'
        },
      ]);
    }, 1000);
  });
};

// Mock API service for vendor categories
const fetchVendorCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', vendorCount: 3 },
        { id: 2, name: 'Stationery', description: 'Office and school supplies', vendorCount: 2 },
        { id: 3, name: 'Groceries', description: 'Food and household items', vendorCount: 1 },
        { id: 4, name: 'Furniture', description: 'Home and office furniture', vendorCount: 1 },
        { id: 5, name: 'Clothing', description: 'Apparel and accessories', vendorCount: 1 },
      ]);
    }, 800);
  });
};

// Mock API service for creating a vendor
const createVendor = (vendorData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000) + 6,
        ...vendorData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }, 1000);
  });
};

// Mock API service for updating a vendor
const updateVendor = (id, vendorData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...vendorData,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }, 1000);
  });
};

// Mock API service for deleting a vendor
const deleteVendor = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

// Mock API service for creating a vendor category
const createVendorCategory = (categoryData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000) + 6,
        ...categoryData,
        vendorCount: 0
      });
    }, 1000);
  });
};

// Mock API service for updating a vendor category
const updateVendorCategory = (id, categoryData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...categoryData
      });
    }, 1000);
  });
};

// Mock API service for deleting a vendor category
const deleteVendorCategory = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1000);
  });
};

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const toast = useToast();

  // Fetch vendors and categories data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [vendorsData, categoriesData] = await Promise.all([
          fetchVendors(),
          fetchVendorCategories()
        ]);
        setVendors(vendorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [vendorsData, categoriesData] = await Promise.all([
        fetchVendors(),
        fetchVendorCategories()
      ]);
      setVendors(vendorsData);
      setCategories(categoriesData);
      toast.showSuccess('Data refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.showError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter vendors based on search term, category and status
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = searchTerm === '' || 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || vendor.category === selectedCategory;
      const matchesStatus = selectedStatus === '' || vendor.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [vendors, searchTerm, selectedCategory, selectedStatus]);

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  // Category options for filter
  const categoryOptions = useMemo(() => {
    return [
      { value: '', label: 'All Categories' },
      ...categories.map(category => ({ value: category.name, label: category.name }))
    ];
  }, [categories]);

  // Handle create vendor
  const handleCreateVendor = async (formData) => {
    setFormSubmitting(true);
    try {
      const newVendor = await createVendor(formData);
      setVendors(prev => [...prev, newVendor]);
      setIsCreateModalOpen(false);
      toast.showSuccess('Vendor created successfully');
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast.showError('Failed to create vendor');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle edit vendor
  const handleEditVendor = async (formData) => {
    setFormSubmitting(true);
    try {
      const updatedVendor = await updateVendor(currentVendor.id, formData);
      setVendors(prev => 
        prev.map(vendor => vendor.id === currentVendor.id ? { ...vendor, ...updatedVendor } : vendor)
      );
      setIsEditModalOpen(false);
      toast.showSuccess('Vendor updated successfully');
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast.showError('Failed to update vendor');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle delete vendor
  const handleDeleteVendor = async () => {
    setFormSubmitting(true);
    try {
      await deleteVendor(currentVendor.id);
      setVendors(prev => prev.filter(vendor => vendor.id !== currentVendor.id));
      setIsDeleteModalOpen(false);
      toast.showSuccess('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.showError('Failed to delete vendor');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle create category
  const handleCreateCategory = async (formData) => {
    setFormSubmitting(true);
    try {
      const newCategory = await createVendorCategory(formData);
      setCategories(prev => [...prev, newCategory]);
      toast.showSuccess('Category created successfully');
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      toast.showError('Failed to create category');
      return false;
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle edit category
  const handleEditCategory = async (id, formData) => {
    setFormSubmitting(true);
    try {
      const updatedCategory = await updateVendorCategory(id, formData);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, ...updatedCategory } : cat)
      );
      toast.showSuccess('Category updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.showError('Failed to update category');
      return false;
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    setFormSubmitting(true);
    try {
      await deleteVendorCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.showSuccess('Category deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.showError('Failed to delete category');
      return false;
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open edit modal
  const openEditModal = (vendor) => {
    setCurrentVendor(vendor);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (vendor) => {
    setCurrentVendor(vendor);
    setIsDeleteModalOpen(true);
  };

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Vendor',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.contactPerson}</div>
        </div>
      )
    },
    {
      Header: 'Contact',
      accessor: 'email',
      Cell: ({ row }) => (
        <div>
          <div className="text-sm text-gray-900">{row.original.email}</div>
          <div className="text-sm text-gray-500">{row.original.phone}</div>
        </div>
      )
    },
    {
      Header: 'Category',
      accessor: 'category',
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
            aria-label="Edit vendor"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            onClick={() => openDeleteModal(row.original)}
            variant="outline" 
            size="sm"
            aria-label="Delete vendor"
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
          <p className="mt-4 text-gray-600">Loading vendors...</p>
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
        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Vendors</h1>
              <p className="mt-1 text-gray-600">
                Manage your suppliers and vendor relationships
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
                variant="outline" 
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                <FiTag className="mr-2" />
                Manage Categories
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <FiPlus className="mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                id="search"
                name="search"
                placeholder="Search by name, contact person, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<FiFilter />}
              />
            </div>
            <div className="w-full md:w-1/4">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/4">
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

      {/* Vendors table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredVendors}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Empty state */}
      {filteredVendors.length === 0 && (
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory || selectedStatus
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating a new vendor.'}
          </p>
          <div className="mt-6">
            {searchTerm || selectedCategory || selectedStatus ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
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
                Add Vendor
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Create Vendor Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Vendor"
      >
        <VendorForm 
          onSubmit={handleCreateVendor}
          onCancel={() => setIsCreateModalOpen(false)}
          isSubmitting={formSubmitting}
          categories={categories}
        />
      </Modal>

      {/* Edit Vendor Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Vendor"
      >
        {currentVendor && (
          <VendorForm 
            initialData={currentVendor}
            onSubmit={handleEditVendor}
            onCancel={() => setIsEditModalOpen(false)}
            isSubmitting={formSubmitting}
            categories={categories}
          />
        )}
      </Modal>

      {/* Delete Vendor Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Vendor"
      >
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the vendor "{currentVendor?.name}"? 
            This action cannot be undone.
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
              onClick={handleDeleteVendor}
              loading={formSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Vendor Categories Modal */}
      <VendorCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        isSubmitting={formSubmitting}
      />
    </motion.div>
  );
};

export default Vendors;