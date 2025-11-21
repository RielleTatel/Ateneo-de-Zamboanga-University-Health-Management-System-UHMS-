// Simple diagnostic endpoint to check environment variables
// This can be deployed as a separate serverless function to verify configuration

export default function handler(req, res) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'not set',
    vercelUrl: process.env.VERCEL_URL || 'not set',
    checks: {
      SUPABASE_URL: {
        configured: !!process.env.SUPABASE_URL,
        value: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 20)}...` : 'MISSING'
      },
      SUPABASE_KEY: {
        configured: !!process.env.SUPABASE_KEY,
        value: process.env.SUPABASE_KEY ? 'Set (hidden for security)' : 'MISSING'
      },
      VITE_SUPABASE_URL: {
        configured: !!process.env.VITE_SUPABASE_URL,
        value: process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 20)}...` : 'MISSING'
      },
      VITE_SUPABASE_ANON_KEY: {
        configured: !!process.env.VITE_SUPABASE_ANON_KEY,
        value: process.env.VITE_SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'MISSING'
      }
    }
  };

  // Determine overall status
  const criticalVars = [
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  ];
  
  const allConfigured = criticalVars.every(v => !!v);
  
  res.status(allConfigured ? 200 : 500).json({
    status: allConfigured ? 'READY' : 'CONFIGURATION_ERROR',
    message: allConfigured 
      ? 'All required environment variables are configured' 
      : '⚠️ Missing required environment variables. Check VERCEL_ENV_SETUP.md',
    ...diagnostics
  });
}

