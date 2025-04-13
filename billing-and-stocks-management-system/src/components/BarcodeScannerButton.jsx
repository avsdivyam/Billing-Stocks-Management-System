import React, { useState, useEffect } from 'react';
import { FiCamera } from 'react-icons/fi';
import { Button } from './ui';
import BarcodeScanner from './BarcodeScanner';

/**
 * Barcode Scanner Button Component
 * 
 * A button that opens a barcode scanner when clicked.
 * 
 * @param {Object} props
 * @param {Function} props.onScan - Callback function when a code is successfully scanned
 * @param {string} props.buttonText - Text to display on the button
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.scannerType - Type of scanner to use (barcode, qrcode, both)
 * @param {string} props.className - Additional CSS classes
 */
const BarcodeScannerButton = ({ 
  onScan, 
  buttonText = 'Scan Code', 
  variant = 'primary', 
  size = 'md',
  scannerType = 'both',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(true);
  
  // Check if scanner is enabled in settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.barcodes && settings.barcodes.scannerEnabled !== undefined) {
          setScannerEnabled(settings.barcodes.scannerEnabled);
        }
      }
    } catch (error) {
      console.error('Error loading scanner settings:', error);
    }
  }, []);
  
  const handleScan = (result) => {
    if (onScan) {
      onScan(result);
    }
    setIsOpen(false);
  };
  
  const handleOpen = () => {
    if (scannerEnabled) {
      setIsOpen(true);
    } else {
      alert('Scanner is disabled in settings. Please enable it in Settings > Barcodes & QR Codes.');
    }
  };
  
  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpen}
        className={className}
      >
        <FiCamera className="mr-2" />
        {buttonText}
      </Button>
      
      <BarcodeScanner
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onScan={handleScan}
        scannerType={scannerType}
      />
    </>
  );
};

export default BarcodeScannerButton;