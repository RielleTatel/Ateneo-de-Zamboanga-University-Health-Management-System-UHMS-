import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Log configuration status (don't crash the function)
if (!supabaseUrl || !supabaseKey) {
  console.error('[CRITICAL] Missing Supabase configuration:');
  console.error('  SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('  SUPABASE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  console.error('Please configure these environment variables in Vercel Dashboard.');
  console.error('See VERCEL_ENV_SETUP.md for instructions.');
}

let supabase = null;

// Only create client if configuration is available
if (supabaseUrl && supabaseKey) {
  console.log('[Supabase] Initializing client with URL:', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });
} else {
  console.error('[Supabase] Cannot initialize - missing configuration');
}

export default supabase;
