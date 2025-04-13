import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiTool, FiUser, FiPhone, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { Card, Button, FormField, Badge } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { repairServiceCategories, commonRepairIssues } from '../../data/electricalCategories';
import { ROUTES } from '../../utils/constants';

// Mock API service for fetching a repair job
const fetchRepairJob = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: parseInt(id), 
        customerName: 'Rajesh Kumar', 
        customerPhone: '9876543210',
        customerEmail: 'rajesh@example.com',
        customerAddress: '123 Main St, Mumbai',
        serviceType: 'Refrigerator Repair',
        deviceDetails: 'Samsung Double Door Refrigerator',
        deviceModel: 'RT42M5538BS',
        deviceSerialNumber: 'SN12345678',
        issueDescription: 'Not cooling properly, making unusual noise',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Amit Sharma',
        createdAt: '2023-06-10',
        scheduledDate: '2023-06-12',
        estimatedCost: 1200,
        notes: 'Customer mentioned the issue started 3 days ago'
      });
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

// Mock API service for creating/updating a repair job
const saveRepairJob = (jobData, isNew) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...jobData,
        id: isNew ? Math.floor(Math.random() * 1000) + 10 : jobData.id,
        createdAt: isNew ? new Date().toISOString().split('T')[0] : jobData.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      });
    }, 1500);
  });
};

const RepairJobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isNew = !id;
  
  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    serviceType: '',
    serviceCategory: '',
    deviceDetails: '',
    deviceModel: '',
    deviceSerialNumber: '',
    issueDescription: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedCost: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [suggestedIssues, setSuggestedIssues] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const techData = await fetchTechnicians();
        setTechnicians(techData);
        
        if (!isNew) {
          const jobData = await fetchRepairJob(id);
          setFormData({
            ...jobData,
            serviceCategory: getServiceCategory(jobData.serviceType),
            scheduledDate: jobData.scheduledDate || new Date().toISOString().split('T')[0]
          });
          
          // Find suggested issues based on service type
          updateSuggestedIssues(jobData.serviceType);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.showError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, isNew, toast]);
  
  // Get service category from service type
  const getServiceCategory = (serviceType) => {
    for (const category of repairServiceCategories) {
      const service = category.services.find(s => s.name === serviceType);
      if (service) {
        return category.name;
      }
    }
    return '';
  };
  
  // Update suggested issues based on service type
  const updateSuggestedIssues = (serviceType) => {
    let category = '';
    
    if (serviceType.includes('Refrigerator')) {
      category = 'Refrigerator';
    } else if (serviceType.includes('AC') || serviceType.includes('Air Conditioner')) {
      category = 'Air Conditioner';
    } else if (serviceType.includes('Washing Machine')) {
      category = 'Washing Machine';
    } else if (serviceType.includes('Inverter')) {
      category = 'Inverter';
    } else if (serviceType.includes('Geyser') || serviceType.includes('Water Heater')) {
      category = 'Water Heater/Geyser';
    }
    
    const issues = commonRepairIssues.find(item => item.category === category);
    setSuggestedIssues(issues?.issues || []);
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for service category and type
    if (name === 'serviceCategory') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        serviceType: '' // Reset service type when category changes
      }));
    } else if (name === 'serviceType') {
      const selectedService = getServiceFromType(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        estimatedCost: selectedService?.basePrice || prev.estimatedCost
      }));
      
      // Update suggested issues
      updateSuggestedIssues(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Get service object from service type
  const getServiceFromType = (serviceType) => {
    for (const category of repairServiceCategories) {
      const service = category.services.find(s => s.name === serviceType);
      if (service) {
        return service;
      }
    }
    return null;
  };
  
  // Add suggested issue to description
  const addSuggestedIssue = (issue) => {
    setFormData(prev => ({
      ...prev,
      issueDescription: prev.issueDescription ? 
        `${prev.issueDescription}\n${issue.issue}` : 
        issue.issue,
      estimatedCost: issue.estimatedCost.split('-')[0].replace(/[^\d]/g, '')
    }));
    setShowSuggestions(false);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (!formData.serviceCategory) {
      newErrors.serviceCategory = 'Service category is required';
    }
    
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    
    if (!formData.deviceDetails.trim()) {
      newErrors.deviceDetails = 'Device details are required';
    }
    
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Issue description is required';
    }
    
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign a technician';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Scheduled date is required';
    }
    
    if (!formData.estimatedCost) {
      newErrors.estimatedCost = 'Estimated cost is required';
    } else if (isNaN(formData.estimatedCost) || parseInt(formData.estimatedCost) <= 0) {
      newErrors.estimatedCost = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.showError('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const savedJob = await saveRepairJob(formData, isNew);
      toast.showSuccess(`Repair job ${isNew ? 'created' : 'updated'} successfully`);
      navigate(ROUTES.REPAIR.SERVICES);
    } catch (error) {
      console.error('Error saving repair job:', error);
      toast.showError(`Failed to ${isNew ? 'create' : 'update'} repair job`);
    } finally {
      setSubmitting(false);
    }
  };
  
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
          <p className="mt-4 text-gray-600">Loading repair job...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">
                {isNew ? 'Create New Repair Job' : 'Edit Repair Job'}
              </h1>
              <p className="mt-1 text-gray-600">
                {isNew ? 'Create a new repair service request' : 'Update repair job details'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(ROUTES.REPAIR.SERVICES)}
              >
                <FiArrowLeft className="mr-2" />
                Back to List
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Form */}
      <motion.div variants={itemVariants}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <FiUser className="inline-block mr-2" />
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Customer Name"
                    name="customerName"
                    id="customer-name"
                    value={formData.customerName}
                    onChange={handleChange}
                    error={errors.customerName}
                    required
                    placeholder="Enter customer name"
                  />
                  
                  <FormField
                    label="Phone Number"
                    name="customerPhone"
                    id="customer-phone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    error={errors.customerPhone}
                    required
                    placeholder="Enter phone number"
                    leftIcon={<FiPhone size={16} />}
                  />
                  
                  <FormField
                    label="Email Address"
                    name="customerEmail"
                    id="customer-email"
                    type="email"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    error={errors.customerEmail}
                    placeholder="Enter email address (optional)"
                  />
                  
                  <FormField
                    label="Address"
                    name="customerAddress"
                    id="customer-address"
                    value={formData.customerAddress}
                    onChange={handleChange}
                    error={errors.customerAddress}
                    placeholder="Enter address (optional)"
                  />
                </div>
              </div>
            </Card>
            
            {/* Service Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <FiTool className="inline-block mr-2" />
                  Service Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="service-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service-category"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.serviceCategory
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    >
                      <option value="">Select a category</option>
                      {repairServiceCategories.map(category => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceCategory && (
                      <p className="mt-2 text-sm text-red-600">{errors.serviceCategory}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="service-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="service-type"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                      disabled={!formData.serviceCategory}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.serviceType
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    >
                      <option value="">Select a service type</option>
                      {formData.serviceCategory && repairServiceCategories
                        .find(cat => cat.name === formData.serviceCategory)
                        ?.services.map(service => (
                          <option key={service.id} value={service.name}>
                            {service.name} (₹{service.basePrice})
                          </option>
                        ))}
                    </select>
                    {errors.serviceType && (
                      <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
                    )}
                  </div>
                  
                  <FormField
                    label="Device Details"
                    name="deviceDetails"
                    id="device-details"
                    value={formData.deviceDetails}
                    onChange={handleChange}
                    error={errors.deviceDetails}
                    required
                    placeholder="Enter device make and model"
                  />
                  
                  <FormField
                    label="Device Model Number"
                    name="deviceModel"
                    id="device-model"
                    value={formData.deviceModel}
                    onChange={handleChange}
                    error={errors.deviceModel}
                    placeholder="Enter model number (optional)"
                  />
                  
                  <FormField
                    label="Serial Number"
                    name="deviceSerialNumber"
                    id="device-serial"
                    value={formData.deviceSerialNumber}
                    onChange={handleChange}
                    error={errors.deviceSerialNumber}
                    placeholder="Enter serial number (optional)"
                  />
                  
                  <div className="md:col-span-2">
                    <div className="relative">
                      <FormField
                        label="Issue Description"
                        name="issueDescription"
                        id="issue-description"
                        value={formData.issueDescription}
                        onChange={handleChange}
                        error={errors.issueDescription}
                        required
                        placeholder="Describe the issue in detail"
                        textarea
                        rows={4}
                      />
                      
                      {suggestedIssues.length > 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className="text-sm text-primary-600 hover:text-primary-800"
                            onClick={() => setShowSuggestions(!showSuggestions)}
                          >
                            {showSuggestions ? 'Hide common issues' : 'Show common issues'}
                          </button>
                          
                          {showSuggestions && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Common Issues:</h4>
                              <div className="space-y-2">
                                {suggestedIssues.map((issue, index) => (
                                  <div key={index} className="flex justify-between items-center">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800">{issue.issue}</p>
                                      <p className="text-xs text-gray-500">{issue.solution}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <span className="text-xs text-gray-600">Est: ₹{issue.estimatedCost}</span>
                                      <button
                                        type="button"
                                        className="text-xs text-primary-600 hover:text-primary-800"
                                        onClick={() => addSuggestedIssue(issue)}
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Job Details */}
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  <FiCalendar className="inline-block mr-2" />
                  Job Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="job-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="job-status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="job-priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="job-priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="assigned-to" className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Technician <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="assigned-to"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className={`block w-full rounded-md shadow-sm sm:text-sm ${
                        errors.assignedTo
                          ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }`}
                    >
                      <option value="">Select a technician</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.name} disabled={tech.status === 'on_leave'}>
                          {tech.name} - {tech.specialization} {tech.status === 'on_leave' ? '(On Leave)' : tech.status === 'busy' ? '(Busy)' : ''}
                        </option>
                      ))}
                    </select>
                    {errors.assignedTo && (
                      <p className="mt-2 text-sm text-red-600">{errors.assignedTo}</p>
                    )}
                  </div>
                  
                  <FormField
                    label="Scheduled Date"
                    name="scheduledDate"
                    id="scheduled-date"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    error={errors.scheduledDate}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  
                  <FormField
                    label="Estimated Cost (₹)"
                    name="estimatedCost"
                    id="estimated-cost"
                    type="number"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    error={errors.estimatedCost}
                    required
                    placeholder="Enter estimated cost"
                    min="0"
                    leftIcon={<FiDollarSign size={16} />}
                  />
                  
                  <div className="md:col-span-3">
                    <FormField
                      label="Additional Notes"
                      name="notes"
                      id="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      error={errors.notes}
                      placeholder="Enter any additional notes or instructions"
                      textarea
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.REPAIR.SERVICES)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
              >
                <FiSave className="mr-2" />
                {isNew ? 'Create Repair Job' : 'Update Repair Job'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RepairJobForm;