import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDownload, FiUpload, FiTrash2, FiAlertTriangle, FiCheck, FiFileText } from 'react-icons/fi';
import { Card, Button, Input, Select } from '../components/ui';
import InvoiceTemplateManager from '../components/InvoiceTemplateManager';
import { motion } from 'framer-motion';

// Mock API service for settings data
const fetchSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        general: {
          businessName: 'My Business',
          businessAddress: '123 Main Street, City, State, ZIP',
          businessPhone: '123-456-7890',
          businessEmail: 'contact@mybusiness.com',
          businessGSTIN: 'GSTIN12345678901',
          currency: 'INR',
          dateFormat: 'DD/MM/YYYY',
          timezone: 'Asia/Kolkata',
          language: 'en',
        },
        invoice: {
          invoicePrefix: 'INV-',
          nextInvoiceNumber: '1001',
          termsAndConditions: 'Standard terms and conditions apply.',
          showLogo: true,
          showQRCode: true,
          showSignature: true,
          defaultPaymentMethod: 'cash',
          defaultPaymentTerms: '15',
          selectedTemplate: 'default',
        },
        tax: {
          gstEnabled: true,
          defaultGSTRate: '18',
          gstRegistrationNumber: 'GSTIN12345678901',
          taxIdentificationNumber: 'TIN12345678',
        },
        backup: {
          autoBackupEnabled: true,
          backupFrequency: 'daily',
          backupTime: '02:00',
          backupLocation: 'local',
          retentionPeriod: '30',
        },
        notifications: {
          lowStockAlerts: true,
          lowStockThreshold: '10',
          paymentReminders: true,
          orderNotifications: true,
          emailNotifications: true,
        },
        appearance: {
          theme: 'light',
          primaryColor: '#0ea5e9',
          sidebarCollapsed: false,
          denseMode: false,
          showHelpTips: true,
        },
        barcodes: {
          preferredType: 'both', // 'barcode', 'qrcode', or 'both'
          barcodeFormat: 'CODE128', // 'CODE128', 'EAN13', 'UPC', etc.
          qrCodeLevel: 'M', // Error correction level: 'L', 'M', 'Q', 'H'
          printOnInvoice: true,
          printOnLabels: true,
          includeProductDetails: true,
          includePriceInCode: false,
          autoGenerateForNewProducts: true,
          barcodePrefix: '',
          scannerEnabled: true,
          cameraForScanning: 'auto', // 'auto', 'environment', 'user'
        }
      });
    }, 1000);
  });
};

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [restoreInProgress, setRestoreInProgress] = useState(false);

  // Fetch settings data
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load settings from localStorage first
        const savedSettings = localStorage.getItem('appSettings');
        
        if (savedSettings) {
          // If we have saved settings, use those
          setSettings(JSON.parse(savedSettings));
          setLoading(false);
        } else {
          // Otherwise fetch default settings
          const data = await fetchSettings();
          setSettings(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again.');
        
        // If there's an error, try to load default settings
        try {
          const data = await fetchSettings();
          setSettings(data);
        } catch (fallbackError) {
          console.error('Failed to load default settings:', fallbackError);
        } finally {
          setLoading(false);
        }
      }
    };

    loadSettings();
  }, []);

  // Handle settings change
  const handleChange = (section, field, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [section]: {
        ...prevSettings[section],
        [field]: value
      }
    }));
  };

  // Handle save settings
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // In a real app, you would call an API to save the settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save settings to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply sidebar collapsed setting if it was changed
      if (settings.appearance.sidebarCollapsed !== undefined) {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(settings.appearance.sidebarCollapsed));
      }
      
      // Apply theme if it was changed
      if (settings.appearance.theme !== undefined) {
        document.documentElement.classList.remove('light', 'dark');
        if (settings.appearance.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.appearance.theme === 'light') {
          document.documentElement.classList.add('light');
        } else if (settings.appearance.theme === 'system') {
          // Check system preference
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.add('light');
          }
        }
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle backup
  const handleBackup = async () => {
    setBackupInProgress(true);
    setError(null);
    
    try {
      // In a real app, you would call an API to create a backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate download
      const dummyData = JSON.stringify(settings, null, 2);
      const blob = new Blob([dummyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating backup:', error);
      setError('Failed to create backup. Please try again.');
    } finally {
      setBackupInProgress(false);
    }
  };

  // Handle restore
  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setRestoreInProgress(true);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const restoredSettings = JSON.parse(e.target.result);
        
        // In a real app, you would validate the backup file and call an API to restore
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSettings(restoredSettings);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (error) {
        console.error('Error restoring backup:', error);
        setError('Failed to restore backup. The file may be corrupted or invalid.');
      } finally {
        setRestoreInProgress(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read backup file.');
      setRestoreInProgress(false);
    };
    
    reader.readAsText(file);
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

  // Tabs configuration
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'invoice', label: 'Invoice' },
    { id: 'templates', label: 'Invoice Templates' },
    { id: 'tax', label: 'Tax' },
    { id: 'barcodes', label: 'Barcodes & QR Codes' },
    { id: 'backup', label: 'Backup & Restore' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
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
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="mt-1 text-gray-600">
                Configure your application preferences
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" />
                    Saving...
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
          
          {success && (
            <div className="mt-4 p-3 bg-success-50 text-success-700 rounded-md flex items-center">
              <FiCheck className="mr-2" />
              Settings saved successfully.
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-danger-50 text-danger-700 rounded-md flex items-center">
              <FiAlertTriangle className="mr-2" />
              {error}
            </div>
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className='h-full'>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </motion.div>

        {/* Settings content */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card>
            {/* General Settings */}
            {activeTab === 'general' && settings?.general && (
              <div>
                <h2 className="text-lg font-semibold mb-4">General Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <Input
                      value={settings.general.businessName}
                      onChange={(e) => handleChange('general', 'businessName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Email
                    </label>
                    <Input
                      type="email"
                      value={settings.general.businessEmail}
                      onChange={(e) => handleChange('general', 'businessEmail', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Phone
                    </label>
                    <Input
                      value={settings.general.businessPhone}
                      onChange={(e) => handleChange('general', 'businessPhone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GSTIN
                    </label>
                    <Input
                      value={settings.general.businessGSTIN}
                      onChange={(e) => handleChange('general', 'businessGSTIN', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address
                  </label>
                  <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    rows="3"
                    value={settings.general.businessAddress}
                    onChange={(e) => handleChange('general', 'businessAddress', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.general.currency}
                      onChange={(e) => handleChange('general', 'currency', e.target.value)}
                    >
                      <option value="INR">Indian Rupee (₹)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Format
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.general.dateFormat}
                      onChange={(e) => handleChange('general', 'dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.general.language}
                      onChange={(e) => handleChange('general', 'language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Invoice Settings */}
            {activeTab === 'invoice' && settings?.invoice && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Invoice Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Prefix
                    </label>
                    <Input
                      value={settings.invoice.invoicePrefix}
                      onChange={(e) => handleChange('invoice', 'invoicePrefix', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Next Invoice Number
                    </label>
                    <Input
                      type="number"
                      value={settings.invoice.nextInvoiceNumber}
                      onChange={(e) => handleChange('invoice', 'nextInvoiceNumber', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Payment Method
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.invoice.defaultPaymentMethod}
                      onChange={(e) => handleChange('invoice', 'defaultPaymentMethod', e.target.value)}
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit">Credit</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.invoice.defaultPaymentTerms}
                      onChange={(e) => handleChange('invoice', 'defaultPaymentTerms', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms and Conditions
                  </label>
                  <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    rows="4"
                    value={settings.invoice.termsAndConditions}
                    onChange={(e) => handleChange('invoice', 'termsAndConditions', e.target.value)}
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Template
                  </label>
                  <div className="flex items-center">
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.invoice.selectedTemplate || 'default'}
                      onChange={(e) => handleChange('invoice', 'selectedTemplate', e.target.value)}
                    >
                      <option value="default">Default Template</option>
                      <option value="modern">Modern Template</option>
                      <option value="minimal">Minimal Template</option>
                      {/* This would be populated with available templates */}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setActiveTab('templates')}
                    >
                      <FiFileText className="mr-1" />
                      Manage Templates
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a template or manage your custom templates
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      id="showLogo"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={settings.invoice.showLogo}
                      onChange={(e) => handleChange('invoice', 'showLogo', e.target.checked)}
                    />
                    <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-700">
                      Show business logo on invoices
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="showQRCode"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={settings.invoice.showQRCode}
                      onChange={(e) => handleChange('invoice', 'showQRCode', e.target.checked)}
                    />
                    <label htmlFor="showQRCode" className="ml-2 block text-sm text-gray-700">
                      Show QR code on invoices
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="showSignature"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={settings.invoice.showSignature}
                      onChange={(e) => handleChange('invoice', 'showSignature', e.target.checked)}
                    />
                    <label htmlFor="showSignature" className="ml-2 block text-sm text-gray-700">
                      Show signature on invoices
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Barcode & QR Code Settings */}
            {activeTab === 'barcodes' && settings?.barcodes && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Barcode & QR Code Settings</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Code Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                      <input
                        type="radio"
                        id="barcode-only"
                        name="preferredType"
                        value="barcode"
                        className="sr-only"
                        checked={settings.barcodes.preferredType === 'barcode'}
                        onChange={() => handleChange('barcodes', 'preferredType', 'barcode')}
                      />
                      <label
                        htmlFor="barcode-only"
                        className={`block p-4 border rounded-md cursor-pointer ${
                          settings.barcodes.preferredType === 'barcode'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="4" width="2" height="16" fill="currentColor" />
                            <rect x="6" y="4" width="1" height="16" fill="currentColor" />
                            <rect x="9" y="4" width="2" height="16" fill="currentColor" />
                            <rect x="13" y="4" width="1" height="16" fill="currentColor" />
                            <rect x="16" y="4" width="2" height="16" fill="currentColor" />
                            <rect x="20" y="4" width="2" height="16" fill="currentColor" />
                          </svg>
                          <span className="font-medium">Barcode Only</span>
                          <span className="text-xs text-gray-500 mt-1">Traditional linear barcodes</span>
                        </div>
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="radio"
                        id="qrcode-only"
                        name="preferredType"
                        value="qrcode"
                        className="sr-only"
                        checked={settings.barcodes.preferredType === 'qrcode'}
                        onChange={() => handleChange('barcodes', 'preferredType', 'qrcode')}
                      />
                      <label
                        htmlFor="qrcode-only"
                        className={`block p-4 border rounded-md cursor-pointer ${
                          settings.barcodes.preferredType === 'qrcode'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H10V10H4V4Z" fill="currentColor" />
                            <path d="M14 4H20V10H14V4Z" fill="currentColor" />
                            <path d="M4 14H10V20H4V14Z" fill="currentColor" />
                            <path d="M14 17H17V20H14V17Z" fill="currentColor" />
                            <path d="M17 14H20V17H17V14Z" fill="currentColor" />
                            <path d="M14 14H17V17H14V14Z" fill="currentColor" />
                          </svg>
                          <span className="font-medium">QR Code Only</span>
                          <span className="text-xs text-gray-500 mt-1">2D codes with more data capacity</span>
                        </div>
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="radio"
                        id="both-codes"
                        name="preferredType"
                        value="both"
                        className="sr-only"
                        checked={settings.barcodes.preferredType === 'both'}
                        onChange={() => handleChange('barcodes', 'preferredType', 'both')}
                      />
                      <label
                        htmlFor="both-codes"
                        className={`block p-4 border rounded-md cursor-pointer ${
                          settings.barcodes.preferredType === 'both'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 mb-2 flex flex-col justify-center">
                            <svg className="w-full h-6" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="2" y="0" width="2" height="12" fill="currentColor" />
                              <rect x="6" y="0" width="1" height="12" fill="currentColor" />
                              <rect x="9" y="0" width="2" height="12" fill="currentColor" />
                              <rect x="13" y="0" width="1" height="12" fill="currentColor" />
                              <rect x="16" y="0" width="2" height="12" fill="currentColor" />
                              <rect x="20" y="0" width="2" height="12" fill="currentColor" />
                            </svg>
                            <svg className="w-full h-6 mt-1" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 0H8V4H4V0Z" fill="currentColor" />
                              <path d="M16 0H20V4H16V0Z" fill="currentColor" />
                              <path d="M4 8H8V12H4V8Z" fill="currentColor" />
                              <path d="M16 8H18V10H16V8Z" fill="currentColor" />
                              <path d="M18 10H20V12H18V10Z" fill="currentColor" />
                              <path d="M16 10H18V12H16V10Z" fill="currentColor" />
                            </svg>
                          </div>
                          <span className="font-medium">Both Types</span>
                          <span className="text-xs text-gray-500 mt-1">Use both for maximum compatibility</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {(settings.barcodes.preferredType === 'barcode' || settings.barcodes.preferredType === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barcode Format
                      </label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.barcodes.barcodeFormat}
                        onChange={(e) => handleChange('barcodes', 'barcodeFormat', e.target.value)}
                      >
                        <option value="CODE128">Code 128 (General purpose)</option>
                        <option value="EAN13">EAN-13 (European Article Number)</option>
                        <option value="UPC">UPC (Universal Product Code)</option>
                        <option value="CODE39">Code 39 (Alphanumeric)</option>
                        <option value="ITF">ITF (Interleaved 2 of 5)</option>
                        <option value="MSI">MSI (Modified Plessey)</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Select the barcode format that best suits your needs
                      </p>
                    </div>
                  )}
                  
                  {(settings.barcodes.preferredType === 'qrcode' || settings.barcodes.preferredType === 'both') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        QR Code Error Correction
                      </label>
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={settings.barcodes.qrCodeLevel}
                        onChange={(e) => handleChange('barcodes', 'qrCodeLevel', e.target.value)}
                      >
                        <option value="L">Low (7% recovery)</option>
                        <option value="M">Medium (15% recovery)</option>
                        <option value="Q">Quartile (25% recovery)</option>
                        <option value="H">High (30% recovery)</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Higher levels allow QR codes to be readable even when partially damaged
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barcode Prefix
                    </label>
                    <Input
                      value={settings.barcodes.barcodePrefix}
                      onChange={(e) => handleChange('barcodes', 'barcodePrefix', e.target.value)}
                      placeholder="Optional prefix for generated codes"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Add a custom prefix to all generated barcodes (e.g., your company code)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camera for Scanning
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.barcodes.cameraForScanning}
                      onChange={(e) => handleChange('barcodes', 'cameraForScanning', e.target.value)}
                    >
                      <option value="auto">Auto (Default)</option>
                      <option value="environment">Back Camera</option>
                      <option value="user">Front Camera</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Select which camera to use when scanning codes
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="printOnInvoice" className="block text-sm font-medium text-gray-700">
                        Print on Invoices
                      </label>
                      <p className="text-xs text-gray-500">
                        Include codes on printed invoices and receipts
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="printOnInvoice"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.printOnInvoice}
                        onChange={(e) => handleChange('barcodes', 'printOnInvoice', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="printOnLabels" className="block text-sm font-medium text-gray-700">
                        Print on Product Labels
                      </label>
                      <p className="text-xs text-gray-500">
                        Generate printable labels with codes for products
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="printOnLabels"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.printOnLabels}
                        onChange={(e) => handleChange('barcodes', 'printOnLabels', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="includeProductDetails" className="block text-sm font-medium text-gray-700">
                        Include Product Details
                      </label>
                      <p className="text-xs text-gray-500">
                        Embed product name and details in QR codes
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="includeProductDetails"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.includeProductDetails}
                        onChange={(e) => handleChange('barcodes', 'includeProductDetails', e.target.checked)}
                        disabled={settings.barcodes.preferredType === 'barcode'}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="includePriceInCode" className="block text-sm font-medium text-gray-700">
                        Include Price in Code
                      </label>
                      <p className="text-xs text-gray-500">
                        Embed product price in generated codes
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="includePriceInCode"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.includePriceInCode}
                        onChange={(e) => handleChange('barcodes', 'includePriceInCode', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="autoGenerateForNewProducts" className="block text-sm font-medium text-gray-700">
                        Auto-generate for New Products
                      </label>
                      <p className="text-xs text-gray-500">
                        Automatically generate codes when adding new products
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="autoGenerateForNewProducts"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.autoGenerateForNewProducts}
                        onChange={(e) => handleChange('barcodes', 'autoGenerateForNewProducts', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="scannerEnabled" className="block text-sm font-medium text-gray-700">
                        Enable Scanner
                      </label>
                      <p className="text-xs text-gray-500">
                        Enable camera-based scanning throughout the app
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="scannerEnabled"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.barcodes.scannerEnabled}
                        onChange={(e) => handleChange('barcodes', 'scannerEnabled', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
                  <div className="flex flex-wrap gap-4">
                    {(settings.barcodes.preferredType === 'barcode' || settings.barcodes.preferredType === 'both') && (
                      <div className="bg-white p-3 rounded border border-gray-300 flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">Sample Barcode</div>
                        <div className="h-16 flex items-center justify-center">
                          <svg className="w-32 h-12" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="10" y="5" width="2" height="30" fill="black" />
                            <rect x="14" y="5" width="1" height="30" fill="black" />
                            <rect x="17" y="5" width="3" height="30" fill="black" />
                            <rect x="22" y="5" width="2" height="30" fill="black" />
                            <rect x="26" y="5" width="3" height="30" fill="black" />
                            <rect x="31" y="5" width="1" height="30" fill="black" />
                            <rect x="35" y="5" width="1" height="30" fill="black" />
                            <rect x="39" y="5" width="2" height="30" fill="black" />
                            <rect x="44" y="5" width="3" height="30" fill="black" />
                            <rect x="49" y="5" width="1" height="30" fill="black" />
                            <rect x="53" y="5" width="2" height="30" fill="black" />
                            <rect x="58" y="5" width="3" height="30" fill="black" />
                            <rect x="63" y="5" width="1" height="30" fill="black" />
                            <rect x="67" y="5" width="2" height="30" fill="black" />
                            <rect x="72" y="5" width="1" height="30" fill="black" />
                            <rect x="76" y="5" width="3" height="30" fill="black" />
                            <rect x="81" y="5" width="2" height="30" fill="black" />
                            <rect x="85" y="5" width="1" height="30" fill="black" />
                            <rect x="89" y="5" width="3" height="30" fill="black" />
                            <rect x="94" y="5" width="1" height="30" fill="black" />
                            <rect x="98" y="5" width="2" height="30" fill="black" />
                            <rect x="102" y="5" width="3" height="30" fill="black" />
                            <rect x="107" y="5" width="1" height="30" fill="black" />
                          </svg>
                        </div>
                        <div className="text-xs mt-1">123456789012</div>
                      </div>
                    )}
                    
                    {(settings.barcodes.preferredType === 'qrcode' || settings.barcodes.preferredType === 'both') && (
                      <div className="bg-white p-3 rounded border border-gray-300 flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">Sample QR Code</div>
                        <div className="h-16 w-16 flex items-center justify-center">
                          <svg viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H13V13H0V0ZM3 3H10V10H3V3Z" fill="black"/>
                            <path d="M5 5H8V8H5V5Z" fill="black"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 0H31V13H18V0ZM21 3H28V10H21V3Z" fill="black"/>
                            <path d="M23 5H26V8H23V5Z" fill="black"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 18H13V31H0V18ZM3 21H10V28H3V21Z" fill="black"/>
                            <path d="M5 23H8V26H5V23Z" fill="black"/>
                            <path d="M18 18H20V20H18V18Z" fill="black"/>
                            <path d="M20 20H22V22H20V20Z" fill="black"/>
                            <path d="M22 18H24V20H22V18Z" fill="black"/>
                            <path d="M24 20H26V22H24V20Z" fill="black"/>
                            <path d="M26 18H28V20H26V18Z" fill="black"/>
                            <path d="M28 20H30V22H28V20Z" fill="black"/>
                            <path d="M30 18H31V20H30V18Z" fill="black"/>
                            <path d="M18 22H20V24H18V22Z" fill="black"/>
                            <path d="M22 22H24V24H22V22Z" fill="black"/>
                            <path d="M26 22H28V24H26V22Z" fill="black"/>
                            <path d="M30 22H31V24H30V22Z" fill="black"/>
                            <path d="M18 24H20V26H18V24Z" fill="black"/>
                            <path d="M20 26H22V28H20V26Z" fill="black"/>
                            <path d="M18 28H20V30H18V28Z" fill="black"/>
                            <path d="M20 30H22V31H20V30Z" fill="black"/>
                            <path d="M22 28H24V30H22V28Z" fill="black"/>
                            <path d="M24 30H26V31H24V30Z" fill="black"/>
                            <path d="M26 28H28V30H26V28Z" fill="black"/>
                            <path d="M28 30H30V31H28V30Z" fill="black"/>
                            <path d="M30 28H31V30H30V28Z" fill="black"/>
                            <path d="M22 24H24V26H22V24Z" fill="black"/>
                            <path d="M24 26H26V28H24V26Z" fill="black"/>
                            <path d="M26 24H28V26H26V24Z" fill="black"/>
                            <path d="M28 26H30V28H28V26Z" fill="black"/>
                            <path d="M30 24H31V26H30V24Z" fill="black"/>
                            <path d="M14 0H16V2H14V0Z" fill="black"/>
                            <path d="M16 2H18V4H16V2Z" fill="black"/>
                            <path d="M14 4H16V6H14V4Z" fill="black"/>
                            <path d="M16 6H18V8H16V6Z" fill="black"/>
                            <path d="M14 8H16V10H14V8Z" fill="black"/>
                            <path d="M16 10H18V12H16V10Z" fill="black"/>
                            <path d="M14 12H16V14H14V12Z" fill="black"/>
                            <path d="M16 14H18V16H16V14Z" fill="black"/>
                            <path d="M14 16H16V18H14V16Z" fill="black"/>
                            <path d="M16 18H18V20H16V18Z" fill="black"/>
                            <path d="M14 20H16V22H14V20Z" fill="black"/>
                            <path d="M16 22H18V24H16V22Z" fill="black"/>
                            <path d="M14 24H16V26H14V24Z" fill="black"/>
                            <path d="M16 26H18V28H16V26Z" fill="black"/>
                            <path d="M14 28H16V30H14V28Z" fill="black"/>
                            <path d="M16 30H18V31H16V30Z" fill="black"/>
                            <path d="M0 14H2V16H0V14Z" fill="black"/>
                            <path d="M2 16H4V18H2V16Z" fill="black"/>
                            <path d="M4 14H6V16H4V14Z" fill="black"/>
                            <path d="M6 16H8V18H6V16Z" fill="black"/>
                            <path d="M8 14H10V16H8V14Z" fill="black"/>
                            <path d="M10 16H12V18H10V16Z" fill="black"/>
                            <path d="M12 14H14V16H12V14Z" fill="black"/>
                            <path d="M18 14H20V16H18V14Z" fill="black"/>
                            <path d="M20 16H22V18H20V16Z" fill="black"/>
                            <path d="M22 14H24V16H22V14Z" fill="black"/>
                            <path d="M24 16H26V18H24V16Z" fill="black"/>
                            <path d="M26 14H28V16H26V14Z" fill="black"/>
                            <path d="M28 16H30V18H28V16Z" fill="black"/>
                            <path d="M30 14H31V16H30V14Z" fill="black"/>
                          </svg>
                        </div>
                        <div className="text-xs mt-1">Product Info</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => {
                        // Reset to defaults
                        setSettings(prevSettings => ({
                          ...prevSettings,
                          barcodes: {
                            preferredType: 'both',
                            barcodeFormat: 'CODE128',
                            qrCodeLevel: 'M',
                            printOnInvoice: true,
                            printOnLabels: true,
                            includeProductDetails: true,
                            includePriceInCode: false,
                            autoGenerateForNewProducts: true,
                            barcodePrefix: '',
                            scannerEnabled: true,
                            cameraForScanning: 'auto',
                          }
                        }));
                      }}
                    >
                      Reset to Defaults
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Test scanner functionality
                        alert('Scanner test functionality would open here');
                      }}
                    >
                      Test Scanner
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invoice Templates */}
            {activeTab === 'templates' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Invoice Templates</h2>
                <p className="text-gray-600 mb-6">
                  Customize your invoice templates or create new ones. These templates will be used for all invoices and receipts.
                </p>
                
                <InvoiceTemplateManager 
                  onTemplateChange={(template) => {
                    // Update the selected template in settings
                    if (template) {
                      handleChange('invoice', 'selectedTemplate', template.id);
                    }
                  }}
                />
              </div>
            )}
            
            {/* Tax Settings */}
            {activeTab === 'tax' && settings?.tax && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Tax Settings</h2>
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <input
                      id="gstEnabled"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={settings.tax.gstEnabled}
                      onChange={(e) => handleChange('tax', 'gstEnabled', e.target.checked)}
                    />
                    <label htmlFor="gstEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable GST
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default GST Rate (%)
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.tax.defaultGSTRate}
                      onChange={(e) => handleChange('tax', 'defaultGSTRate', e.target.value)}
                      disabled={!settings.tax.gstEnabled}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Registration Number
                    </label>
                    <Input
                      value={settings.tax.gstRegistrationNumber}
                      onChange={(e) => handleChange('tax', 'gstRegistrationNumber', e.target.value)}
                      disabled={!settings.tax.gstEnabled}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Identification Number
                    </label>
                    <Input
                      value={settings.tax.taxIdentificationNumber}
                      onChange={(e) => handleChange('tax', 'taxIdentificationNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Restore Settings */}
            {activeTab === 'backup' && settings?.backup && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Backup & Restore</h2>
                
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <input
                      id="autoBackupEnabled"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={settings.backup.autoBackupEnabled}
                      onChange={(e) => handleChange('backup', 'autoBackupEnabled', e.target.checked)}
                    />
                    <label htmlFor="autoBackupEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable automatic backups
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Frequency
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.backup.backupFrequency}
                      onChange={(e) => handleChange('backup', 'backupFrequency', e.target.value)}
                      disabled={!settings.backup.autoBackupEnabled}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Time
                    </label>
                    <Input
                      type="time"
                      value={settings.backup.backupTime}
                      onChange={(e) => handleChange('backup', 'backupTime', e.target.value)}
                      disabled={!settings.backup.autoBackupEnabled}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Backup Location
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.backup.backupLocation}
                      onChange={(e) => handleChange('backup', 'backupLocation', e.target.value)}
                      disabled={!settings.backup.autoBackupEnabled}
                    >
                      <option value="local">Local Storage</option>
                      <option value="cloud">Cloud Storage</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retention Period (days)
                    </label>
                    <Input
                      type="number"
                      value={settings.backup.retentionPeriod}
                      onChange={(e) => handleChange('backup', 'retentionPeriod', e.target.value)}
                      disabled={!settings.backup.autoBackupEnabled}
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Manual Backup & Restore</h3>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <Button
                      variant="primary"
                      onClick={handleBackup}
                      disabled={backupInProgress}
                    >
                      {backupInProgress ? (
                        <>
                          <FiRefreshCw className="mr-2 animate-spin" />
                          Creating Backup...
                        </>
                      ) : (
                        <>
                          <FiDownload className="mr-2" />
                          Create Backup
                        </>
                      )}
                    </Button>
                    
                    <div className="relative">
                      <Button
                        variant="outline"
                        disabled={restoreInProgress}
                      >
                        {restoreInProgress ? (
                          <>
                            <FiRefreshCw className="mr-2 animate-spin" />
                            Restoring...
                          </>
                        ) : (
                          <>
                            <FiUpload className="mr-2" />
                            Restore Backup
                          </>
                        )}
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleRestore}
                        disabled={restoreInProgress}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-500">
                    <FiAlertTriangle className="inline-block mr-1 text-warning-500" />
                    Restoring a backup will overwrite your current data. Make sure to create a backup first.
                  </p>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && settings?.notifications && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="lowStockAlerts" className="block text-sm font-medium text-gray-700">
                        Low Stock Alerts
                      </label>
                      <p className="text-xs text-gray-500">
                        Get notified when inventory items fall below threshold
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="lowStockAlerts"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.notifications.lowStockAlerts}
                        onChange={(e) => handleChange('notifications', 'lowStockAlerts', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="paymentReminders" className="block text-sm font-medium text-gray-700">
                        Payment Reminders
                      </label>
                      <p className="text-xs text-gray-500">
                        Get notified about pending payments
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="paymentReminders"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.notifications.paymentReminders}
                        onChange={(e) => handleChange('notifications', 'paymentReminders', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="orderNotifications" className="block text-sm font-medium text-gray-700">
                        Order Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Get notified about new orders and status changes
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="orderNotifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.notifications.orderNotifications}
                        onChange={(e) => handleChange('notifications', 'orderNotifications', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="emailNotifications" className="block text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-xs text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="emailNotifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <Input
                      type="number"
                      value={settings.notifications.lowStockThreshold}
                      onChange={(e) => handleChange('notifications', 'lowStockThreshold', e.target.value)}
                      disabled={!settings.notifications.lowStockAlerts}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum quantity before triggering low stock alert
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && settings?.appearance && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Appearance Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theme
                    </label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      value={settings.appearance.theme}
                      onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primary Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                        className="h-10 w-10 rounded-md border-gray-300 mr-2"
                      />
                      <Input
                        value={settings.appearance.primaryColor}
                        onChange={(e) => handleChange('appearance', 'primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="sidebarCollapsed" className="block text-sm font-medium text-gray-700">
                        Collapsed Sidebar
                      </label>
                      <p className="text-xs text-gray-500">
                        Show sidebar in collapsed mode by default
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="sidebarCollapsed"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.appearance.sidebarCollapsed}
                        onChange={(e) => handleChange('appearance', 'sidebarCollapsed', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="denseMode" className="block text-sm font-medium text-gray-700">
                        Dense Mode
                      </label>
                      <p className="text-xs text-gray-500">
                        Reduce spacing for a more compact layout
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="denseMode"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.appearance.denseMode}
                        onChange={(e) => handleChange('appearance', 'denseMode', e.target.checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="showHelpTips" className="block text-sm font-medium text-gray-700">
                        Show Help Tips
                      </label>
                      <p className="text-xs text-gray-500">
                        Display helpful tooltips throughout the application
                      </p>
                    </div>
                    <div className="flex items-center h-6">
                      <input
                        id="showHelpTips"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={settings.appearance.showHelpTips}
                        onChange={(e) => handleChange('appearance', 'showHelpTips', e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Preview</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-8 h-8 rounded-full" 
                        style={{ backgroundColor: settings.appearance.primaryColor }}
                      ></div>
                      <div>
                        <div className="font-medium">Primary Color</div>
                        <div className="text-xs text-gray-500">{settings.appearance.primaryColor}</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button 
                        className="px-3 py-1 text-sm font-medium rounded-md text-white"
                        style={{ backgroundColor: settings.appearance.primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-3 py-1 text-sm font-medium rounded-md border"
                        style={{ 
                          borderColor: settings.appearance.primaryColor,
                          color: settings.appearance.primaryColor
                        }}
                      >
                        Outline Button
                      </button>
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

export default Settings;