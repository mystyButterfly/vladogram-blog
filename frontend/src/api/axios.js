import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const baseURL = import.meta.env.VITE_API_URL;


const API = axios.create({
  baseURL: baseURL,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
          localStorage.removeItem('access');
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
