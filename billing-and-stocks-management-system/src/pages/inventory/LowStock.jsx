import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiShoppingCart, FiFilter, FiDownload, FiRefreshCw, FiBarChart2 } from 'react-icons/fi';
import { Card, Button, Input, Table, Badge, Select } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { motion } from 'framer-motion';

// Mock API service for low stock data
const fetchLowStockItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: 'Product A', 
          sku: 'SKU001', 
          category: 'Electronics',
          currentStock: 5, 
          minStockLevel: 10,
          reorderLevel: 8,
          lastRestocked: '2023-05-10',
          supplier: 'Supplier X',
          price: 250,
          status: 'critical'
        },
        { 
          id: 2, 
          name: 'Product B', 
          sku: 'SKU002', 
          category: 'Stationery',
          currentStock: 3, 
          minStockLevel: 15,
          reorderLevel: 10,
          lastRestocked: '2023-05-12',
          supplier: 'Supplier Y',
          price: 120,
          status: 'critical'
        },
        { 
          id: 3, 
          name: 'Product C', 
          sku: 'SKU003', 
          category: 'Electronics',
          currentStock: 7, 
          minStockLevel: 10,
          reorderLevel: 8,
          lastRestocked: '2023-05-08',
          supplier: 'Supplier Z',
          price: 350,
          status: 'warning'
        },
        { 
          id: 4, 
          name: 'Product D', 
          sku: 'SKU004', 
          category: 'Groceries',
          currentStock: 4, 
          minStockLevel: 12,
          reorderLevel: 8,
          lastRestocked: '2023-05-05',
          supplier: 'Supplier X',
          price: 80,
          status: 'critical'
        },
        { 
          id: 5, 
          name: 'Product E', 
          sku: 'SKU005', 
          category: 'Electronics',
          currentStock: 9, 
          minStockLevel: 15,
          reorderLevel: 12,
          lastRestocked: '2023-05-11',
          supplier: 'Supplier Y',
          price: 420,
          status: 'warning'
        },
        { 
          id: 6, 
          name: 'Product F', 
          sku: 'SKU006', 
          category: 'Stationery',
          currentStock: 2, 
          minStockLevel: 10,
          reorderLevel: 5,
          lastRestocked: '2023-05-01',
          supplier: 'Supplier Z',
          price: 150,
          status: 'critical'
        },
        { 
          id: 7, 
          name: 'Product G', 
          sku: 'SKU007', 
          category: 'Groceries',
          currentStock: 6, 
          minStockLevel: 8,
          reorderLevel: 7,
          lastRestocked: '2023-05-09',
          supplier: 'Supplier X',
          price: 95,
          status: 'warning'
        },
      ]);
    }, 1000);
  });
};

const LowStock = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch low stock data
  useEffect(() => {
    const loadLowStockItems = async () => {
      try {
        const data = await fetchLowStockItems();
        setLowStockItems(data);
      } catch (error) {
        console.error('Error fetching low stock items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLowStockItems();
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await fetchLowStockItems();
      setLowStockItems(data);
    } catch (error) {
      console.error('Error refreshing low stock items:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter low stock items based on search term, category and status
  const filteredItems = useMemo(() => {
    return lowStockItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === '' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [lowStockItems, searchTerm, selectedCategory, selectedStatus]);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(lowStockItems.map(item => item.category))];
    return [
      { value: '', label: 'All Categories' },
      ...uniqueCategories.map(category => ({ value: category, label: category }))
    ];
  }, [lowStockItems]);

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
  ];

  // Calculate stats
  const criticalCount = useMemo(() => 
    lowStockItems.filter(item => item.status === 'critical').length, 
    [lowStockItems]
  );
  
  const warningCount = useMemo(() => 
    lowStockItems.filter(item => item.status === 'warning').length, 
    [lowStockItems]
  );
  
  const totalValue = useMemo(() => 
    lowStockItems.reduce((total, item) => total + (item.currentStock * item.price), 0), 
    [lowStockItems]
  );

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Product',
      accessor: 'name',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.name}</div>
          <div className="text-sm text-gray-500">{row.original.sku}</div>
        </div>
      )
    },
    {
      Header: 'Category',
      accessor: 'category',
    },
    {
      Header: 'Current Stock',
      accessor: 'currentStock',
      Cell: ({ value, row }) => {
        const { minStockLevel } = row.original;
        const percentage = (value / minStockLevel) * 100;
        
        return (
          <div>
            <div className="flex items-center">
              <span className="mr-2 font-medium">{value}</span>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    percentage <= 30 ? 'bg-danger-500' : 'bg-warning-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Min: {minStockLevel}
            </div>
          </div>
        );
      }
    },
    {
      Header: 'Reorder Level',
      accessor: 'reorderLevel',
    },
    {
      Header: 'Supplier',
      accessor: 'supplier',
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusConfig = {
          critical: { variant: 'danger', label: 'Critical' },
          warning: { variant: 'warning', label: 'Warning' },
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
            to={`${ROUTES.BILLING.NEW_PURCHASE}`} 
            variant="outline" 
            size="sm"
            aria-label="Create purchase order"
          >
            <FiShoppingCart size={16} />
          </Button>
          <Button 
            to={`${ROUTES.INVENTORY.PRODUCTS}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="View product details"
          >
            <FiBarChart2 size={16} />
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
          <p className="mt-4 text-gray-600">Loading inventory data...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Low Stock Items</h1>
              <p className="mt-1 text-gray-600">
                Monitor and manage inventory items that need attention
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
              <Button variant="outline" size="sm">
                <FiDownload className="mr-2" />
                Export
              </Button>
              <Button to={ROUTES.BILLING.NEW_PURCHASE} variant="primary" size="sm">
                <FiShoppingCart className="mr-2" />
                Create Purchase Order
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-danger-100 text-danger-600">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Critical Items</p>
                <p className="text-2xl font-semibold text-gray-800">{criticalCount}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                <FiAlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Warning Items</p>
                <p className="text-2xl font-semibold text-gray-800">{warningCount}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <FiShoppingCart size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                <p className="text-2xl font-semibold text-gray-800">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <Input
                id="search"
                name="search"
                placeholder="Search by product, SKU or supplier..."
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
                {categories.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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

      {/* Low stock items table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredItems}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <FiAlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No low stock items found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || selectedCategory || selectedStatus
              ? 'Try adjusting your filters to see more results.'
              : 'All your inventory items are at healthy stock levels.'}
          </p>
          {(searchTerm || selectedCategory || selectedStatus) && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedStatus('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default LowStock;