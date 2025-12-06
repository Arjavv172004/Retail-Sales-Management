import axios from 'axios';

// Try port 5001 first (common when 5000 is busy), then 5000
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Default to 5001 since backend often uses it when 5000 is busy
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for large datasets
});

// Log the API URL being used
console.log(`🔗 API Base URL: ${API_BASE_URL}`);

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused. Is the backend server running on port 5001 (or 5000)?');
      error.message = 'Cannot connect to server. Please ensure the backend is running on port 5001.';
    } else if (error.message === 'Network Error') {
      console.error('❌ Network error. Check if backend is running on port 5001 and CORS is enabled.');
      error.message = 'Network error. Please check if the backend server is running on port 5001.';
    }
    return Promise.reject(error);
  }
);

export const transactionAPI = {
  getTransactions: (params) => {
    return api.get('/transactions', { params });
  },
  
  getFilterOptions: () => {
    return api.get('/transactions/filter-options');
  },
};

export default api;

