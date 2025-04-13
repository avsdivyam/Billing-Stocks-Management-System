import React, { useState, useEffect } from 'react';
import { FiPrinter, FiDownload, FiCopy, FiSettings } from 'react-icons/fi';
import { Card, Button, Input, Select } from './ui';
import BarcodeDisplay from './BarcodeDisplay';

/**
 * Barcode Generator Component
 * 
 * A component for generating and printing barcodes and QR codes.
 * 
 * @param {Object} props
 * @param {string} props.initialValue - Initial value for the barcode
 * @param {string} props.initialType - Initial type of code (barcode or qrcode)
 * @param {Function} props.onGenerate - Callback when a code is generated
 */
const BarcodeGenerator = ({ 
  initialValue = '', 
  initialType = 'barcode',
  onGenerate
}) => {
  const [value, setValue] = useState(initialValue);
  const [type, setType] = useState(initialType);
  const [format, setFormat] = useState('CODE128');
  const [errorLevel, setErrorLevel] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('medium');
  const [showValue, setShowValue] = useState(true);
  const [barcodePrefix, setBarcodePrefix] = useState('');
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.barcodes) {
          // Apply settings
          if (settings.barcodes.preferredType) {
            setType(settings.barcodes.preferredType === 'both' ? 'barcode' : settings.barcodes.preferredType);
          }
          
          if (settings.barcodes.barcodeFormat) {
            setFormat(settings.barcodes.barcodeFormat);
          }
          
          if (settings.barcodes.qrCodeLevel) {
            setErrorLevel(settings.barcodes.qrCodeLevel);
          }
          
          if (settings.barcodes.barcodePrefix) {
            setBarcodePrefix(settings.barcodes.barcodePrefix);
          }
        }
      }
    } catch (error) {
      console.error('Error loading barcode settings:', error);
    }
  }, []);
  
  // Generate a random barcode value
  const generateRandom = () => {
    const randomValue = barcodePrefix + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    setValue(randomValue);
    
    if (onGenerate) {
      onGenerate({
        value: randomValue,
        type,
        format,
        errorLevel
      });
    }
  };
  
  // Handle print action
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow pop-ups to print barcodes');
      return;
    }
    
    // Create print content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcodes</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .barcode-container {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              justify-content: center;
            }
            .barcode-item {
              border: 1px dashed #ccc;
              padding: 10px;
              text-align: center;
              page-break-inside: avoid;
            }
            .barcode-value {
              font-size: 12px;
              margin-top: 5px;
            }
            @media print {
              @page {
                size: auto;
                margin: 0mm;
              }
              body {
                margin: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="barcode-container">
    `);
    
    // Add barcodes based on quantity
    for (let i = 0; i < quantity; i++) {
      const barcodeSize = size === 'small' ? 100 : size === 'medium' ? 150 : 200;
      const barcodeHeight = type === 'barcode' ? (size === 'small' ? 50 : size === 'medium' ? 80 : 100) : barcodeSize;
      
      printWindow.document.write(`
        <div class="barcode-item">
          <div class="barcode-image">
            ${getBarcodeImageHTML(barcodeSize, barcodeHeight)}
          </div>
          ${showValue ? `<div class="barcode-value">${value}</div>` : ''}
        </div>
      `);
    }
    
    printWindow.document.write(`
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };
  
  // Get HTML representation of the barcode for printing
  const getBarcodeImageHTML = (width, height) => {
    if (type === 'barcode') {
      // Simple barcode representation
      const barWidth = Math.max(1, Math.floor(width / 60));
      let html = `<svg width="${width}" height="${height}" style="background:white;">`;
      
      // Generate bars
      for (let i = 0; i < Math.floor(width / (barWidth * 2)); i++) {
        const x = i * barWidth * 2;
        const barHeight = height - 10;
        const isBlack = i % 3 !== 0;
        
        if (isBlack) {
          html += `<rect x="${x}" y="5" width="${barWidth}" height="${barHeight}" fill="black" />`;
        }
      }
      
      html += '</svg>';
      return html;
    } else {
      // Simple QR code representation
      const cellSize = Math.floor(width / 25);
      const qrSize = cellSize * 25;
      
      let html = `<svg width="${qrSize}" height="${qrSize}" style="background:white;">`;
      
      // Position detection patterns
      // Top-left
      html += `<rect x="${cellSize * 2}" y="${cellSize * 2}" width="${cellSize * 7}" height="${cellSize * 7}" fill="black" />`;
      html += `<rect x="${cellSize * 3}" y="${cellSize * 3}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white" />`;
      html += `<rect x="${cellSize * 4}" y="${cellSize * 4}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black" />`;
      
      // Top-right
      html += `<rect x="${qrSize - cellSize * 9}" y="${cellSize * 2}" width="${cellSize * 7}" height="${cellSize * 7}" fill="black" />`;
      html += `<rect x="${qrSize - cellSize * 8}" y="${cellSize * 3}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white" />`;
      html += `<rect x="${qrSize - cellSize * 7}" y="${cellSize * 4}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black" />`;
      
      // Bottom-left
      html += `<rect x="${cellSize * 2}" y="${qrSize - cellSize * 9}" width="${cellSize * 7}" height="${cellSize * 7}" fill="black" />`;
      html += `<rect x="${cellSize * 3}" y="${qrSize - cellSize * 8}" width="${cellSize * 5}" height="${cellSize * 5}" fill="white" />`;
      html += `<rect x="${cellSize * 4}" y="${qrSize - cellSize * 7}" width="${cellSize * 3}" height="${cellSize * 3}" fill="black" />`;
      
      // Generate some random "data" cells
      const randomCells = [];
      for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * 25) * cellSize;
        const y = Math.floor(Math.random() * 25) * cellSize;
        
        // Avoid drawing over the position detection patterns
        const isInCorner = (
          (x < cellSize * 10 && y < cellSize * 10) || // Top-left
          (x > qrSize - cellSize * 10 && y < cellSize * 10) || // Top-right
          (x < cellSize * 10 && y > qrSize - cellSize * 10) // Bottom-left
        );
        
        if (!isInCorner) {
          randomCells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="black" />`);
        }
      }
      
      html += randomCells.join('');
      html += '</svg>';
      return html;
    }
  };
  
  // Get dimensions based on size
  const getDimensions = () => {
    if (type === 'barcode') {
      return {
        width: size === 'small' ? 100 : size === 'medium' ? 150 : 200,
        height: size === 'small' ? 50 : size === 'medium' ? 80 : 100
      };
    } else {
      const width = size === 'small' ? 100 : size === 'medium' ? 150 : 200;
      return { width, height: width };
    }
  };
  
  return (
    <Card>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Barcode Generator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code Type
            </label>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: 'barcode', label: 'Barcode' },
                { value: 'qrcode', label: 'QR Code' }
              ]}
            />
          </div>
          
          {type === 'barcode' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barcode Format
              </label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={[
                  { value: 'CODE128', label: 'Code 128 (General purpose)' },
                  { value: 'EAN13', label: 'EAN-13 (European Article Number)' },
                  { value: 'UPC', label: 'UPC (Universal Product Code)' },
                  { value: 'CODE39', label: 'Code 39 (Alphanumeric)' },
                  { value: 'ITF', label: 'ITF (Interleaved 2 of 5)' },
                  { value: 'MSI', label: 'MSI (Modified Plessey)' }
                ]}
              />
            </div>
          )}
          
          {type === 'qrcode' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Error Correction Level
              </label>
              <Select
                value={errorLevel}
                onChange={(e) => setErrorLevel(e.target.value)}
                options={[
                  { value: 'L', label: 'Low (7% recovery)' },
                  { value: 'M', label: 'Medium (15% recovery)' },
                  { value: 'Q', label: 'Quartile (25% recovery)' },
                  { value: 'H', label: 'High (30% recovery)' }
                ]}
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <div className="flex">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter code value"
              className="flex-1"
            />
            <Button
              variant="secondary"
              className="ml-2"
              onClick={generateRandom}
            >
              Generate Random
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Size
            </label>
            <Select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' }
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="flex items-end mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showValue}
                onChange={(e) => setShowValue(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show value on barcode</span>
            </label>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex justify-center mb-4">
            {value && (
              <BarcodeDisplay
                value={value}
                type={type}
                format={format}
                errorLevel={errorLevel}
                width={getDimensions().width}
                height={getDimensions().height}
                displayValue={showValue}
              />
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="primary"
              onClick={handlePrint}
              disabled={!value}
            >
              <FiPrinter className="mr-2" />
              Print
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Copy to clipboard
                navigator.clipboard.writeText(value)
                  .then(() => alert('Value copied to clipboard'))
                  .catch(err => console.error('Failed to copy: ', err));
              }}
              disabled={!value}
            >
              <FiCopy className="mr-2" />
              Copy Value
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Navigate to settings
                window.location.href = '/settings';
              }}
            >
              <FiSettings className="mr-2" />
              Barcode Settings
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BarcodeGenerator;