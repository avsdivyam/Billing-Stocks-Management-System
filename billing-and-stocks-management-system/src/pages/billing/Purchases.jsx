import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiDownload, FiShoppingBag, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Card, Button, Input, Table, Modal, Badge, Select } from '../../components/ui';
import { ROUTES, PAYMENT_STATUS } from '../../utils/constants';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Mock API service for purchases data
const fetchPurchases = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          reference: 'PO-001', 
          supplier: 'Supplier X', 
          date: '2023-05-15', 
          amount: 5250, 
          status: 'received',
          payment_status: 'paid',
          payment_method: 'bank_transfer'
        },
        { 
          id: 2, 
          reference: 'PO-002', 
          supplier: 'Supplier Y', 
          date: '2023-05-14', 
          amount: 3850, 
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'credit'
        },
        { 
          id: 3, 
          reference: 'PO-003', 
          supplier: 'Supplier Z', 
          date: '2023-05-13', 
          amount: 7100, 
          status: 'received',
          payment_status: 'paid',
          payment_method: 'bank_transfer'
        },
        { 
          id: 4, 
          reference: 'PO-004', 
          supplier: 'Supplier X', 
          date: '2023-05-12', 
          amount: 4500, 
          status: 'partial',
          payment_status: 'partial',
          payment_method: 'bank_transfer'
        },
        { 
          id: 5, 
          reference: 'PO-005', 
          supplier: 'Supplier Y', 
          date: '2023-05-11', 
          amount: 9200, 
          status: 'received',
          payment_status: 'paid',
          payment_method: 'cash'
        },
        { 
          id: 6, 
          reference: 'PO-006', 
          supplier: 'Supplier Z', 
          date: '2023-05-10', 
          amount: 2950, 
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'credit'
        },
        { 
          id: 7, 
          reference: 'PO-007', 
          supplier: 'Supplier X', 
          date: '2023-05-09', 
          amount: 6750, 
          status: 'received',
          payment_status: 'paid',
          payment_method: 'bank_transfer'
        },
        { 
          id: 8, 
          reference: 'PO-008', 
          supplier: 'Supplier Y', 
          date: '2023-05-08', 
          amount: 5800, 
          status: 'partial',
          payment_status: 'partial',
          payment_method: 'bank_transfer'
        },
      ]);
    }, 1000);
  });
};

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState(null);

  // Fetch purchases data
  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const data = await fetchPurchases();
        setPurchases(data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, []);

  // Filter purchases based on search term and status
  const filteredPurchases = useMemo(() => {
    return purchases.filter(purchase => {
      const matchesSearch = searchTerm === '' || 
        purchase.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || purchase.status === selectedStatus;
      const matchesPaymentStatus = selectedPaymentStatus === '' || purchase.payment_status === selectedPaymentStatus;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [purchases, searchTerm, selectedStatus, selectedPaymentStatus]);

  // Calculate total purchases amount
  const totalPurchasesAmount = useMemo(() => {
    return filteredPurchases.reduce((total, purchase) => total + purchase.amount, 0);
  }, [filteredPurchases]);

  // Calculate pending amount
  const pendingAmount = useMemo(() => {
    return filteredPurchases
      .filter(purchase => purchase.payment_status !== 'paid')
      .reduce((total, purchase) => total + purchase.amount, 0);
  }, [filteredPurchases]);

  // Handle delete confirmation
  const handleDeleteClick = (purchase) => {
    setPurchaseToDelete(purchase);
    setDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDeleteConfirm = () => {
    // In a real app, you would call an API to delete the purchase
    setPurchases(purchases.filter(p => p.id !== purchaseToDelete.id));
    setDeleteModalOpen(false);
    setPurchaseToDelete(null);
  };

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'received', label: 'Received' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
  ];

  // Payment status options for filter
  const paymentStatusOptions = [
    { value: '', label: 'All Payment Statuses' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
  ];

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Reference',
      accessor: 'reference',
      Cell: ({ row }) => (
        <Link 
          to={`${ROUTES.BILLING.PURCHASES}/${row.original.id}`}
          className="font-medium text-primary-600 hover:text-primary-800"
        >
          {row.original.reference}
        </Link>
      )
    },
    {
      Header: 'Supplier',
      accessor: 'supplier',
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
          received: { variant: 'success', label: 'Received' },
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
      Header: 'Payment',
      accessor: 'payment_status',
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
            to={`${ROUTES.BILLING.PURCHASES}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="View purchase"
          >
            <FiEye size={16} />
          </Button>
          <Button 
            to={`${ROUTES.BILLING.EDIT_PURCHASE}/${row.original.id}`} 
            variant="outline" 
            size="sm"
            aria-label="Edit purchase"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            aria-label="Delete purchase"
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
          <p className="mt-4 text-gray-600">Loading purchases data...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Purchases</h1>
              <p className="mt-1 text-gray-600">
                Manage your purchase orders and supplier invoices
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" size="sm">
                <FiDownload className="mr-2" />
                Export
              </Button>
              <Button to={ROUTES.BILLING.NEW_PURCHASE} variant="primary" size="sm">
                <FiPlus className="mr-2" />
                New Purchase
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
                <FiShoppingBag size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Purchases</p>
                <p className="text-2xl font-semibold text-gray-800">₹{totalPurchasesAmount.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                <FiDollarSign size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Amount</p>
                <p className="text-2xl font-semibold text-gray-800">₹{pendingAmount.toLocaleString()}</p>
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
                <p className="text-2xl font-semibold text-gray-800">₹{(totalPurchasesAmount * 0.7).toLocaleString()}</p>
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
                placeholder="Search by reference or supplier..."
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
            <div className="w-full md:w-1/3">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              >
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Purchases table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredPurchases}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Purchase"
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
          Are you sure you want to delete purchase order <span className="font-semibold">{purchaseToDelete?.reference}</span>? 
          This action cannot be undone and will remove all associated data.
        </p>
      </Modal>
    </motion.div>
  );
};

export default Purchases;