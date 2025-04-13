import React, { useState, useEffect } from 'react';
import { Button, FormField } from '../ui';

const VendorForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  categories = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        contactPerson: initialData.contactPerson || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        category: initialData.category || '',
        status: initialData.status || 'active'
      });
    }
  }, [initialData]);

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
      newErrors.name = 'Vendor name is required';
    }
    
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="space-y-4">
        <FormField
          label="Vendor Name"
          name="name"
          id="vendor-name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter vendor name"
        />
        
        <FormField
          label="Contact Person"
          name="contactPerson"
          id="contact-person"
          value={formData.contactPerson}
          onChange={handleChange}
          error={errors.contactPerson}
          required
          placeholder="Enter contact person name"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Email"
            name="email"
            id="vendor-email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="Enter email address"
          />
          
          <FormField
            label="Phone"
            name="phone"
            id="vendor-phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="Enter phone number"
          />
        </div>
        
        <FormField
          label="Address"
          name="address"
          id="vendor-address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Enter address"
          textarea
          rows={3}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vendor-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="vendor-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`block w-full rounded-md shadow-sm sm:text-sm ${
                errors.category
                  ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="vendor-status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="vendor-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
        >
          {initialData ? 'Update Vendor' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;