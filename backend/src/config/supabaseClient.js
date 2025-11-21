import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

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
