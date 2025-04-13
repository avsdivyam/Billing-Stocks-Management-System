import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiUpload, FiCopy, FiCheck, FiX, FiSearch, FiFileText } from 'react-icons/fi';
import { Card, Button, Input } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { motion } from "framer-motion";
import jsQR from 'jsqr';

const QRScanner = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processingUpload, setProcessingUpload] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load scan history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('qrScanHistory');
    if (savedHistory) {
      try {
        setScanHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading scan history:', e);
      }
    }
  }, []);

  // Save scan history to localStorage when it changes
  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem('qrScanHistory', JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  // Start camera scanning
  const startScanning = async () => {
    setError(null);
    setScannedData(null);
    
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions and try again.');
    }
  };

  // Stop camera scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Process QR code from video stream
  const scanQRCode = () => {
    if (!scanning) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code) {
        // QR code detected
        handleScannedData(code.data);
        stopScanning();
      } else {
        // Continue scanning
        requestAnimationFrame(scanQRCode);
      }
    } else {
      requestAnimationFrame(scanQRCode);
    }
  };

  // Handle file upload for QR scanning
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setProcessingUpload(true);
    setError(null);
    setScannedData(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        
        if (code) {
          handleScannedData(code.data);
        } else {
          setError('No QR code found in the image.');
        }
        
        setProcessingUpload(false);
      };
      
      img.onerror = () => {
        setError('Invalid image file.');
        setProcessingUpload(false);
      };
      
      setUploadedImage(event.target.result);
      img.src = event.target.result;
    };
    
    reader.onerror = () => {
      setError('Error reading file.');
      setProcessingUpload(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Process scanned data and add to history
  const handleScannedData = (data) => {
    setScannedData(data);
    
    // Try to parse as JSON
    let parsedData = null;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
        console.log(e);
      // Not JSON, use as is
      parsedData = data;
    }
    
    // Add to scan history
    const newScan = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: parsedData,
      rawData: data
    };
    
    setScanHistory(prevHistory => [newScan, ...prevHistory.slice(0, 19)]);
  };

  // Copy scanned data to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Clear scan history
  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('qrScanHistory');
  };

  // Format data for display
  const formatData = (data) => {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  // Check if data is a URL
  const isURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
        console.log(e);
      return false;
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
        <Card className='f-full text-start'>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
              <p className="mt-1 text-gray-600">
                Scan QR codes from camera or image files
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(ROUTES.OCR.HISTORY)}
              >
                <FiFileText className="mr-2" />
                Scan History
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner section */}
        <motion.div variants={itemVariants}>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Scanner</h2>
            
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {scanning ? (
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover"
                    playsInline
                  ></video>
                ) : uploadedImage ? (
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiCamera size={48} className="text-gray-400" />
                  </div>
                )}
                
                {(scanning || processingUpload) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-4 border-primary-500 rounded-lg"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                )}
              </div>
              
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              <div className="flex space-x-4 mb-4">
                {!scanning ? (
                  <Button 
                    variant="primary" 
                    onClick={startScanning}
                    disabled={processingUpload}
                  >
                    <FiCamera className="mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button 
                    variant="danger" 
                    onClick={stopScanning}
                  >
                    <FiX className="mr-2" />
                    Stop Camera
                  </Button>
                )}
                
                <div className="relative">
                  <Button 
                    variant="outline"
                    disabled={scanning || processingUpload}
                  >
                    <FiUpload className="mr-2" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={scanning || processingUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              {error && (
                <div className="w-full p-3 bg-danger-50 text-danger-700 rounded-md mb-4">
                  {error}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Result section */}
        <motion.div variants={itemVariants}>
          <Card className='h-full'>
            <h2 className="text-lg font-semibold mb-4">Scan Result</h2>
            
            {scannedData ? (
              <div className=''>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-700">Scanned Data:</h3>
                  <Button 
                    variant="text" 
                    size="sm"
                    onClick={() => copyToClipboard(scannedData)}
                  >
                    {copied ? (
                      <>
                        <FiCheck className="mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200 font-mono text-sm mb-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{formatData(scannedData)}</pre>
                </div>
                
                {isURL(scannedData) && (
                  <div className="mb-4">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => window.open(scannedData, '_blank')}
                    >
                      <FiSearch className="mr-2" />
                      Open URL
                    </Button>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Scanned at: {new Date().toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg h-full flex flex-col items-center justify-center">
                <FiCamera size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  No QR code scanned yet. Use the camera or upload an image.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Scan history */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Scan History</h2>
            {scanHistory.length > 0 && (
              <Button 
                variant="text" 
                size="sm"
                onClick={clearHistory}
              >
                Clear History
              </Button>
            )}
          </div>
          
          {scanHistory.length > 0 ? (
            <div className="space-y-4">
              {scanHistory.map((scan) => (
                <div 
                  key={scan.id} 
                  className="p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-gray-700">
                      {new Date(scan.timestamp).toLocaleString()}
                    </div>
                    <Button 
                      variant="text" 
                      size="sm"
                      onClick={() => copyToClipboard(scan.rawData)}
                    >
                      <FiCopy size={14} />
                    </Button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 font-mono overflow-hidden text-ellipsis">
                    {typeof scan.data === 'object' 
                      ? JSON.stringify(scan.data).substring(0, 100) + (JSON.stringify(scan.data).length > 100 ? '...' : '')
                      : scan.data.substring(0, 100) + (scan.data.length > 100 ? '...' : '')
                    }
                  </div>
                  {isURL(scan.rawData) && (
                    <div className="mt-2">
                      <Button 
                        variant="text" 
                        size="xs"
                        onClick={() => window.open(scan.rawData, '_blank')}
                      >
                        <FiSearch className="mr-1" size={12} />
                        Open URL
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No scan history yet. Scanned QR codes will appear here.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default QRScanner;