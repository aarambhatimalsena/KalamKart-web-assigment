import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject("Session expired. Please log in again.");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
