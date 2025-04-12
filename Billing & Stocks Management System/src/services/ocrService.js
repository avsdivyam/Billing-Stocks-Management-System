import api from './api';

const ocrService = {
  // Scan image for text extraction
  scanImage: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add optional parameters
      if (options.method) formData.append('method', options.method);
      if (options.scan_type) formData.append('scan_type', options.scan_type);
      if (options.language) formData.append('language', options.language);
      if (options.translate !== undefined) formData.append('translate', options.translate);
      
      const response = await api.post('/ocr/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to scan image' };
    }
  },

  // Get all OCR scans
  getAllScans: async () => {
    try {
      const response = await api.get('/ocr/scans');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get OCR scans' };
    }
  },

  // Get OCR scan by ID
  getScanById: async (scanId) => {
    try {
      const response = await api.get(`/ocr/scans/${scanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get OCR scan' };
    }
  },

  // Process image with Tesseract.js (client-side OCR)
  processWithTesseract: async (imageFile) => {
    try {
      // This function uses the Tesseract.js library for client-side OCR
      // Import is done dynamically to avoid loading the library unless needed
      const { createWorker } = await import('tesseract.js');
      
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      // Convert file to image URL
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Recognize text
      const { data } = await worker.recognize(imageUrl);
      
      // Terminate worker
      await worker.terminate();
      
      // Clean up URL
      URL.revokeObjectURL(imageUrl);
      
      return {
        raw_text: data.text,
        confidence: data.confidence,
      };
    } catch (error) {
      throw { error: 'Failed to process image with Tesseract.js' };
    }
  },
};

export default ocrService;