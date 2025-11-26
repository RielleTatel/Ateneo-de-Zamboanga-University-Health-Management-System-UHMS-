/**
 * Centralized Supabase Client
 * 
 * This is the ONLY place where the Supabase client should be created.
 * Import this file anywhere you need to use Supabase in the frontend.
 * 
 * DO NOT create new Supabase clients elsewhere - always import from here.
 */

import { createClient } from "@supabase/supabase-js";

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}

// Create and export a SINGLE Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,  // Allow sessions to persist for logged-in users
    detectSessionInUrl: false,
    storage: window.localStorage,
    storageKey: 'supabase.auth.token'
  }
});

export default supabase;

