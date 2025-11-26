import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabaseClient";  // Import centralized Supabase client

// Re-export for backwards compatibility
export { supabase };

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          console.log("[AuthContext] Session found, fetching user profile...");
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[AuthContext] Auth state changed:", event, "Session:", !!newSession);
      
      // Handle different auth events
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
    
    // In production (Vercel), use relative URL
    if (import.meta.env.PROD || window.location.hostname !== 'localhost') {
      return '/api';
    }
    
    // Development: use localhost
    return "http://localhost:3001/api";
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (userId, accessToken) => {
    try {
      const apiUrl = getApiBaseURL();
      console.log("[AuthContext] Fetching user profile for:", userId);
      
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("[AuthContext] User profile fetched:", data.user);
        
        // Check if user is approved (status: true)
        if (data.user && !data.user.status) {
          console.log("[AuthContext] User not approved yet, logging out");
          // User exists but not approved - sign them out
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          return;
        }
        
        setUser(data.user);
      } else {
        console.error("[AuthContext] Failed to fetch user profile:", response.status);
        setUser(null);
        // Clear session if profile fetch fails
        await supabase.auth.signOut();
        setSession(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error fetching user profile:", error);
      setUser(null);
      // Clear session on error
      await supabase.auth.signOut();
      setSession(null);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Fetch user profile from backend
      if (data.session) {
        await fetchUserProfile(data.user.id, data.session.access_token);
      }

      return { success: true, data };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Register new user
  const register = async (email, password, full_name, role) => {
    try {
      console.log("[AuthContext] Registering user:", email);
      
      // Only register through backend - don't create session yet
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

      // IMPORTANT: Sign out any auto-created session
      // Supabase might have created a session during registration
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        console.log("[AuthContext] Signing out auto-created session after registration");
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error("[AuthContext] Registration error:", error);
      
      // Clean up any session that might have been created
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

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    getAccessToken,
    isAuthenticated: !!session && !!user,
    isAdmin: user?.role === "admin"
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

