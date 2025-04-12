import api from './api';

const speechService = {
  // Recognize speech from audio file
  recognizeSpeech: async (audioFile, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);
      
      // Add optional parameters
      if (options.method) formData.append('method', options.method);
      if (options.language) formData.append('language', options.language);
      if (options.translate !== undefined) formData.append('translate', options.translate);
      
      const response = await api.post('/speech/recognize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to recognize speech' };
    }
  },

  // Get supported languages for speech recognition
  getSupportedLanguages: async () => {
    try {
      const response = await api.get('/speech/languages');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to get supported languages' };
    }
  },

  // Client-side speech recognition using Web Speech API
  startBrowserSpeechRecognition: (language = 'en-US', onResult, onError) => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onError({ error: 'Speech recognition not supported in this browser' });
      return null;
    }
    
    // Create recognition instance
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Set up event handlers
    recognition.onresult = (event) => {
      const result = {
        transcript: '',
        isFinal: false,
      };
      
      // Get latest result
      for (let i = event.resultIndex; i < event.results.length; i++) {
        result.transcript += event.results[i][0].transcript;
        result.isFinal = event.results[i].isFinal;
      }
      
      onResult(result);
    };
    
    recognition.onerror = (event) => {
      onError({ error: event.error });
    };
    
    // Start recognition
    recognition.start();
    
    // Return control object
    return {
      stop: () => recognition.stop(),
      abort: () => recognition.abort(),
    };
  },
};

export default speechService;