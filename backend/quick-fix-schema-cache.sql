-- ============================================
-- QUICK FIX: Refresh Supabase Schema Cache
-- Run this FIRST in your Supabase SQL Editor
-- ============================================

-- This is the fastest fix - just refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Touch the vitals table to force schema refresh
ALTER TABLE vitals OWNER TO postgres;

-- Touch the consultations table as well
ALTER TABLE consultations OWNER TO postgres;

-- Verify tables exist and show their structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('vitals', 'consultations')
ORDER BY table_name, ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Schema cache refresh initiated!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Wait 5-10 seconds for cache to refresh';
    RAISE NOTICE '2. Restart your backend server';
    RAISE NOTICE '3. Try the consultation save operation again';
    RAISE NOTICE '';
    RAISE NOTICE 'If error persists, run the full fix-vitals-schema.sql script';
END $$;
