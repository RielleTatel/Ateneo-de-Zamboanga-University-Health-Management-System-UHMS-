# Fix for "_meta column not found" Error in Vitals Table

## Problem
Error: `Could not find the '_meta' column of 'vitals' in the schema cache`

This error occurs when Supabase's schema cache is out of sync with your actual database schema.

## Solutions (Try in order)

### Solution 1: Quick Schema Cache Refresh (RECOMMENDED - Try First)
1. Open Supabase SQL Editor
2. Run the script: `quick-fix-schema-cache.sql`
3. Wait 5-10 seconds
4. Restart your backend server: 
   ```bash
   cd backend
   npm run dev
   ```
5. Try saving a consultation again

### Solution 2: Full Schema Refresh
If Solution 1 doesn't work:
1. Run the script: `fix-vitals-schema.sql` in Supabase SQL Editor
2. Restart your backend server
3. Clear your browser cache
4. Try again

### Solution 3: Restart Supabase Project
1. Go to your Supabase Dashboard
2. Project Settings → General
3. Click "Pause Project"
4. Wait for it to pause
5. Click "Resume Project"
6. Wait for it to fully start
7. Restart your backend server

### Solution 4: Check Your Supabase Client Configuration
Make sure you're using the **service_role** key in your backend, not the anon key.

In `backend/src/config/supabaseClient.js`, verify:
```javascript
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // ← Should be service_role key
);
```

In your `.env` file:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Service role key (starts with eyJ)
```

### Solution 5: Verify Table Structure
Run this in Supabase SQL Editor to check your vitals table:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'vitals'
ORDER BY ordinal_position;
```

Expected columns:
- vital_id (integer)
- user_uuid (uuid)
- date_of_check (timestamp with time zone)
- systolic_bp (integer)
- diastolic_bp (integer)
- pulse_rate (integer)
- respiratory_rate (integer)
- temperature (numeric)
- height (numeric)
- weight (numeric)
- bmi (numeric)
- vision_left (character varying)
- vision_right (character varying)

### Solution 6: Update Backend Code to Handle Error
If vitals are optional in consultations, you can modify the code to skip vitals if there's an error:

In `backend/src/controllers/consultationController.js`, wrap vital insertion in try-catch:

```javascript
// Only save vitals if provided
if (vitalData) {
  try {
    const { data: vitalResult, error: vitalError } = await VitalModel.insertVital(vitalData);
    if (vitalError) {
      console.warn("[createConsultation] Warning: Could not save vitals:", vitalError.message);
      // Continue anyway - vitals are optional
    }
  } catch (err) {
    console.warn("[createConsultation] Warning: Vitals save failed:", err.message);
    // Continue anyway - vitals are optional
  }
}
```

## Root Cause
This error typically happens when:
1. The Supabase schema cache is stale
2. There was a recent schema migration
3. The table was recently modified
4. Supabase PostgREST needs to reload

## Prevention
- Always run `NOTIFY pgrst, 'reload schema';` after schema changes
- Use Supabase migrations for schema changes
- Restart your backend after database schema updates

## Still Having Issues?
1. Check Supabase logs in your dashboard
2. Verify RLS policies are correct (run `supabase-rls-fix.sql`)
3. Make sure you're using the correct API keys
4. Try creating a test vital record manually in Supabase dashboard
