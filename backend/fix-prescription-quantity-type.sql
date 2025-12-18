-- Fix prescription quantity column type
-- Change from numeric to text to allow values like "10 tablets", "5ml", etc.

ALTER TABLE consultation_prescriptions 
ALTER COLUMN quantity TYPE text;

-- Make created_by nullable if it causes issues (optional - uncomment if needed)
-- ALTER TABLE consultation_prescriptions 
-- ALTER COLUMN created_by DROP NOT NULL;

-- Also fix prescription_schedules if needed
-- ALTER TABLE prescription_schedules 
-- ALTER COLUMN created_by DROP NOT NULL;
