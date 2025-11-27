-- ============================================
-- FIX VITALS TABLE SCHEMA CACHE ISSUE
-- Run this in your Supabase SQL Editor
-- ============================================

-- This script fixes the "_meta column not found" error by:
-- 1. Ensuring the vitals table structure is correct
-- 2. Refreshing the schema cache
-- 3. Verifying RLS policies

-- ============================================
-- STEP 1: Verify and recreate vitals table structure
-- ============================================

-- Check current vitals table structure
DO $$
BEGIN
    RAISE NOTICE 'Current vitals table structure:';
END $$;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vitals'
ORDER BY ordinal_position;

-- If the table has issues, we'll recreate it with the correct structure
-- First, backup existing data if needed
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'vitals') THEN
        RAISE NOTICE '✅ Vitals table exists';
    ELSE
        RAISE NOTICE '⚠️  Vitals table does not exist - will create';
    END IF;
END $$;

-- ============================================
-- STEP 2: Ensure vitals table has correct structure
-- ============================================

-- Drop and recreate the table ONLY if there are schema issues
-- CAUTION: This will delete data. Comment out if you want to preserve data.

-- CREATE TABLE IF NOT EXISTS vitals (
--     vital_id SERIAL PRIMARY KEY,
--     user_uuid UUID NOT NULL,
--     date_of_check TIMESTAMPTZ DEFAULT NOW(),
--     systolic_bp INTEGER,
--     diastolic_bp INTEGER,
--     pulse_rate INTEGER,
--     respiratory_rate INTEGER,
--     temperature NUMERIC(4,2),
--     height NUMERIC(5,2),
--     weight NUMERIC(5,2),
--     bmi NUMERIC(5,2),
--     vision_left VARCHAR(10),
--     vision_right VARCHAR(10),
--     CONSTRAINT vitals_user_uuid_fkey FOREIGN KEY (user_uuid) 
--         REFERENCES patient(uuid) ON DELETE CASCADE
-- );

-- ============================================
-- STEP 3: Refresh Supabase schema cache
-- ============================================

-- Notify Supabase to refresh its schema cache
NOTIFY pgrst, 'reload schema';

-- Alternative: You can also just touch the table
ALTER TABLE vitals OWNER TO postgres;

-- ============================================
-- STEP 4: Fix RLS policies for vitals table
-- ============================================

-- Drop ALL existing policies (including old and new names)
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to read all vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to create vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to update vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to delete vitals" ON vitals;

-- Enable RLS
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

-- Recreate policies with new names
CREATE POLICY "Allow authenticated users to read all vitals"
ON vitals FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create vitals"
ON vitals FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update vitals"
ON vitals FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete vitals"
ON vitals FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- STEP 5: Verify the fix
-- ============================================

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'vitals'
ORDER BY policyname;

-- Test insert (this should work now)
-- Uncomment to test:
-- INSERT INTO vitals (user_uuid, systolic_bp, diastolic_bp, pulse_rate, respiratory_rate, temperature)
-- VALUES ('96263951-d9dd-43c3-a3f7-81e30bfccaaa', 120, 80, 72, 16, 36.5)
-- RETURNING *;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ Vitals table schema has been refreshed!';
    RAISE NOTICE '✅ RLS policies have been updated!';
    RAISE NOTICE '✅ Schema cache has been notified to reload!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  If error persists:';
    RAISE NOTICE '   1. Try restarting your Supabase project';
    RAISE NOTICE '   2. Clear browser cache and restart your app';
    RAISE NOTICE '   3. Check that you are using service_role key in backend';
END $$;
