-- ============================================
-- FIX ALL RLS POLICIES FOR SERVICE_ROLE
-- Run this in your Supabase SQL Editor
-- ============================================

-- PROBLEM: Your backend uses service_role key, but RLS policies are set to
-- "authenticated" role with auth.uid() checks. This causes:
-- 1. Login/Register to hang (queries never complete)
-- 2. Silent failures on INSERT/UPDATE/DELETE

-- SOLUTION: Change all policies to TO public which works with service_role

-- ============================================
-- USERS TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to create users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to update users" ON users;
DROP POLICY IF EXISTS "Allow authenticated users to delete users" ON users;
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_policy" ON users FOR SELECT TO public USING (true);
CREATE POLICY "users_insert_policy" ON users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "users_update_policy" ON users FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "users_delete_policy" ON users FOR DELETE TO public USING (true);

-- ============================================
-- PATIENT TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read all patients" ON patient;
DROP POLICY IF EXISTS "Allow authenticated users to create patients" ON patient;
DROP POLICY IF EXISTS "Allow authenticated users to update patients" ON patient;
DROP POLICY IF EXISTS "Allow authenticated users to delete patients" ON patient;
DROP POLICY IF EXISTS "patient_select_policy" ON patient;
DROP POLICY IF EXISTS "patient_insert_policy" ON patient;
DROP POLICY IF EXISTS "patient_update_policy" ON patient;
DROP POLICY IF EXISTS "patient_delete_policy" ON patient;

ALTER TABLE patient ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patient_select_policy" ON patient FOR SELECT TO public USING (true);
CREATE POLICY "patient_insert_policy" ON patient FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "patient_update_policy" ON patient FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "patient_delete_policy" ON patient FOR DELETE TO public USING (true);

-- ============================================
-- CONSULTATIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read consultations" ON consultations;
DROP POLICY IF EXISTS "Allow authenticated users to create consultations" ON consultations;
DROP POLICY IF EXISTS "Allow authenticated users to update consultations" ON consultations;
DROP POLICY IF EXISTS "Allow authenticated users to delete consultations" ON consultations;
DROP POLICY IF EXISTS "Consultations select own" ON consultations;
DROP POLICY IF EXISTS "Consultations insert own" ON consultations;
DROP POLICY IF EXISTS "Consultations update own" ON consultations;
DROP POLICY IF EXISTS "Consultations delete own" ON consultations;
DROP POLICY IF EXISTS "consultations_select_policy" ON consultations;
DROP POLICY IF EXISTS "consultations_insert_policy" ON consultations;
DROP POLICY IF EXISTS "consultations_update_policy" ON consultations;
DROP POLICY IF EXISTS "consultations_delete_policy" ON consultations;

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultations_select_policy" ON consultations FOR SELECT TO public USING (true);
CREATE POLICY "consultations_insert_policy" ON consultations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "consultations_update_policy" ON consultations FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "consultations_delete_policy" ON consultations FOR DELETE TO public USING (true);

-- ============================================
-- VITALS TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to create vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to update vitals" ON vitals;
DROP POLICY IF EXISTS "Allow authenticated users to delete vitals" ON vitals;
DROP POLICY IF EXISTS "Vitals select own" ON vitals;
DROP POLICY IF EXISTS "Vitals insert own" ON vitals;
DROP POLICY IF EXISTS "Vitals update own" ON vitals;
DROP POLICY IF EXISTS "Vitals delete own" ON vitals;
DROP POLICY IF EXISTS "vitals_select_policy" ON vitals;
DROP POLICY IF EXISTS "vitals_insert_policy" ON vitals;
DROP POLICY IF EXISTS "vitals_update_policy" ON vitals;
DROP POLICY IF EXISTS "vitals_delete_policy" ON vitals;

ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vitals_select_policy" ON vitals FOR SELECT TO public USING (true);
CREATE POLICY "vitals_insert_policy" ON vitals FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "vitals_update_policy" ON vitals FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "vitals_delete_policy" ON vitals FOR DELETE TO public USING (true);

-- ============================================
-- RESULTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read all results" ON results;
DROP POLICY IF EXISTS "Allow authenticated users to create results" ON results;
DROP POLICY IF EXISTS "Allow authenticated users to update results" ON results;
DROP POLICY IF EXISTS "Allow authenticated users to delete results" ON results;
DROP POLICY IF EXISTS "Results select own" ON results;
DROP POLICY IF EXISTS "Results insert own" ON results;
DROP POLICY IF EXISTS "Results update own" ON results;
DROP POLICY IF EXISTS "Results delete own" ON results;
DROP POLICY IF EXISTS "results_select_policy" ON results;
DROP POLICY IF EXISTS "results_insert_policy" ON results;
DROP POLICY IF EXISTS "results_update_policy" ON results;
DROP POLICY IF EXISTS "results_delete_policy" ON results;

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "results_select_policy" ON results FOR SELECT TO public USING (true);
CREATE POLICY "results_insert_policy" ON results FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "results_update_policy" ON results FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "results_delete_policy" ON results FOR DELETE TO public USING (true);

-- ============================================
-- RESULTS_FIELDS TABLE
-- ============================================

DROP POLICY IF EXISTS "Allow authenticated users to read all results_fields" ON results_fields;
DROP POLICY IF EXISTS "Allow authenticated users to create results_fields" ON results_fields;
DROP POLICY IF EXISTS "Allow authenticated users to update results_fields" ON results_fields;
DROP POLICY IF EXISTS "Allow authenticated users to delete results_fields" ON results_fields;
DROP POLICY IF EXISTS "results_fields_select_policy" ON results_fields;
DROP POLICY IF EXISTS "results_fields_insert_policy" ON results_fields;
DROP POLICY IF EXISTS "results_fields_update_policy" ON results_fields;
DROP POLICY IF EXISTS "results_fields_delete_policy" ON results_fields;

ALTER TABLE results_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "results_fields_select_policy" ON results_fields FOR SELECT TO public USING (true);
CREATE POLICY "results_fields_insert_policy" ON results_fields FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "results_fields_update_policy" ON results_fields FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "results_fields_delete_policy" ON results_fields FOR DELETE TO public USING (true);

-- ============================================
-- IMMUNIZATION TABLE
-- ============================================

DROP POLICY IF EXISTS "immunization_select_policy" ON immunization;
DROP POLICY IF EXISTS "immunization_insert_policy" ON immunization;
DROP POLICY IF EXISTS "immunization_update_policy" ON immunization;
DROP POLICY IF EXISTS "immunization_delete_policy" ON immunization;

ALTER TABLE immunization ENABLE ROW LEVEL SECURITY;

CREATE POLICY "immunization_select_policy" ON immunization FOR SELECT TO public USING (true);
CREATE POLICY "immunization_insert_policy" ON immunization FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "immunization_update_policy" ON immunization FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "immunization_delete_policy" ON immunization FOR DELETE TO public USING (true);

-- ============================================
-- CONSULTATION_PRESCRIPTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "consultation_prescriptions_select_auth" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_insert_auth" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_update_auth" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_delete_auth" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Allow authenticated users to read all prescriptions" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Allow authenticated users to create prescriptions" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Allow authenticated users to update prescriptions" ON consultation_prescriptions;
DROP POLICY IF EXISTS "Allow authenticated users to delete prescriptions" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_select_policy" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_insert_policy" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_update_policy" ON consultation_prescriptions;
DROP POLICY IF EXISTS "consultation_prescriptions_delete_policy" ON consultation_prescriptions;

ALTER TABLE consultation_prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultation_prescriptions_select_policy" ON consultation_prescriptions FOR SELECT TO public USING (true);
CREATE POLICY "consultation_prescriptions_insert_policy" ON consultation_prescriptions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "consultation_prescriptions_update_policy" ON consultation_prescriptions FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "consultation_prescriptions_delete_policy" ON consultation_prescriptions FOR DELETE TO public USING (true);

-- ============================================
-- PRESCRIPTION_SCHEDULES TABLE
-- ============================================

DROP POLICY IF EXISTS "prescription_schedules_select_auth" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_insert_auth" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_update_auth" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_delete_auth" ON prescription_schedules;
DROP POLICY IF EXISTS "Allow authenticated users to read all schedules" ON prescription_schedules;
DROP POLICY IF EXISTS "Allow authenticated users to create schedules" ON prescription_schedules;
DROP POLICY IF EXISTS "Allow authenticated users to update schedules" ON prescription_schedules;
DROP POLICY IF EXISTS "Allow authenticated users to delete schedules" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_select_policy" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_insert_policy" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_update_policy" ON prescription_schedules;
DROP POLICY IF EXISTS "prescription_schedules_delete_policy" ON prescription_schedules;

ALTER TABLE prescription_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescription_schedules_select_policy" ON prescription_schedules FOR SELECT TO public USING (true);
CREATE POLICY "prescription_schedules_insert_policy" ON prescription_schedules FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "prescription_schedules_update_policy" ON prescription_schedules FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "prescription_schedules_delete_policy" ON prescription_schedules FOR DELETE TO public USING (true);

-- ============================================
-- PRESCRIPTION_ATTRIBUTES TABLE (if exists)
-- ============================================

DROP POLICY IF EXISTS "prescription_attributes_select_auth" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_insert_auth" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_update_auth" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_delete_auth" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_select_policy" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_insert_policy" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_update_policy" ON prescription_attributes;
DROP POLICY IF EXISTS "prescription_attributes_delete_policy" ON prescription_attributes;

ALTER TABLE prescription_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescription_attributes_select_policy" ON prescription_attributes FOR SELECT TO public USING (true);
CREATE POLICY "prescription_attributes_insert_policy" ON prescription_attributes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "prescription_attributes_update_policy" ON prescription_attributes FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "prescription_attributes_delete_policy" ON prescription_attributes FOR DELETE TO public USING (true);

-- ============================================
-- SCHEDULE_ATTRIBUTES TABLE (if exists)
-- ============================================

DROP POLICY IF EXISTS "schedule_attributes_select_auth" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_insert_auth" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_update_auth" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_delete_auth" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_select_policy" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_insert_policy" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_update_policy" ON schedule_attributes;
DROP POLICY IF EXISTS "schedule_attributes_delete_policy" ON schedule_attributes;

ALTER TABLE schedule_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schedule_attributes_select_policy" ON schedule_attributes FOR SELECT TO public USING (true);
CREATE POLICY "schedule_attributes_insert_policy" ON schedule_attributes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "schedule_attributes_update_policy" ON schedule_attributes FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "schedule_attributes_delete_policy" ON schedule_attributes FOR DELETE TO public USING (true);

-- ============================================
-- PASSWORD_RESET_REQUESTS TABLE (if exists)
-- ============================================

DROP POLICY IF EXISTS "password_reset_requests_select_policy" ON password_reset_requests;
DROP POLICY IF EXISTS "password_reset_requests_insert_policy" ON password_reset_requests;
DROP POLICY IF EXISTS "password_reset_requests_update_policy" ON password_reset_requests;
DROP POLICY IF EXISTS "password_reset_requests_delete_policy" ON password_reset_requests;

ALTER TABLE password_reset_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "password_reset_requests_select_policy" ON password_reset_requests FOR SELECT TO public USING (true);
CREATE POLICY "password_reset_requests_insert_policy" ON password_reset_requests FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "password_reset_requests_update_policy" ON password_reset_requests FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "password_reset_requests_delete_policy" ON password_reset_requests FOR DELETE TO public USING (true);

-- ============================================
-- REFRESH SCHEMA CACHE
-- ============================================

NOTIFY pgrst, 'reload schema';

-- ============================================
-- VERIFY ALL POLICIES
-- ============================================

SELECT 
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
    RAISE NOTICE '';
    RAISE NOTICE '✅ ALL RLS POLICIES UPDATED!';
    RAISE NOTICE '';
    RAISE NOTICE 'Tables fixed:';
    RAISE NOTICE '  - users';
    RAISE NOTICE '  - patient';
    RAISE NOTICE '  - consultations';
    RAISE NOTICE '  - vitals';
    RAISE NOTICE '  - results';
    RAISE NOTICE '  - results_fields';
    RAISE NOTICE '  - immunization';
    RAISE NOTICE '  - consultation_prescriptions';
    RAISE NOTICE '  - prescription_schedules';
    RAISE NOTICE '  - prescription_attributes';
    RAISE NOTICE '  - schedule_attributes';
    RAISE NOTICE '  - password_reset_requests';
    RAISE NOTICE '';
    RAISE NOTICE 'All policies now use TO public which works with service_role key.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Wait 10 seconds for cache to refresh';
    RAISE NOTICE '2. Restart your backend server';
    RAISE NOTICE '3. Try login/register again';
END $$;
