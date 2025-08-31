import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

// Create instance
const API = axios.create({
  baseURL: baseURL,
});

// Interceptor to add Authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Or wherever you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
