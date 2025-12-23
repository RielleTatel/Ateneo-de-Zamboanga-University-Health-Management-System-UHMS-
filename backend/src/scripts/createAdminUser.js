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

async function createAdminUser() {
  console.log('\n=== Creating Admin User ===\n');

  const userData = {
    email: 'admin@gmail.com',
    password: 'adzu2025',
    first_name: 'Tech',
    last_name: 'Support',
    full_name: 'Tech Support',
    role: 'admin'
  };

  try {
    // Check if user already exists in auth
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAuthUser = existingUsers?.users?.find(u => u.email === userData.email);
    
    if (existingAuthUser) {
      console.log('⚠️  Auth user already exists, deleting to recreate...');
      await supabase.auth.admin.deleteUser(existingAuthUser.id);
      console.log('✅ Old auth user deleted');
    }

    // Check if user exists in users table
    const { data: existingDbUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', userData.email)
      .single();

    if (existingDbUser) {
      console.log('⚠️  Database user already exists, deleting to recreate...');
      await supabase.from('users').delete().eq('email', userData.email);
      console.log('✅ Old database user deleted');
    }

    // Create user in Supabase Auth
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,  // Skip email verification
      user_metadata: {
        full_name: userData.full_name,
        role: userData.role
      }
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Create user profile in database with verified status
    const { data: dbData, error: dbError } = await supabase
      .from('users')
      .insert([{
        uuid: authData.user.id,
        email: userData.email,
        full_name: userData.full_name,
        role: userData.role,
        status: true  // ✅ VERIFIED/ACTIVE
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Error creating user profile:', dbError.message);
      
      // Cleanup: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('Rolled back auth user creation');
      return;
    }

    console.log('✅ User profile created in database');
    console.log('\n========================================');
    console.log('      ADMIN USER CREATED SUCCESSFULLY');
    console.log('========================================');
    console.log('Email:    ', userData.email);
    console.log('Password: ', userData.password);
    console.log('Name:     ', userData.full_name);
    console.log('Role:     ', userData.role);
    console.log('Status:   ', 'ACTIVE ✅');
    console.log('========================================');
    console.log('\nYou can now login with these credentials!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the script
createAdminUser();