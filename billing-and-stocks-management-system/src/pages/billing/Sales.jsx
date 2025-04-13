import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiDownload, FiPrinter, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { Card, Button, Input, Table, Modal, Badge, Select } from '../../components/ui';
import { ROUTES, PAYMENT_STATUS } from '../../utils/constants';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Mock API service for sales data
const fetchSales = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          invoice: 'INV-001', 
          customer: 'John Doe', 
          date: '2023-05-15', 
          amount: 1250, 
          status: 'paid',
          payment_method: 'cash'
        },
        { 
          id: 2, 
          invoice: 'INV-002', 
          customer: 'Jane Smith', 
          date: '2023-05-14', 
          amount: 850, 
          status: 'pending',
          payment_method: 'credit'
        },
        { 
          id: 3, 
          invoice: 'INV-003', 
          customer: 'Robert Johnson', 
          date: '2023-05-13', 
          amount: 2100, 
          status: 'paid',
          payment_method: 'upi'
        },
        { 
          id: 4, 
          invoice: 'INV-004', 
          customer: 'Emily Davis', 
          date: '2023-05-12', 
          amount: 1500, 
          status: 'partial',
          payment_method: 'card'
        },
        { 
          id: 5, 
          invoice: 'INV-005', 
          customer: 'Michael Wilson', 
          date: '2023-05-11', 
          amount: 3200, 
          status: 'paid',
          payment_method: 'cash'
        },
        { 
          id: 6, 
          invoice: 'INV-006', 
          customer: 'Sarah Brown', 
          date: '2023-05-10', 
          amount: 950, 
          status: 'pending',
          payment_method: 'bank_transfer'
        },
        { 
          id: 7, 
          invoice: 'INV-007', 
          customer: 'David Miller', 
          date: '2023-05-09', 
          amount: 1750, 
          status: 'paid',
          payment_method: 'upi'
        },
        { 
          id: 8, 
          invoice: 'INV-008', 
          customer: 'Jennifer Taylor', 
          date: '2023-05-08', 
          amount: 2800, 
          status: 'partial',
          payment_method: 'card'
        },
      ]);
    }, 1000);
  });
};

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // Fetch sales data
  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchSales();
        setSales(data);
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSales();
  }, []);

  // Filter sales based on search term and status
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const matchesSearch = searchTerm === '' || 
        sale.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || sale.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [sales, searchTerm, selectedStatus]);

  // Calculate total sales amount
  const totalSalesAmount = useMemo(() => {
    return filteredSales.reduce((total, sale) => total + sale.amount, 0);
  }, [filteredSales]);

  // Handle delete confirmation
  const handleDeleteClick = (sale) => {
    setSaleToDelete(sale);
    setDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDeleteConfirm = () => {
    // In a real app, you would call an API to delete the sale
    setSales(sales.filter(s => s.id !== saleToDelete.id));
    setDeleteModalOpen(false);
    setSaleToDelete(null);
  };

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
  ];

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Invoice',
      accessor: 'invoice',
      Cell: ({ row }) => (
        <Link 
          to={`${ROUTES.BILLING.SALES}/${row.original.id}`}
          className="font-medium text-primary-600 hover:text-primary-800"
        >
          {row.original.invoice}
        </Link>
      )
    },
    {
      Header: 'Customer',
      accessor: 'customer',
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: ({ value }) => format(new Date(value), 'dd MMM yyyy')
    },
    {
      Header: 'Amount',
      accessor: 'amount',
      Cell: ({ value }) => `₹${value.toLocaleString()}`
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusConfig = {
          paid: { variant: 'success', label: 'Paid' },
          pending: { variant: 'warning', label: 'Pending' },
          partial: { variant: 'info', label: 'Partial' },
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
            to={`${ROUTES.BILLING.SALES}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="View sale"
          >
            <FiEye size={16} />
          </Button>
          <Button 
            to={`${ROUTES.BILLING.EDIT_SALE}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="Edit sale"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            aria-label="Delete sale"
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
          <p className="mt-4 text-gray-600">Loading sales data...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
              <p className="mt-1 text-gray-600">
                Manage your sales and invoices
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" size="sm">
                <FiDownload className="mr-2" />
                Export
              </Button>
              <Button to={ROUTES.BILLING.NEW_SALE} variant="primary" size="sm">
                <FiPlus className="mr-2" />
                New Sale
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
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <FiDollarSign size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-800">₹{totalSalesAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-100 text-success-600">
                <FiCalendar size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-800">₹{(totalSalesAmount * 0.7).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                <FiTrendingUp size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Growth</p>
                <p className="text-2xl font-semibold text-gray-800">+12.5%</p>
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
                placeholder="Search by invoice or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="w-full md:w-1/3 flex justify-end">
              <Button variant="outline" size="md">
                <FiFilter className="mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sales table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredSales}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Sale"
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
          Are you sure you want to delete invoice <span className="font-semibold">{saleToDelete?.invoice}</span>? 
          This action cannot be undone and will remove all associated data.
        </p>
      </Modal>
    </motion.div>
  );
};

export default Sales;