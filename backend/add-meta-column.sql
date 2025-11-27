-- ============================================
-- ADD _meta COLUMN TO VITALS TABLE
-- Run this in your Supabase SQL Editor
-- ============================================

-- Add the _meta column that Supabase is looking for
ALTER TABLE vitals 
ADD COLUMN IF NOT EXISTS _meta JSONB DEFAULT '{}'::jsonb;

-- Also add it to consultations table in case it has the same issue
ALTER TABLE consultations 
ADD COLUMN IF NOT EXISTS _meta JSONB DEFAULT '{}'::jsonb;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vitals'
  AND column_name = '_meta';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ _meta column added to vitals table!';
    RAISE NOTICE '✅ _meta column added to consultations table!';
    RAISE NOTICE '✅ Schema cache refreshed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Wait 5 seconds for cache to refresh';
    RAISE NOTICE '2. Restart your backend server';
    RAISE NOTICE '3. Try saving the consultation again';
END $$;
