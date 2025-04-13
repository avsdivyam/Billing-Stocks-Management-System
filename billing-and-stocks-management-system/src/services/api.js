import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Store pending requests that should be retried after token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({ 
        error: 'Network error. Please check your internet connection.' 
      });
    }
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response.status === 401 && !originalRequest._retry) {
      // If we're already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      // Clear the current session
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login?session_expired=true';
      
      // Process the queue with an error
      processQueue(new Error('Session expired'));
      isRefreshing = false;
      
      return Promise.reject({ error: 'Session expired. Please log in again.' });
    }
    
    // Handle 403 Forbidden errors
    if (error.response.status === 403) {
      return Promise.reject({ 
        error: error.response.data?.error || 'You do not have permission to perform this action.' 
      });
    }
    
    // Handle 404 Not Found errors
    if (error.response.status === 404) {
      return Promise.reject({ 
        error: error.response.data?.error || 'The requested resource was not found.' 
      });
    }
    
    // Handle 500 Server errors
    if (error.response.status >= 500) {
      return Promise.reject({ 
        error: error.response.data?.error || 'Server error. Please try again later.' 
      });
    }
    
    // Handle other errors
    return Promise.reject(
      error.response?.data || { error: 'An unexpected error occurred' }
    );
  }
);

export default api;