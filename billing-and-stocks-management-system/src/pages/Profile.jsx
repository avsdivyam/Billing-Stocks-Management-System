import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiLock, FiMail, FiPhone, FiSave, FiAlertCircle, 
  FiCamera, FiEdit, FiCheck, FiX, FiShield, FiClock, 
  FiCalendar, FiFileText, FiSettings, FiImage, FiDownload,
  FiUpload, FiRefreshCw
} from 'react-icons/fi';
import { Card, Button, Input, Modal } from '../components/ui';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    company: user?.company || '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  
  // Form submission states
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  
  // Company logo state
  const [companyLogo, setCompanyLogo] = useState(user?.company_logo || null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState(null);
  
  // Invoice template state
  const [invoiceTemplate, setInvoiceTemplate] = useState('default');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  
  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  // Invoice templates
  const invoiceTemplates = [
    { id: 'default', name: 'Default Template', preview: '/templates/default.png' },
    { id: 'professional', name: 'Professional', preview: '/templates/professional.png' },
    { id: 'modern', name: 'Modern', preview: '/templates/modern.png' },
    { id: 'minimal', name: 'Minimal', preview: '/templates/minimal.png' },
    { id: 'elegant', name: 'Elegant', preview: '/templates/elegant.png' },
  ];

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === 'new_password') {
      checkPasswordStrength(value);
    }
  };
  
  // Check password strength
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    let strength = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback.push('Password should be at least 8 characters long');
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Add uppercase letters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Add lowercase letters');
    }
    
    // Number check
    if (/[0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Add numbers');
    }
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback.push('Add special characters');
    }
    
    setPasswordStrength(strength);
    setPasswordFeedback(feedback.join(', '));
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle company logo change
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyLogo(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle invoice template selection
  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };
  
  // Handle template save
  const handleTemplateSave = () => {
    setInvoiceTemplate(selectedTemplate);
    setIsTemplateModalOpen(false);
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    setProfileSuccess(false);
    setProfileError(null);

    try {
      // In a real app, you would include the profile picture in the form data
      const formData = new FormData();
      Object.keys(profileForm).forEach(key => {
        formData.append(key, profileForm[key]);
      });
      
      if (profilePicture && profilePicture instanceof File) {
        formData.append('profile_picture', profilePicture);
      }
      
      if (companyLogo && companyLogo instanceof File) {
        formData.append('company_logo', companyLogo);
      }
      
      formData.append('invoice_template', invoiceTemplate);
      
      await updateProfile(user.id, formData);
      setProfileSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (err) {
      setProfileError(err.error || 'Failed to update profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSubmitting(true);
    setPasswordSuccess(false);
    setPasswordError(null);

    // Validate password match
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError('New passwords do not match');
      setPasswordSubmitting(false);
      return;
    }
    
    // Validate password strength
    if (passwordStrength < 3) {
      setPasswordError('Password is too weak. ' + passwordFeedback);
      setPasswordSubmitting(false);
      return;
    }

    try {
      await changePassword(passwordForm.current_password, passwordForm.new_password);
      setPasswordSuccess(true);
      
      // Reset form and success message after 3 seconds
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setPasswordStrength(0);
      setPasswordFeedback('');
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      setPasswordError(err.error || 'Failed to change password');
    } finally {
      setPasswordSubmitting(false);
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
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              <p className="mt-1 text-gray-600">
                Manage your account information and security settings
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className='h-full py-10 text-center'>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow">
                  {profilePicturePreview ? (
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-500">
                      <FiUser size={48} />
                    </div>
                  )}
                  <button 
                    className="absolute bottom-10 right-20 bg-primary-500 text-white p-2 rounded-full shadow-md hover:bg-primary-600 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiCamera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </div>
                
                <h2 className="text-xl font-semibold text-center pt-4">{user?.full_name || 'User'}</h2>
                <p className="text-gray-500 text-center">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</p>
              </div>
              
              <div className="w-full border-t border-gray-200 pt-4 mt-2">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiUser className="mr-3 flex-shrink-0" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'password'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiLock className="mr-3 flex-shrink-0" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('branding')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'branding'
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <FiImage className="mr-3 flex-shrink-0" />
                    Branding & Templates
                  </button>
                </nav>
              </div>
              
              <div className="w-full border-t border-gray-200 pt-4 mt-4">
                <div className="text-sm text-gray-500">
                  <div className="flex items-center mb-2">
                    <FiClock className="mr-2 text-gray-400" />
                    <span>Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" />
                    <span>Last login {new Date(user?.last_login || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
                
                {profileSuccess && (
                  <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-md flex items-center">
                    <FiCheck className="mr-2" />
                    Profile updated successfully!
                  </div>
                )}
                
                {profileError && (
                  <div className="mb-4 p-3 bg-danger-50 text-danger-700 rounded-md flex items-center">
                    <FiAlertCircle className="mr-2" />
                    {profileError}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Username (read-only) */}
                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="username"
                            value={user?.username || ''}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                            disabled
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                      </div>
                      
                      {/* Full Name */}
                      <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={profileForm.full_name}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          />
                        </div>
                      </div>
                      
                      {/* Company */}
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={profileForm.company}
                          onChange={handleProfileChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      {/* Location */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={profileForm.location}
                          onChange={handleProfileChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Tell us a little about yourself"
                      ></textarea>
                    </div>
                    
                    {/* Role (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role & Permissions
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <div className="p-2 bg-primary-100 rounded-full text-primary-600">
                            <FiShield size={16} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Role can only be changed by an administrator
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={profileSubmitting}
                      >
                        {profileSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Branding & Templates</h2>
                
                {profileSuccess && (
                  <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-md flex items-center">
                    <FiCheck className="mr-2" />
                    Branding settings updated successfully!
                  </div>
                )}
                
                {profileError && (
                  <div className="mb-4 p-3 bg-danger-50 text-danger-700 rounded-md flex items-center">
                    <FiAlertCircle className="mr-2" />
                    {profileError}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                      <h3 className="text-base font-medium text-gray-900 mb-2">Company Branding</h3>
                      <p className="text-sm text-gray-600">
                        Your company logo and branding will be used on invoices, receipts, and throughout the application.
                      </p>
                    </div>
                    
                    {/* Company Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo
                      </label>
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="relative h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                            {companyLogoPreview ? (
                              <img 
                                src={companyLogoPreview} 
                                alt="Company Logo" 
                                className="h-24 w-24 object-contain"
                              />
                            ) : companyLogo ? (
                              <img 
                                src={companyLogo} 
                                alt="Company Logo" 
                                className="h-24 w-24 object-contain"
                              />
                            ) : (
                              <div className="h-24 w-24 flex items-center justify-center bg-gray-50 text-gray-400">
                                <FiImage size={32} />
                              </div>
                            )}
                            <button 
                              type="button"
                              className="absolute bottom-0 right-0 bg-primary-500 text-white p-1.5 rounded-full shadow-md hover:bg-primary-600 transition-colors"
                              onClick={() => logoInputRef.current.click()}
                            >
                              <FiCamera size={14} />
                            </button>
                          </div>
                          <input
                            type="file"
                            ref={logoInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleCompanyLogoChange}
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Upload your company logo. Recommended size: 200x200 pixels.
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Supported formats: JPG, PNG, SVG
                          </p>
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => logoInputRef.current.click()}
                            >
                              <FiUpload className="mr-1" />
                              Upload Logo
                            </Button>
                            {(companyLogo || companyLogoPreview) && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="ml-2 text-danger-600 border-danger-200 hover:bg-danger-50"
                                onClick={() => {
                                  setCompanyLogo(null);
                                  setCompanyLogoPreview(null);
                                }}
                              >
                                <FiX className="mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Company Information */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-3">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Name
                          </label>
                          <Input
                            id="company"
                            name="company"
                            value={profileForm.company}
                            onChange={handleProfileChange}
                            placeholder="Your Company Name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Company Address
                          </label>
                          <Input
                            id="location"
                            name="location"
                            value={profileForm.location}
                            onChange={handleProfileChange}
                            placeholder="Company Address"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Invoice Template */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-medium text-gray-900">Invoice Template</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsTemplateModalOpen(true)}
                        >
                          <FiEdit className="mr-1" />
                          Change Template
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16 bg-white rounded-md border border-gray-200 overflow-hidden">
                            <img 
                              src={invoiceTemplates.find(t => t.id === invoiceTemplate)?.preview || '/templates/default.png'} 
                              alt="Template Preview" 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium text-gray-900">
                              {invoiceTemplates.find(t => t.id === invoiceTemplate)?.name || 'Default Template'}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              This template will be used for all your invoices and receipts.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={profileSubmitting}
                      >
                        {profileSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            Save Branding Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
                
                {/* Template Selection Modal */}
                <Modal
                  isOpen={isTemplateModalOpen}
                  onClose={() => setIsTemplateModalOpen(false)}
                  title="Select Invoice Template"
                >
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {invoiceTemplates.map((template) => (
                      <div 
                        key={template.id}
                        className={`cursor-pointer rounded-md border p-2 ${
                          selectedTemplate === template.id 
                            ? 'border-primary-500 ring-2 ring-primary-200' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="aspect-w-16 aspect-h-9 mb-2">
                          <img 
                            src={template.preview} 
                            alt={template.name} 
                            className="object-cover rounded-sm"
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium">{template.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsTemplateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleTemplateSave}
                    >
                      Apply Template
                    </Button>
                  </div>
                </Modal>
              </div>
            )}
            
            {/* Password Tab */}
            {activeTab === 'password' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
                
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-success-50 text-success-700 rounded-md flex items-center">
                    <FiCheck className="mr-2" />
                    Password changed successfully!
                  </div>
                )}
                
                {passwordError && (
                  <div className="mb-4 p-3 bg-danger-50 text-danger-700 rounded-md flex items-center">
                    <FiAlertCircle className="mr-2" />
                    {passwordError}
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
                      <h3 className="text-base font-medium text-gray-900 mb-2">Change Password</h3>
                      <p className="text-sm text-gray-600">
                        Ensure your account is using a strong password to stay secure. We recommend using a password manager to generate and store unique passwords.
                      </p>
                    </div>
                    
                    {/* Current Password */}
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="current_password"
                          name="current_password"
                          value={passwordForm.current_password}
                          onChange={handlePasswordChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* New Password */}
                    <div>
                      <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="new_password"
                          name="new_password"
                          value={passwordForm.new_password}
                          onChange={handlePasswordChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          required
                          minLength="8"
                        />
                      </div>
                      
                      {/* Password strength meter */}
                      {passwordForm.new_password && (
                        <div className="mt-2">
                          <div className="flex items-center mb-1">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  passwordStrength <= 1 ? 'bg-danger-500' : 
                                  passwordStrength <= 3 ? 'bg-warning-500' : 
                                  'bg-success-500'
                                }`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              {passwordStrength <= 1 ? 'Weak' : 
                               passwordStrength <= 3 ? 'Medium' : 
                               'Strong'}
                            </span>
                          </div>
                          {passwordFeedback && (
                            <p className="text-xs text-gray-500">{passwordFeedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Confirm New Password */}
                    <div>
                      <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="confirm_password"
                          name="confirm_password"
                          value={passwordForm.confirm_password}
                          onChange={handlePasswordChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      {passwordForm.confirm_password && passwordForm.new_password !== passwordForm.confirm_password && (
                        <p className="mt-1 text-xs text-danger-500">Passwords do not match</p>
                      )}
                    </div>
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={passwordSubmitting}
                      >
                        {passwordSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
                
                {/* Additional security sections */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-factor authentication is not enabled yet.</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add additional security to your account using two-factor authentication.
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Login Sessions</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Current Session</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Windows • Chrome • {new Date().toLocaleString()}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;