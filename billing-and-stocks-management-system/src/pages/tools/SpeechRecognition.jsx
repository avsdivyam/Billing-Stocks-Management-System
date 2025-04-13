import React, { useState, useEffect, useRef } from 'react';
import { FiMic, FiMicOff, FiCopy, FiCheck, FiSave, FiTrash2, FiFileText, FiPlay, FiPause } from 'react-icons/fi';
import { Card, Button, Input } from '../../components/ui';
import { motion } from "framer-motion";

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [savedTranscripts, setSavedTranscripts] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Load saved transcripts from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('speechTranscripts');
    if (savedItems) {
      try {
        setSavedTranscripts(JSON.parse(savedItems));
      } catch (e) {
        console.error('Error loading saved transcripts:', e);
      }
    }

    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Try using Chrome or Edge.');
    }

    return () => {
      stopListening();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Save transcripts to localStorage when they change
  useEffect(() => {
    if (savedTranscripts.length > 0) {
      localStorage.setItem('speechTranscripts', JSON.stringify(savedTranscripts));
    }
  }, [savedTranscripts]);

  // Start speech recognition
  const startListening = () => {
    setError(null);
    
    try {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prevTranscript => prevTranscript + finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        stopListening();
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.start();
      setIsListening(true);
      
      // Start recording audio
      startAudioRecording();
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Could not start speech recognition. Please check permissions and try again.');
    }
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsListening(false);
  };

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error starting audio recording:', err);
      setError('Could not access microphone. Please check permissions and try again.');
    }
  };

  // Save transcript
  const saveTranscript = () => {
    if (!transcript.trim()) return;
    
    const newTranscript = {
      id: Date.now(),
      title: editingTitle || `Transcript ${savedTranscripts.length + 1}`,
      text: transcript,
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      audioUrl: audioURL
    };
    
    setSavedTranscripts(prev => [newTranscript, ...prev]);
    setTranscript('');
    setEditingTitle('');
    setAudioURL(null);
    setRecordingTime(0);
  };

  // Delete transcript
  const deleteTranscript = (id) => {
    setSavedTranscripts(prev => prev.filter(item => item.id !== id));
    
    // If all transcripts are deleted, remove from localStorage
    if (savedTranscripts.length === 1) {
      localStorage.removeItem('speechTranscripts');
    }
  };

  // Copy transcript to clipboard
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

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Play/pause audio
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
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

  // Pulse animation for recording indicator
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
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
        <Card className='text-start'>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Speech Recognition</h1>
              <p className="mt-1 text-gray-600">
                Convert speech to text using your microphone
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {!isSupported ? (
        <motion.div variants={itemVariants}>
          <Card className="bg-danger-50 border-danger-200">
            <div className="text-center py-8">
              <FiMicOff size={48} className="mx-auto text-danger-500 mb-4" />
              <h2 className="text-xl font-semibold text-danger-700 mb-2">Speech Recognition Not Supported</h2>
              <p className="text-danger-600">
                Your browser does not support speech recognition. Please try using Google Chrome or Microsoft Edge.
              </p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Recording section */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Voice Recorder</h2>
                {isListening && (
                  <div className="flex items-center">
                    <motion.div
                      className="w-3 h-3 bg-danger-500 rounded-full mr-2"
                      variants={pulseVariants}
                      animate="pulse"
                    ></motion.div>
                    <span className="text-sm font-medium text-danger-600">Recording: {formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center mb-6">
                <Button
                  variant={isListening ? "danger" : "primary"}
                  size="lg"
                  className="rounded-full w-16 h-16 flex items-center justify-center"
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
                </Button>
              </div>
              
              {error && (
                <div className="p-3 bg-danger-50 text-danger-700 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript Title
                </label>
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  placeholder="Enter a title for this transcript"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transcript
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  rows="6"
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Start speaking or type here..."
                ></textarea>
              </div>
              
              {audioURL && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audio Recording
                  </label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAudio}
                      className="mr-2"
                    >
                      {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                    </Button>
                    <audio
                      ref={audioRef}
                      src={audioURL}
                      onEnded={handleAudioEnded}
                      className="hidden"
                    />
                    <div className="text-sm text-gray-600">
                      {formatTime(recordingTime)} recording
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTranscript('');
                    setAudioURL(null);
                    setRecordingTime(0);
                    setEditingTitle('');
                  }}
                  disabled={!transcript && !audioURL}
                >
                  <FiTrash2 className="mr-2" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(transcript)}
                  disabled={!transcript}
                >
                  {copied ? (
                    <>
                      <FiCheck className="mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <FiCopy className="mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="primary"
                  onClick={saveTranscript}
                  disabled={!transcript}
                >
                  <FiSave className="mr-2" />
                  Save
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Saved transcripts */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold mb-4">Saved Transcripts</h2>
              
              {savedTranscripts.length > 0 ? (
                <div className="space-y-4">
                  {savedTranscripts.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-4 bg-gray-50 rounded-md border border-gray-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <div className="text-xs text-gray-500 flex items-center">
                            <span className="mr-3">{new Date(item.timestamp).toLocaleString()}</span>
                            {item.duration > 0 && (
                              <span className="flex items-center">
                                <FiMic size={12} className="mr-1" />
                                {formatTime(item.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="text" 
                            size="sm"
                            onClick={() => copyToClipboard(item.text)}
                          >
                            <FiCopy size={14} />
                          </Button>
                          <Button 
                            variant="text" 
                            size="sm"
                            onClick={() => deleteTranscript(item.id)}
                            className="text-danger-600 hover:text-danger-800"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      {item.audioUrl && (
                        <div className="mb-2">
                          <audio 
                            controls 
                            src={item.audioUrl} 
                            className="w-full h-8"
                          ></audio>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {item.text}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No saved transcripts yet. Record and save your first transcript.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default SpeechRecognition;