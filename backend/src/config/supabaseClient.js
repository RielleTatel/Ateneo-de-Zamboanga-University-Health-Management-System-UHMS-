import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('[CRITICAL] Missing Supabase configuration:');
  console.error('  SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('  SUPABASE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  console.error('Please ensure these environment variables are configured in Vercel.');
  throw new Error('Missing required Supabase configuration. Check environment variables.');
}

console.log('[Supabase] Initializing client with URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

export default supabase;
