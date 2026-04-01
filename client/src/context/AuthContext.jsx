import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabaseClient";  

export { supabase };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null); // Backend's user role 
  const [session, setSession] = useState(null); // Access token
  const [loading, setLoading] = useState(true);

  // returns session if user is actually logged in
  useEffect(() => {
    const initializeAuth = async () => { 
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          await fetchUserProfile(currentSession.user.id, currentSession.access_token);
        } else {
          console.log("[AuthContext] No session found");
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN') {
        setSession(newSession);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id, newSession.access_token);
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id, newSession.access_token);
        }
      } else if (event === 'USER_UPDATED') {
        setSession(newSession);
        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id, newSession.access_token);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Get API base URL (same logic as axiosInstance)
  const getApiBaseURL = () => {
    
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
      return '/api';
    }

    return "http://localhost:3001/api";
  };


  const fetchUserProfile = async (userId, accessToken) => {
    if (!accessToken) {
      console.log("[AuthContext] No access token, skipping profile fetch");
      setUser(null);
      return;
    }

    try {
      const apiUrl = getApiBaseURL();
            
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.user && !data.user.status) {
          console.log("[AuthContext] User not approved yet, logging out");
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          return;
        }
        
        setUser(data.user);
      } else if (response.status === 401) {

        console.log("[AuthContext] Session expired or invalid, clearing auth state");
        setUser(null);
        setSession(null);

        await supabase.auth.signOut();
      } else {
        console.error("[AuthContext] Profile fetch failed:", response.status);
        setUser(null);
        await supabase.auth.signOut();
        setSession(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error fetching profile:", error);
      setUser(null);

      await supabase.auth.signOut();
      setSession(null);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.session) {
        await fetchUserProfile(data.user.id, data.session.access_token);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // register
  const register = async (email, password, full_name, role) => {
    try {
      console.log("[AuthContext] Registering user:", email);
      
      const apiUrl = getApiBaseURL();
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, full_name, role })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const result = await response.json();
      console.log("[AuthContext] Registration successful:", result);

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("[AuthContext] Registration error:", error);
      
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        console.error("[AuthContext] Error signing out during registration cleanup:", signOutError);
      }
      
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: error.message };
    }
  };

  // Get access token
  const getAccessToken = () => {
    return session?.access_token || null;
  };

  // Role-based access check
  const hasRole = (role) => {
    if (Array.isArray(role)) {
      return role.includes(user?.role);
    }
    return user?.role === role;
  };

  // Check if user can access consultation notes
  const canAccessConsultation = () => {
    // Only admin and doctor can access consultation notes
    // Staff and nurse cannot access
    return hasRole(['admin', 'doctor']);
  };

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    getAccessToken,
    isAuthenticated: !!session && !!user,
    isAdmin: user?.role === "admin",
    isDoctor: user?.role === "doctor",
    isNurse: user?.role === "nurse",
    isStaff: user?.role === "staff",
    hasRole,
    canAccessConsultation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

