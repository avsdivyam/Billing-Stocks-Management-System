import React, { useState, useRef, useEffect } from 'react';
import { FiCamera, FiX, FiZap, FiRefreshCw } from 'react-icons/fi';
import { Button } from './ui';

/**
 * Barcode Scanner Component
 * 
 * This component provides a camera-based barcode and QR code scanner
 * that can be used throughout the application.
 * 
 * @param {Object} props
 * @param {Function} props.onScan - Callback function when a code is successfully scanned
 * @param {Function} props.onClose - Callback function when the scanner is closed
 * @param {boolean} props.isOpen - Whether the scanner is open
 * @param {string} props.facingMode - Camera facing mode: 'environment', 'user', or 'auto'
 * @param {string} props.scannerType - Type of scanner: 'barcode', 'qrcode', or 'both'
 */
const BarcodeScanner = ({ 
  onScan, 
  onClose, 
  isOpen = false, 
  facingMode = 'auto',
  scannerType = 'both'
}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [currentFacingMode, setCurrentFacingMode] = useState(facingMode === 'auto' ? 'environment' : facingMode);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Load settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.barcodes) {
          // If scanner is disabled in settings, close the scanner
          if (!settings.barcodes.scannerEnabled) {
            onClose();
            return;
          }
          
          // Apply settings
          if (facingMode === 'auto') {
            setCurrentFacingMode(settings.barcodes.cameraForScanning === 'auto' 
              ? 'environment' 
              : settings.barcodes.cameraForScanning);
          }
        }
      }
    } catch (error) {
      console.error('Error loading scanner settings:', error);
    }
  }, [facingMode, onClose]);
  
  // Initialize camera when component mounts or when isOpen changes
  useEffect(() => {
    if (!isOpen) {
      // Stop the stream when the scanner is closed
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }
    
    const initCamera = async () => {
      setError(null);
      setScanning(true);
      
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: currentFacingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          
          // Start scanning after a short delay to allow camera to initialize
          setTimeout(() => {
            startScanning();
          }, 1000);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Camera access denied or not available. Please check your browser permissions.');
        setHasPermission(false);
        setScanning(false);
      }
    };
    
    initCamera();
    
    // Cleanup function
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, currentFacingMode]);
  
  // Function to start the scanning process
  const startScanning = async () => {
    if (!videoRef.current || !hasPermission) return;
    
    try {
      // In a real implementation, you would use a library like quagga.js for barcodes
      // or jsQR for QR codes to scan the video stream
      
      // For this demo, we'll simulate a successful scan after 3 seconds
      setTimeout(() => {
        // Simulate a successful scan
        const mockCode = {
          type: Math.random() > 0.5 ? 'barcode' : 'qrcode',
          data: 'PROD' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
          format: Math.random() > 0.5 ? 'CODE128' : 'QR_CODE'
        };
        
        // Play a success sound
        const audio = new Audio('/sounds/beep.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(100);
        }
        
        // Call the onScan callback
        onScan(mockCode);
        
        // In a real implementation, you would continue scanning until closed
        setScanning(false);
      }, 3000);
    } catch (err) {
      console.error('Error during scanning:', err);
      setError('Failed to scan. Please try again.');
      setScanning(false);
    }
  };
  
  // Function to toggle camera facing mode
  const toggleCamera = () => {
    const newMode = currentFacingMode === 'environment' ? 'user' : 'environment';
    setCurrentFacingMode(newMode);
    
    // Stop current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };
  
  // If the scanner is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-lg bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Scan {scannerType === 'both' ? 'Code' : scannerType === 'barcode' ? 'Barcode' : 'QR Code'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="relative">
          {/* Camera view */}
          <div className="relative bg-black aspect-video">
            {hasPermission === false && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                <FiCamera size={48} className="mb-4 text-red-500" />
                <p className="mb-2">{error || 'Camera permission denied'}</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Request Permission Again
                </Button>
              </div>
            )}
            
            {hasPermission === true && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                ></video>
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-2 border-transparent">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary-500"></div>
                  </div>
                  
                  {scanning && (
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary-500 opacity-70 transform -translate-y-1/2">
                      <div className="absolute top-0 left-0 right-0 h-full bg-primary-500 animate-scan"></div>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {hasPermission === null && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-white text-center">
                  <FiRefreshCw size={40} className="mx-auto mb-4 animate-spin" />
                  <p>Requesting camera permission...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls */}
          <div className="p-4 flex items-center justify-between">
            <div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {!error && (
                <p className="text-sm text-gray-500">
                  {scanning 
                    ? 'Position the code in the center of the screen' 
                    : hasPermission 
                      ? 'Ready to scan' 
                      : 'Waiting for camera permission'}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCamera}
                disabled={!hasPermission}
              >
                <FiRefreshCw className="mr-1" />
                Switch Camera
              </Button>
              
              {!scanning && hasPermission && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={startScanning}
                >
                  <FiZap className="mr-1" />
                  Scan Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;