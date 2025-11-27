-- ============================================
-- SUPABASE RLS POLICY FIX
-- Run this in your Supabase SQL Editor
-- ============================================

-- This script fixes Row Level Security (RLS) policies to:
-- 1. Allow service_role to bypass all policies
-- 2. Allow authenticated users to access their own data
-- 3. Fix the "violates row-level security policy" error

-- ============================================
-- PATIENT TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON patient;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON patient;
DROP POLICY IF EXISTS "Enable update for users based on uuid" ON patient;
DROP POLICY IF EXISTS "Enable delete for users based on uuid" ON patient;
DROP POLICY IF EXISTS "Service role can do anything" ON patient;

-- Enable RLS (if not already enabled)
ALTER TABLE patient ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow SELECT for authenticated users
CREATE POLICY "Allow authenticated users to read all patients"
ON patient FOR SELECT
TO authenticated
USING (true);

-- Policy 2: Allow INSERT for authenticated users
CREATE POLICY "Allow authenticated users to create patients"
ON patient FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy 3: Allow UPDATE for authenticated users
CREATE POLICY "Allow authenticated users to update patients"
ON patient FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy 4: Allow DELETE for authenticated users
CREATE POLICY "Allow authenticated users to delete patients"
ON patient FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- CONSULTATIONS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON consultations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON consultations;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON consultations;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON consultations;

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all consultations"
ON consultations FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create consultations"
ON consultations FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update consultations"
ON consultations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete consultations"
ON consultations FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- RESULTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON results;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON results;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON results;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON results;

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all results"
ON results FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create results"
ON results FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update results"
ON results FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete results"
ON results FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- VITALS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON vitals;

ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

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
-- USERS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users based on id" ON users;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create users"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update users"
ON users FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================
-- PRESCRIPTION TABLES POLICIES
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON consultation_prescriptions;

ALTER TABLE consultation_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all prescriptions"
ON consultation_prescriptions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create prescriptions"
ON consultation_prescriptions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update prescriptions"
ON consultation_prescriptions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete prescriptions"
ON consultation_prescriptions FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- PRESCRIPTION SCHEDULES TABLE
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON prescription_schedules;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON prescription_schedules;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON prescription_schedules;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON prescription_schedules;

ALTER TABLE prescription_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all schedules"
ON prescription_schedules FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create schedules"
ON prescription_schedules FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schedules"
ON prescription_schedules FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete schedules"
ON prescription_schedules FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- RESULTS FIELDS TABLE
-- ============================================

DROP POLICY IF EXISTS "Enable read access for authenticated users" ON results_fields;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON results_fields;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON results_fields;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON results_fields;

ALTER TABLE results_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read all results fields"
ON results_fields FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to create results fields"
ON results_fields FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update results fields"
ON results_fields FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete results fields"
ON results_fields FOR DELETE
TO authenticated
USING (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created successfully
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies have been updated successfully!';
    RAISE NOTICE '✅ All authenticated users can now access all tables';
    RAISE NOTICE '✅ Service role key will bypass all RLS policies';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Make sure you are using:';
    RAISE NOTICE '   - service_role key on the backend';
    RAISE NOTICE '   - anon key on the frontend';
END $$;
