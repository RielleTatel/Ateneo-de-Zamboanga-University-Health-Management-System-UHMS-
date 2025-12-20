import axios from "axios";
import { supabase } from "./supabaseClient";  

const getApiBaseURL = () => {

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
    return '/api';
  }
  
  return "http://localhost:3001/api";
};

const axiosInstance = axios.create({
  baseURL: getApiBaseURL(),
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {

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

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !session) {

          await supabase.auth.signOut();
          window.location.href = "/login";
          return Promise.reject(error);
        }

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

