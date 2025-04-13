import React, { useState, useEffect } from 'react';
import { FiPrinter, FiDownload, FiUpload, FiSearch, FiFilter, FiPlus, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import { Card, Button, Input, Select } from '../components/ui';
import BarcodeGenerator from '../components/BarcodeGenerator';
import BarcodeDisplay from '../components/BarcodeDisplay';
import BarcodeScannerButton from '../components/BarcodeScannerButton';

const BarcodeManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [barcodeSettings, setBarcodeSettings] = useState({
    preferredType: 'both',
    barcodeFormat: 'CODE128',
    qrCodeLevel: 'M',
  });
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.barcodes) {
          setBarcodeSettings({
            preferredType: settings.barcodes.preferredType || 'both',
            barcodeFormat: settings.barcodes.barcodeFormat || 'CODE128',
            qrCodeLevel: settings.barcodes.qrCodeLevel || 'M',
          });
        }
      }
    } catch (error) {
      console.error('Error loading barcode settings:', error);
    }
  }, []);
  
  // Load mock product data
  useEffect(() => {
    // In a real app, this would be an API call
    const mockProducts = Array.from({ length: 20 }).map((_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      sku: `SKU${(index + 1).toString().padStart(4, '0')}`,
      price: (Math.random() * 100 + 10).toFixed(2),
      barcode: `PROD${(index + 1).toString().padStart(8, '0')}`,
      barcodeType: index % 3 === 0 ? 'qrcode' : 'barcode',
      category: index % 4 === 0 ? 'Electronics' : index % 4 === 1 ? 'Clothing' : index % 4 === 2 ? 'Food' : 'Home',
      hasBarcode: index % 5 !== 0, // Some products don't have barcodes
    }));
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);
  
  // Handle search and filter
  useEffect(() => {
    let filtered = [...products];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filter
    if (filterType !== 'all') {
      if (filterType === 'with-barcode') {
        filtered = filtered.filter(product => product.hasBarcode);
      } else if (filterType === 'without-barcode') {
        filtered = filtered.filter(product => !product.hasBarcode);
      } else if (filterType === 'barcode-only') {
        filtered = filtered.filter(product => product.hasBarcode && product.barcodeType === 'barcode');
      } else if (filterType === 'qrcode-only') {
        filtered = filtered.filter(product => product.hasBarcode && product.barcodeType === 'qrcode');
      }
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, filterType, products]);
  
  // Handle barcode scan
  const handleScan = (result) => {
    if (result && result.data) {
      setSearchTerm(result.data);
      
      // Find product with matching barcode
      const product = products.find(p => p.barcode === result.data);
      if (product) {
        setSelectedProduct(product);
      } else {
        alert(`No product found with barcode: ${result.data}`);
      }
    }
  };
  
  // Generate barcode for a product
  const generateBarcodeForProduct = (product) => {
    // In a real app, this would call an API to update the product
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          barcode: `PROD${p.id.toString().padStart(8, '0')}`,
          barcodeType: barcodeSettings.preferredType === 'both' 
            ? (Math.random() > 0.5 ? 'barcode' : 'qrcode')
            : barcodeSettings.preferredType,
          hasBarcode: true
        };
      }
      return p;
    });
    
    setProducts(updatedProducts);
    
    // Find and select the updated product
    const updatedProduct = updatedProducts.find(p => p.id === product.id);
    setSelectedProduct(updatedProduct);
  };
  
  // Print barcodes for selected products
  const printSelectedBarcodes = () => {
    alert('This would open a print dialog with the selected product barcodes');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className='text-start'>
          <h1 className="text-2xl font-bold text-gray-800">Barcode Manager</h1>
          <p className="mt-1 text-gray-600">
            Generate, print, and manage barcodes for your products
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <BarcodeScannerButton
            onScan={handleScan}
            buttonText="Scan Product"
            variant="primary"
          />
          <Button variant="outline">
            <FiPrinter className="mr-2" />
            Print Selected
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-2">
          <Card className='h-full text-start'>
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Products' },
                      { value: 'with-barcode', label: 'With Barcode' },
                      { value: 'without-barcode', label: 'Without Barcode' },
                      { value: 'barcode-only', label: 'Barcode Only' },
                      { value: 'qrcode-only', label: 'QR Code Only' }
                    ]}
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barcode
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedProduct?.id === product.id ? 'bg-primary-50' : ''}`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.hasBarcode ? (
                            <span className="text-sm text-gray-900">{product.barcode}</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              No Barcode
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.hasBarcode && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.barcodeType === 'qrcode' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {product.barcodeType === 'qrcode' ? 'QR Code' : 'Barcode'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {product.hasBarcode ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                printSelectedBarcodes();
                              }}
                            >
                              <FiPrinter className="mr-1" />
                              Print
                            </Button>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                generateBarcodeForProduct(product);
                              }}
                            >
                              <FiPlus className="mr-1" />
                              Generate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{products.length}</span> products
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would export the data
                      alert('This would export the product barcode data');
                    }}
                  >
                    <FiDownload className="mr-1" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // In a real app, this would import data
                      alert('This would import product barcode data');
                    }}
                  >
                    <FiUpload className="mr-1" />
                    Import
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Barcode Details & Generator */}
        <div>
          {selectedProduct ? (
            <Card>
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{selectedProduct.name}</h2>
                <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
              </div>
              
              <div className="p-4">
                {selectedProduct.hasBarcode ? (
                  <div className="flex flex-col items-center">
                    <div className="mb-4">
                      <BarcodeDisplay
                        value={selectedProduct.barcode}
                        type={selectedProduct.barcodeType}
                        format={barcodeSettings.barcodeFormat}
                        errorLevel={barcodeSettings.qrCodeLevel}
                        width={150}
                        height={selectedProduct.barcodeType === 'barcode' ? 80 : 150}
                        displayValue={true}
                      />
                    </div>
                    
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Barcode:</span>
                        <span className="font-medium">{selectedProduct.barcode}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className="font-medium">{selectedProduct.barcodeType === 'qrcode' ? 'QR Code' : 'Barcode'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Format:</span>
                        <span className="font-medium">
                          {selectedProduct.barcodeType === 'qrcode' 
                            ? `QR (${barcodeSettings.qrCodeLevel})` 
                            : barcodeSettings.barcodeFormat}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 w-full flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={printSelectedBarcodes}
                      >
                        <FiPrinter className="mr-2" />
                        Print
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // In a real app, this would regenerate the barcode
                          generateBarcodeForProduct(selectedProduct);
                        }}
                      >
                        <FiRefreshCw className="mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-2">
                        <FiAlertCircle size={24} />
                      </div>
                      <h3 className="text-lg font-medium">No Barcode</h3>
                      <p className="text-sm text-gray-500">This product doesn't have a barcode yet</p>
                    </div>
                    
                    <Button
                      variant="primary"
                      onClick={() => generateBarcodeForProduct(selectedProduct)}
                    >
                      <FiPlus className="mr-2" />
                      Generate Barcode
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <BarcodeGenerator />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeManager;