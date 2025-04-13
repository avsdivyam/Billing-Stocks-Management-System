import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiPrinter, FiX, FiPlus, FiSearch, FiUpload, FiDownload } from 'react-icons/fi';
import { AiOutlineQrcode } from 'react-icons/ai';
import { Card, Button, Input, Select, Table, Modal } from '../../components/ui';
import { ROUTES, PAYMENT_METHODS, PAYMENT_STATUS } from '../../utils/constants';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

// Mock API service for products data
const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Product A', sku: 'SKU001', price: 250, tax: 18, stock: 45 },
        { id: 2, name: 'Product B', sku: 'SKU002', price: 120, tax: 12, stock: 32 },
        { id: 3, name: 'Product C', sku: 'SKU003', price: 350, tax: 18, stock: 18 },
        { id: 4, name: 'Product D', sku: 'SKU004', price: 80, tax: 5, stock: 56 },
        { id: 5, name: 'Product E', sku: 'SKU005', price: 420, tax: 28, stock: 12 },
      ]);
    }, 500);
  });
};

// Mock API service for customers data
const fetchCustomers = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', gstin: 'GSTIN001' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '8765432109', gstin: 'GSTIN002' },
        { id: 3, name: 'Robert Johnson', email: 'robert@example.com', phone: '7654321098', gstin: 'GSTIN003' },
      ]);
    }, 500);
  });
};

const NewSale = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productSearchModalOpen, setProductSearchModalOpen] = useState(false);
  const [customerSearchModalOpen, setCustomerSearchModalOpen] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('INV-' + Math.floor(1000 + Math.random() * 9000));
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [paymentStatus, setPaymentStatus] = useState(PAYMENT_STATUS.PENDING);
  const [notes, setNotes] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  console.log(logoFile)

  // Fetch products and customers data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, customersData] = await Promise.all([
          fetchProducts(),
          fetchCustomers()
        ]);
        setProducts(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding product to invoice
  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map(p => 
          p.id === product.id 
            ? { ...p, quantity: p.quantity + 1 } 
            : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts, 
        { 
          ...product, 
          quantity: 1,
          total: product.price,
          taxAmount: (product.price * product.tax) / 100
        }
      ]);
    }
    setProductSearchModalOpen(false);
  };

  // Handle removing product from invoice
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    
    setSelectedProducts(
      selectedProducts.map(p => {
        if (p.id === productId) {
          const newQuantity = parseInt(quantity) || 1;
          const total = p.price * newQuantity;
          const taxAmount = (total * p.tax) / 100;
          return { ...p, quantity: newQuantity, total, taxAmount };
        }
        return p;
      })
    );
  };

  // Handle customer selection
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchModalOpen(false);
  };

  // Calculate subtotal
  const subtotal = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  
  // Calculate tax total
  const taxTotal = selectedProducts.reduce((sum, product) => sum + ((product.price * product.quantity * product.tax) / 100), 0);
  
  // Calculate discount
  const discount = discountPercent > 0 
    ? (subtotal * discountPercent) / 100 
    : discountAmount;
  
  // Calculate grand total
  const grandTotal = subtotal + taxTotal - discount;

  // Generate QR code data
  const qrCodeData = JSON.stringify({
    invoice: invoiceNumber,
    date: invoiceDate,
    customer: selectedCustomer?.name || 'Walk-in Customer',
    amount: grandTotal.toFixed(2),
    items: selectedProducts.length
  });

  // Handle save invoice
  const handleSaveInvoice = () => {
    // In a real app, you would call an API to save the invoice
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate back to sales list
      navigate(ROUTES.BILLING.SALES);
    }, 1000);
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

  // Filtered products for search
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered customers for search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">New Sale</h1>
              <p className="mt-1 text-gray-600">
                Create a new sales invoice
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(ROUTES.BILLING.SALES)}
              >
                <FiX className="mr-2" />
                Cancel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQRModal(true)}
              >
                <AiOutlineQrcode className="mr-2" />
                Generate QR
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <FiPrinter className="mr-2" />
                Print
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleSaveInvoice}
                disabled={selectedProducts.length === 0}
              >
                <FiSave className="mr-2" />
                Save Invoice
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice details */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className='h-full text-center'>
            <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <Input
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Invoice Number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setCustomerSearchModalOpen(true);
                  }}
                >
                  <FiSearch className="mr-1" size={14} />
                  Search Customer
                </Button>
              </div>
              
              {selectedCustomer ? (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{selectedCustomer.name}</h3>
                      <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                      <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                    </div>
                    <Button 
                      variant="text" 
                      size="sm"
                      onClick={() => setSelectedCustomer(null)}
                    >
                      <FiX size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-center">
                  <p className="text-gray-500">No customer selected</p>
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setCustomerSearchModalOpen(true);
                    }}
                    className="mt-1"
                  >
                    <FiSearch className="mr-1" size={14} />
                    Search Customer
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Products
                </label>
                <Button 
                  variant="text" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setProductSearchModalOpen(true);
                  }}
                >
                  <FiPlus className="mr-1" size={14} />
                  Add Product
                </Button>
              </div>
              
              {selectedProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-gray-500">{product.sku}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            ₹{product.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            <Input
                              type="number"
                              min="1"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                              className="w-16 text-right"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            {product.tax}%
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            ₹{(product.price * product.quantity).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="text"
                              size="sm"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="text-danger-600 hover:text-danger-900"
                            >
                              <FiX size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 text-center">
                  <p className="text-gray-500">No products added</p>
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setProductSearchModalOpen(true);
                    }}
                    className="mt-1"
                  >
                    <FiPlus className="mr-1" size={14} />
                    Add Product
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                rows="3"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Add any notes or terms and conditions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </Card>
        </motion.div>

        {/* Invoice summary */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className='text-start'>
            <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <div className="flex items-center space-x-4">
                {logoPreview ? (
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                    <img 
                      src={logoPreview} 
                      alt="Company Logo" 
                      className="w-full h-full object-contain"
                    />
                    <button
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-sm"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                    <label className="cursor-pointer text-center p-2">
                      <FiUpload className="mx-auto text-gray-400" size={20} />
                      <span className="text-xs text-gray-500 mt-1 block">Upload Logo</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value={PAYMENT_METHODS.CASH}>Cash</option>
                    <option value={PAYMENT_METHODS.CREDIT}>Credit</option>
                    <option value={PAYMENT_METHODS.UPI}>UPI</option>
                    <option value={PAYMENT_METHODS.CARD}>Card</option>
                    <option value={PAYMENT_METHODS.BANK_TRANSFER}>Bank Transfer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                  >
                    <option value={PAYMENT_STATUS.PAID}>Paid</option>
                    <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                    <option value={PAYMENT_STATUS.PARTIAL}>Partial</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Discount</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Percentage (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => {
                      setDiscountPercent(parseFloat(e.target.value) || 0);
                      setDiscountAmount(0);
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Amount (₹)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => {
                      setDiscountAmount(parseFloat(e.target.value) || 0);
                      setDiscountPercent(0);
                    }}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">₹{taxTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium">₹{discount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-base pt-2 border-t border-gray-200">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-primary-700">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Product search modal */}
      <Modal
        isOpen={productSearchModalOpen}
        onClose={() => setProductSearchModalOpen(false)}
        title="Add Products"
        size="lg"
      >
        <div className="mb-4">
          <Input
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-gray-500">{product.sku}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    {product.stock}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddProduct(product)}
                    >
                      <FiPlus size={14} className="mr-1" />
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Customer search modal */}
      <Modal
        isOpen={customerSearchModalOpen}
        onClose={() => setCustomerSearchModalOpen(false)}
        title="Select Customer"
        size="lg"
      >
        <div className="mb-4">
          <Input
            placeholder="Search customers by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="overflow-y-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GSTIN
                </th>
                <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {customer.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{customer.phone}</div>
                      <div className="text-gray-500">{customer.email}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {customer.gstin}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-medium">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-3 py-4 text-center text-sm text-gray-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* QR Code modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Invoice QR Code"
        size="sm"
      >
        <div className="text-center p-4">
          <div className="bg-white p-4 rounded-lg inline-block mb-4">
            <QRCodeCanvas 
              value={qrCodeData} 
              size={200}
              level="H"
              includeMargin={true}
              renderAs="svg"
            />
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scan this QR code to view invoice details or make payment
          </p>
          <div className="flex justify-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowQRModal(false)}
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                // In a real app, you would implement download functionality
                alert('QR Code download functionality would be implemented here');
              }}
            >
              <FiDownload className="mr-2" />
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default NewSale;