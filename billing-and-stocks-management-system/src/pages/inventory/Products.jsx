import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiDownload } from 'react-icons/fi';
import { Card, Button, Input, Table, Modal, Badge } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { motion } from 'framer-motion';

// Mock API service for products data
const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: 'Product A', 
          category: 'Electronics', 
          sku: 'ELEC-001', 
          price: 1200, 
          cost: 800, 
          stock: 45,
          status: 'active'
        },
        { 
          id: 2, 
          name: 'Product B', 
          category: 'Clothing', 
          sku: 'CLO-002', 
          price: 850, 
          cost: 500, 
          stock: 32,
          status: 'active'
        },
        { 
          id: 3, 
          name: 'Product C', 
          category: 'Electronics', 
          sku: 'ELEC-003', 
          price: 2100, 
          cost: 1500, 
          stock: 15,
          status: 'active'
        },
        { 
          id: 4, 
          name: 'Product D', 
          category: 'Home & Kitchen', 
          sku: 'HK-004', 
          price: 450, 
          cost: 300, 
          stock: 8,
          status: 'low_stock'
        },
        { 
          id: 5, 
          name: 'Product E', 
          category: 'Clothing', 
          sku: 'CLO-005', 
          price: 750, 
          cost: 450, 
          stock: 24,
          status: 'active'
        },
        { 
          id: 6, 
          name: 'Product F', 
          category: 'Electronics', 
          sku: 'ELEC-006', 
          price: 3500, 
          cost: 2800, 
          stock: 0,
          status: 'out_of_stock'
        },
        { 
          id: 7, 
          name: 'Product G', 
          category: 'Home & Kitchen', 
          sku: 'HK-007', 
          price: 650, 
          cost: 400, 
          stock: 5,
          status: 'low_stock'
        },
        { 
          id: 8, 
          name: 'Product H', 
          category: 'Clothing', 
          sku: 'CLO-008', 
          price: 950, 
          cost: 600, 
          stock: 18,
          status: 'active'
        },
      ]);
    }, 1000);
  });
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories;
  }, [products]);

  // Filter products based on search term and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Handle delete confirmation
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDeleteConfirm = () => {
    // In a real app, you would call an API to delete the product
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Product Name',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <Link 
            to={`${ROUTES.INVENTORY.PRODUCTS}/${row.original.id}`}
            className="font-medium text-primary-600 hover:text-primary-800"
          >
            {row.original.name}
          </Link>
          <p className="text-xs text-gray-500">SKU: {row.original.sku}</p>
        </div>
      )
    },
    {
      Header: 'Category',
      accessor: 'category',
    },
    {
      Header: 'Price',
      accessor: 'price',
      Cell: ({ value }) => `₹${value.toLocaleString()}`
    },
    {
      Header: 'Stock',
      accessor: 'stock',
      Cell: ({ value, row }) => {
        let badgeVariant = 'success';
        if (value <= 0) {
          badgeVariant = 'danger';
        } else if (value <= 10) {
          badgeVariant = 'warning';
        }
        
        return (
          <Badge variant={badgeVariant} size="sm">
            {value} in stock
          </Badge>
        );
      }
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusConfig = {
          active: { variant: 'success', label: 'Active' },
          low_stock: { variant: 'warning', label: 'Low Stock' },
          out_of_stock: { variant: 'danger', label: 'Out of Stock' },
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
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            to={`${ROUTES.INVENTORY.PRODUCTS}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="View product"
          >
            <FiEye size={16} />
          </Button>
          <Button 
            to={`${ROUTES.INVENTORY.PRODUCTS}/edit/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="Edit product"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            aria-label="Delete product"
            onClick={() => handleDeleteClick(row.original)}
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
          <p className="mt-4 text-gray-600">Loading products...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Products</h1>
              <p className="mt-1 text-gray-600">
                Manage your product inventory
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" size="sm">
                <FiDownload className="mr-2" />
                Export
              </Button>
              <Button to={`${ROUTES.INVENTORY.PRODUCTS}/new`} variant="primary" size="sm">
                <FiPlus className="mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                id="search"
                name="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3 flex justify-end">
              <Button variant="outline" size="md">
                <FiFilter className="mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Products table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredProducts}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete <span className="font-semibold">{productToDelete?.name}</span>? 
          This action cannot be undone.
        </p>
      </Modal>
    </motion.div>
  );
};

export default Products;