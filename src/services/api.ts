import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this base URL to match your backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token directly from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
