import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiDownload, FiMail } from 'react-icons/fi';
import { Card, Button, Badge } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import { commonRepairParts } from '../../data/electricalCategories';
import { ROUTES } from '../../utils/constants';
import { useReactToPrint } from 'react-to-print';

// Mock API service for fetching a repair job with invoice details
const fetchRepairInvoice = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // Job details
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
        status: 'completed',
        assignedTo: 'Amit Sharma',
        createdAt: '2023-06-10',
        scheduledDate: '2023-06-12',
        completedDate: '2023-06-12',
        
        // Invoice details
        invoice: {
          invoiceNumber: 'INV-2023-1001',
          invoiceDate: '2023-06-12',
          dueDate: '2023-06-19',
          subtotal: 2100,
          taxRate: 18,
          taxAmount: 378,
          discount: 100,
          total: 2378,
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          paymentDate: '2023-06-12',
          notes: 'Warranty valid for 3 months on parts and labor',
          items: [
            {
              id: 1,
              type: 'service',
              description: 'Refrigerator Repair - Diagnosis and Service',
              quantity: 1,
              unitPrice: 500,
              amount: 500
            },
            {
              id: 2,
              type: 'part',
              description: 'Compressor Relay',
              quantity: 1,
              unitPrice: 800,
              amount: 800
            },
            {
              id: 3,
              type: 'part',
              description: 'Thermostat',
              quantity: 1,
              unitPrice: 600,
              amount: 600
            },
            {
              id: 4,
              type: 'service',
              description: 'Labor Charges',
              quantity: 1,
              unitPrice: 200,
              amount: 200
            }
          ]
        },
        
        // Shop details
        shop: {
          name: 'ElectroTech Solutions',
          address: '456 Main Road, Electronics Market, Mumbai - 400001',
          phone: '022-12345678',
          email: 'info@electrotechsolutions.com',
          website: 'www.electrotechsolutions.com',
          gstin: 'GSTIN: 27AABCU9603R1ZX'
        }
      });
    }, 1000);
  });
};

const RepairInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();
  
  // Handle print
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${invoice?.invoice.invoiceNumber}`,
    onAfterPrint: () => toast.showSuccess('Invoice printed successfully')
  });
  
  // Fetch invoice data
  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await fetchRepairInvoice(id);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.showError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };
    
    loadInvoice();
  }, [id, toast]);
  
  // Handle email invoice
  const handleEmailInvoice = () => {
    toast.showSuccess('Invoice sent to customer email');
  };
  
  // Handle download invoice
  const handleDownloadInvoice = () => {
    handlePrint();
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          <p className="mt-4 text-gray-600">Loading invoice...</p>
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
                Repair Invoice
              </h1>
              <p className="mt-1 text-gray-600">
                Invoice #{invoice.invoice.invoiceNumber}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(ROUTES.REPAIR.SERVICES)}
              >
                <FiArrowLeft className="mr-2" />
                Back to List
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handlePrint}
              >
                <FiPrinter className="mr-2" />
                Print
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownloadInvoice}
              >
                <FiDownload className="mr-2" />
                Download
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleEmailInvoice}
              >
                <FiMail className="mr-2" />
                Email to Customer
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Invoice */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="p-6" ref={invoiceRef}>
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 pb-4 border-b border-gray-200">
              {/* Shop Info */}
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">{invoice.shop.name}</h2>
                <p className="text-gray-600 mt-1">{invoice.shop.address}</p>
                <p className="text-gray-600">Phone: {invoice.shop.phone}</p>
                <p className="text-gray-600">Email: {invoice.shop.email}</p>
                <p className="text-gray-600">Website: {invoice.shop.website}</p>
                <p className="text-gray-600 font-medium mt-1">{invoice.shop.gstin}</p>
              </div>
              
              {/* Invoice Info */}
              <div className="text-right">
                <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Invoice #:</span> {invoice.invoice.invoiceNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span> {formatDate(invoice.invoice.invoiceDate)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Due Date:</span> {formatDate(invoice.invoice.dueDate)}
                </p>
                <div className="mt-2">
                  <Badge 
                    variant={invoice.invoice.paymentStatus === 'paid' ? 'success' : 'warning'} 
                    size="md"
                  >
                    {invoice.invoice.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Customer & Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Bill To:</h3>
                <p className="text-gray-800 font-medium">{invoice.customerName}</p>
                <p className="text-gray-600">{invoice.customerAddress}</p>
                <p className="text-gray-600">Phone: {invoice.customerPhone}</p>
                {invoice.customerEmail && <p className="text-gray-600">Email: {invoice.customerEmail}</p>}
              </div>
              
              {/* Service Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Service Details:</h3>
                <p className="text-gray-600">
                  <span className="font-medium">Service Type:</span> {invoice.serviceType}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Device:</span> {invoice.deviceDetails}
                </p>
                {invoice.deviceModel && (
                  <p className="text-gray-600">
                    <span className="font-medium">Model:</span> {invoice.deviceModel}
                  </p>
                )}
                {invoice.deviceSerialNumber && (
                  <p className="text-gray-600">
                    <span className="font-medium">Serial Number:</span> {invoice.deviceSerialNumber}
                  </p>
                )}
                <p className="text-gray-600">
                  <span className="font-medium">Completed Date:</span> {formatDate(invoice.completedDate)}
                </p>
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Invoice Items:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.description}</div>
                          {item.type === 'part' && (
                            <div className="text-xs text-gray-500">Part/Component</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          ₹{item.unitPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Invoice Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800 font-medium">₹{invoice.invoice.subtotal.toLocaleString()}</span>
                  </div>
                  {invoice.invoice.discount > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-gray-800 font-medium">-₹{invoice.invoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">GST ({invoice.invoice.taxRate}%):</span>
                    <span className="text-gray-800 font-medium">₹{invoice.invoice.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-800 font-bold">Total:</span>
                    <span className="text-gray-800 font-bold">₹{invoice.invoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="text-gray-800 capitalize">{invoice.invoice.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="text-gray-800">{formatDate(invoice.invoice.paymentDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Notes & Terms */}
            <div className="border-t border-gray-200 pt-6">
              {invoice.invoice.notes && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Notes:</h3>
                  <p className="text-sm text-gray-600">{invoice.invoice.notes}</p>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <p className="font-medium">Terms & Conditions:</p>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>All parts replaced carry manufacturer warranty as applicable.</li>
                  <li>Service warranty is valid for 30 days from the date of repair.</li>
                  <li>Invoice must be presented for any warranty claims.</li>
                  <li>We are not responsible for any data loss during repair.</li>
                </ol>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-600">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default RepairInvoice;