import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Load base URL from .env (fallback to '/api' if not set)
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const isExpired = Date.now() >= decoded.exp * 1000;

      if (isExpired) {
        localStorage.clear();
        window.dispatchEvent(new Event("force-logout")); // 🔁 no reload
        return Promise.reject("Session expired. Please log in again.");
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 error handler
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    const is401 = error.response?.status === 401;

    if (is401 && token) {
      localStorage.clear();
      window.dispatchEvent(new Event("force-logout"));
    }

    return Promise.reject(error);
  }
);

export default instance;
