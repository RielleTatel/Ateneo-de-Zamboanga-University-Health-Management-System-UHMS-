import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import readline from 'readline';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createVerifiedUser() {
  console.log('\n=== Create Verified User ===\n');

  try {
    // Get user input
    const email = await question('Enter email: ');
    const password = await question('Enter password: ');
    const full_name = await question('Enter full name: ');
    const role = await question('Enter role (admin/doctor/nurse/staff): ');

    console.log('\nCreating user...');

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role
      }
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      rl.close();
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    // Create user profile in database with verified status
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .insert([{
        uuid: authData.user.id,
        email: email,
        full_name: full_name,
        role: role,
        status: true  // ✅ VERIFIED
      }])
      .select()
      .single();

    if (dbError) {
      console.error('❌ Error creating user profile:', dbError.message);
      
      // Cleanup: delete auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      console.log('Rolled back auth user creation');
      
      rl.close();
      return;
    }

    console.log('✅ User profile created');
    console.log('\n=== User Created Successfully ===');
    console.log('Email:', email);
    console.log('Name:', full_name);
    console.log('Role:', role);
    console.log('Status: VERIFIED ✅');
    console.log('\nYou can now login with these credentials!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  rl.close();
}

// Run the script
createVerifiedUser();

