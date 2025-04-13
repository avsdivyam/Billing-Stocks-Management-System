import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiRefreshCw, FiTool, FiFileText } from 'react-icons/fi';
import { Card, Button, Input, Table, Badge, Modal } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { repairServiceCategories } from '../../data/electricalCategories';
import { ROUTES } from '../../utils/constants';

// Mock API service for repair jobs data
const fetchRepairJobs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          customerName: 'Rajesh Kumar', 
          customerPhone: '9876543210',
          serviceType: 'Refrigerator Repair',
          deviceDetails: 'Samsung Double Door Refrigerator',
          issueDescription: 'Not cooling properly',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'Amit Sharma',
          createdAt: '2023-06-10',
          scheduledDate: '2023-06-12',
          estimatedCost: 1200
        },
        { 
          id: 2, 
          customerName: 'Priya Singh', 
          customerPhone: '9876543211',
          serviceType: 'AC Repair',
          deviceDetails: 'Voltas 1.5 Ton Split AC',
          issueDescription: 'Making unusual noise and not cooling',
          status: 'in_progress',
          priority: 'high',
          assignedTo: 'Rahul Verma',
          createdAt: '2023-06-09',
          scheduledDate: '2023-06-11',
          estimatedCost: 1800
        },
        { 
          id: 3, 
          customerName: 'Suresh Patel', 
          customerPhone: '9876543212',
          serviceType: 'Inverter Repair',
          deviceDetails: 'Luminous 1100VA Inverter',
          issueDescription: 'Not charging battery',
          status: 'completed',
          priority: 'medium',
          assignedTo: 'Vikram Mehta',
          createdAt: '2023-06-08',
          scheduledDate: '2023-06-10',
          completedDate: '2023-06-10',
          estimatedCost: 900,
          actualCost: 950
        },
        { 
          id: 4, 
          customerName: 'Anita Desai', 
          customerPhone: '9876543213',
          serviceType: 'Washing Machine Repair',
          deviceDetails: 'LG 7kg Front Load',
          issueDescription: 'Water leakage during wash cycle',
          status: 'completed',
          priority: 'medium',
          assignedTo: 'Amit Sharma',
          createdAt: '2023-06-07',
          scheduledDate: '2023-06-09',
          completedDate: '2023-06-09',
          estimatedCost: 1100,
          actualCost: 1000
        },
        { 
          id: 5, 
          customerName: 'Mohan Gupta', 
          customerPhone: '9876543214',
          serviceType: 'Geyser Repair',
          deviceDetails: 'Bajaj 15L Storage Water Heater',
          issueDescription: 'No hot water',
          status: 'pending',
          priority: 'low',
          assignedTo: 'Rahul Verma',
          createdAt: '2023-06-10',
          scheduledDate: '2023-06-13',
          estimatedCost: 700
        },
      ]);
    }, 1000);
  });
};

// Mock API service for technicians
const fetchTechnicians = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Amit Sharma', specialization: 'Refrigerator & AC', status: 'available' },
        { id: 2, name: 'Rahul Verma', specialization: 'Washing Machine & Geyser', status: 'busy' },
        { id: 3, name: 'Vikram Mehta', specialization: 'Inverter & Electronics', status: 'available' },
        { id: 4, name: 'Deepak Joshi', specialization: 'General Appliances', status: 'on_leave' },
      ]);
    }, 800);
  });
};

const RepairServices = () => {
  const [repairJobs, setRepairJobs] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  
  const toast = useToast();

  // Fetch repair jobs data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, techniciansData] = await Promise.all([
          fetchRepairJobs(),
          fetchTechnicians()
        ]);
        setRepairJobs(jobsData);
        setTechnicians(techniciansData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.showError('Failed to load repair jobs');
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
      const [jobsData, techniciansData] = await Promise.all([
        fetchRepairJobs(),
        fetchTechnicians()
      ]);
      setRepairJobs(jobsData);
      setTechnicians(techniciansData);
      toast.showSuccess('Repair jobs refreshed');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.showError('Failed to refresh repair jobs');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter repair jobs based on search term, status and priority
  const filteredJobs = useMemo(() => {
    return repairJobs.filter(job => {
      const matchesSearch = searchTerm === '' || 
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customerPhone.includes(searchTerm) ||
        job.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.deviceDetails.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === '' || job.status === selectedStatus;
      const matchesPriority = selectedPriority === '' || job.priority === selectedPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [repairJobs, searchTerm, selectedStatus, selectedPriority]);

  // Status options for filter
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Priority options for filter
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // View job details
  const viewJobDetails = (job) => {
    setCurrentJob(job);
    setIsViewModalOpen(true);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'gray';
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'gray';
    }
  };

  // Table columns configuration
  const columns = useMemo(() => [
    {
      Header: 'Customer',
      accessor: 'customerName',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.customerName}</div>
          <div className="text-sm text-gray-500">{row.original.customerPhone}</div>
        </div>
      )
    },
    {
      Header: 'Service',
      accessor: 'serviceType',
      Cell: ({ row }) => (
        <div>
          <div className="font-medium text-gray-900">{row.original.serviceType}</div>
          <div className="text-sm text-gray-500">{row.original.deviceDetails}</div>
        </div>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }) => {
        const statusLabels = {
          pending: 'Pending',
          in_progress: 'In Progress',
          completed: 'Completed',
          cancelled: 'Cancelled'
        };
        
        return (
          <Badge variant={getStatusBadgeVariant(value)} size="sm">
            {statusLabels[value] || value}
          </Badge>
        );
      }
    },
    {
      Header: 'Priority',
      accessor: 'priority',
      Cell: ({ value }) => {
        const priorityLabels = {
          high: 'High',
          medium: 'Medium',
          low: 'Low'
        };
        
        return (
          <Badge variant={getPriorityBadgeVariant(value)} size="sm">
            {priorityLabels[value] || value}
          </Badge>
        );
      }
    },
    {
      Header: 'Scheduled',
      accessor: 'scheduledDate',
      Cell: ({ value }) => (
        <span className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      Header: 'Assigned To',
      accessor: 'assignedTo',
    },
    {
      Header: 'Est. Cost',
      accessor: 'estimatedCost',
      Cell: ({ value }) => (
        <span className="text-sm font-medium">
          ₹{value.toLocaleString()}
        </span>
      )
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button 
            onClick={() => viewJobDetails(row.original)}
            variant="outline" 
            size="sm"
            aria-label="View repair job"
          >
            <FiFileText size={16} />
          </Button>
          <Button 
            to={`${ROUTES.REPAIR.SERVICES}/edit/${row.original.id}`}
            variant="outline" 
            size="sm"
            aria-label="Edit repair job"
          >
            <FiEdit2 size={16} />
          </Button>
          <Button 
            to={`${ROUTES.REPAIR.SERVICES}/invoice/${row.original.id}`}
            variant="outline" 
            size="sm"
            aria-label="Generate invoice"
            disabled={row.original.status !== 'completed'}
            className={row.original.status === 'completed' ? 'text-success-600 hover:text-success-800' : 'text-gray-400'}
          >
            <FiFileText size={16} />
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
          <p className="mt-4 text-gray-600">Loading repair jobs...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Repair Services</h1>
              <p className="mt-1 text-gray-600">
                Manage repair jobs and service requests
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
                to={`${ROUTES.REPAIR.SERVICES}/new`}
                variant="primary" 
                size="sm"
              >
                <FiPlus className="mr-2" />
                New Repair Job
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-700">Total Jobs</h3>
              <p className="mt-2 text-3xl font-bold text-gray-900">{repairJobs.length}</p>
              <div className="mt-2 text-sm text-gray-500">All repair jobs</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-700">Pending</h3>
              <p className="mt-2 text-3xl font-bold text-warning-600">
                {repairJobs.filter(job => job.status === 'pending').length}
              </p>
              <div className="mt-2 text-sm text-gray-500">Jobs awaiting service</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-700">In Progress</h3>
              <p className="mt-2 text-3xl font-bold text-primary-600">
                {repairJobs.filter(job => job.status === 'in_progress').length}
              </p>
              <div className="mt-2 text-sm text-gray-500">Jobs currently being worked on</div>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-700">Completed</h3>
              <p className="mt-2 text-3xl font-bold text-success-600">
                {repairJobs.filter(job => job.status === 'completed').length}
              </p>
              <div className="mt-2 text-sm text-gray-500">Jobs successfully completed</div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                id="search"
                name="search"
                placeholder="Search by customer, phone, or device..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<FiFilter />}
              />
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
            <div className="w-full md:w-1/4">
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Repair jobs table */}
      <motion.div variants={itemVariants}>
        <Table
          columns={columns}
          data={filteredJobs}
          sortable
          pagination
          searchable={false} // We're handling search ourselves
        />
      </motion.div>

      {/* Empty state */}
      {filteredJobs.length === 0 && (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No repair jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus || selectedPriority
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by creating a new repair job.'}
          </p>
          <div className="mt-6">
            {searchTerm || selectedStatus || selectedPriority ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedPriority('');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                to={`${ROUTES.REPAIR.SERVICES}/new`}
                variant="primary"
                size="sm"
              >
                <FiPlus className="mr-2" />
                New Repair Job
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* View Job Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Repair Job Details"
        size="lg"
      >
        {currentJob && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="mt-1 text-sm text-gray-900">{currentJob.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-900">{currentJob.customerPhone}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Service Type</p>
                    <p className="mt-1 text-sm text-gray-900">{currentJob.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Device Details</p>
                    <p className="mt-1 text-sm text-gray-900">{currentJob.deviceDetails}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Details</h3>
              <p className="text-sm text-gray-900">{currentJob.issueDescription}</p>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge 
                  variant={getStatusBadgeVariant(currentJob.status)} 
                  size="md"
                  className="mt-1"
                >
                  {currentJob.status === 'pending' ? 'Pending' : 
                   currentJob.status === 'in_progress' ? 'In Progress' : 
                   currentJob.status === 'completed' ? 'Completed' : 
                   currentJob.status === 'cancelled' ? 'Cancelled' : currentJob.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <Badge 
                  variant={getPriorityBadgeVariant(currentJob.priority)} 
                  size="md"
                  className="mt-1"
                >
                  {currentJob.priority === 'high' ? 'High' : 
                   currentJob.priority === 'medium' ? 'Medium' : 
                   currentJob.priority === 'low' ? 'Low' : currentJob.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Assigned To</p>
                <p className="mt-1 text-sm text-gray-900">{currentJob.assignedTo}</p>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Created Date</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(currentJob.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
                <p className="mt-1 text-sm text-gray-900">{new Date(currentJob.scheduledDate).toLocaleDateString()}</p>
              </div>
              {currentJob.completedDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed Date</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(currentJob.completedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Cost</p>
                <p className="mt-1 text-sm font-medium text-gray-900">₹{currentJob.estimatedCost.toLocaleString()}</p>
              </div>
              {currentJob.actualCost && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Actual Cost</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">₹{currentJob.actualCost.toLocaleString()}</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                to={`${ROUTES.REPAIR.SERVICES}/edit/${currentJob.id}`}
              >
                <FiEdit2 className="mr-2" />
                Edit
              </Button>
              {currentJob.status === 'completed' && (
                <Button
                  variant="primary"
                  to={`${ROUTES.REPAIR.SERVICES}/invoice/${currentJob.id}`}
                >
                  <FiFileText className="mr-2" />
                  View Invoice
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default RepairServices;