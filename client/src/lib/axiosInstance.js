import axios from "axios";
import { supabase } from "../context/AuthContext";

// Determine API base URL based on environment
const getApiBaseURL = () => {
  // Check for environment variable first (set in Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In production (Vercel), use relative URL to same domain
  if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
    return '/api';
  }
  
  // Development: use localhost
  return "http://localhost:3001/api";
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Error getting session:", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the session
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !session) {
          // Refresh failed, sign out user
          await supabase.auth.signOut();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${session.access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        await supabase.auth.signOut();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

