import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY;

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function syncAuthUsers() {
  console.log('\n=== Sync Auth Users to Database ===\n');

  try {
    // Get all auth users
    console.log('📋 Fetching all auth users...');
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error('❌ Error fetching auth users:', authError.message);
      return;
    }

    console.log(`✅ Found ${authUsers.length} users in Supabase Auth\n`);

    // Get all database users
    console.log('📋 Fetching all database users...');
    const { data: dbUsers, error: dbError } = await supabase
      .from('users')
      .select('uuid, email');

    if (dbError) {
      console.error('❌ Error fetching database users:', dbError.message);
      return;
    }

    console.log(`✅ Found ${dbUsers.length} users in database\n`);

    // Create a set of database user IDs for quick lookup
    const dbUserIds = new Set(dbUsers.map(u => u.uuid));

    // Find users that exist in auth but not in database
    const missingUsers = authUsers.filter(authUser => !dbUserIds.has(authUser.id));

    if (missingUsers.length === 0) {
      console.log('✅ All auth users are synced to database!');
      return;
    }

    console.log(`⚠️  Found ${missingUsers.length} users in auth but not in database:\n`);

    // Display missing users
    missingUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log(`   Metadata:`, user.user_metadata);
      console.log('');
    });

    // Sync missing users
    console.log('🔄 Syncing missing users to database...\n');

    for (const authUser of missingUsers) {
      try {
        const full_name = authUser.user_metadata?.full_name || authUser.email.split('@')[0];
        const role = authUser.user_metadata?.role || 'staff';

        console.log(`   Syncing: ${authUser.email}...`);

        const { data, error } = await supabase
          .from('users')
          .insert([{
            uuid: authUser.id,
            email: authUser.email,
            full_name: full_name,
            role: role,
            status: false  // Requires admin approval
          }])
          .select()
          .single();

        if (error) {
          console.error(`   ❌ Failed to sync ${authUser.email}:`, error.message);
        } else {
          console.log(`   ✅ Synced ${authUser.email}`);
        }
      } catch (err) {
        console.error(`   ❌ Error syncing ${authUser.email}:`, err.message);
      }
    }

    console.log('\n=== Sync Complete ===\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
syncAuthUsers();

