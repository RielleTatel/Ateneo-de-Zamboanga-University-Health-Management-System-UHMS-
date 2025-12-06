-- ============================================
-- FIX VITALS RLS POLICIES FOR ALL OPERATIONS
-- Run this in your Supabase SQL Editor
-- ============================================

-- Drop ALL existing vitals policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to read all vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to create vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to update vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to delete vitals" ON vitals;

-- Ensure RLS is enabled
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

-- Create new comprehensive policies that work for all operations
CREATE POLICY "vitals_select_policy"
ON vitals FOR SELECT
TO public
USING (true);

CREATE POLICY "vitals_insert_policy"
ON vitals FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "vitals_update_policy"
ON vitals FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "vitals_delete_policy"
ON vitals FOR DELETE
TO public
USING (true);

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'vitals'
ORDER BY policyname;

-- Test delete operation (uncomment to test with a real vital_id)
-- DELETE FROM vitals WHERE vital_id = 403;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All vitals RLS policies updated!';
    RAISE NOTICE '✅ Policies now allow SELECT, INSERT, UPDATE, DELETE for all users';
    RAISE NOTICE '✅ Schema cache refreshed!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Wait 5 seconds for cache to refresh';
    RAISE NOTICE '2. Restart your backend server';
    RAISE NOTICE '3. Try deleting the vital record again';
END $$;
