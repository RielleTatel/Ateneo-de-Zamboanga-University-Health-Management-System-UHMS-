import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

// Only create client if configuration is available
if (supabaseUrl && supabaseKey) {
  console.log('[Supabase] Initializing client with URL:', supabaseUrl);
  console.log('[Supabase] Using service_role key:', supabaseKey.substring(0, 20) + '...');
  
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'adzu-health-backend'
      }
    }
  });
  
  console.log('[Supabase] Client initialized successfully');
  console.log('[Supabase] RLS should be bypassed with service_role key');
} else {
  console.error('[Supabase] Cannot initialize - missing configuration');
  console.error('[Supabase] SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('[Supabase] SUPABASE_KEY:', supabaseKey ? 'SET' : 'MISSING');
}

export default supabase;
