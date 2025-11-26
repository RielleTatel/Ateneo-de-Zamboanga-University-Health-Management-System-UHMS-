/**
 * Cleanup Script: Remove Orphaned Auth Users
 * 
 * This script finds and removes users that exist in Supabase Auth
 * but don't have corresponding entries in the users table.
 * 
 * This can happen when:
 * 1. Auth user creation succeeds
 * 2. Database insert fails
 * 3. No cleanup was performed
 * 
 * Usage:
 *   node src/scripts/cleanupOrphanedAuthUsers.js
 */

import supabase from "../config/supabaseClient.js";
import UserModel from "../models/userModel.js";

async function cleanupOrphanedAuthUsers() {
  try {
    console.log("\n=== Starting Orphaned Auth Users Cleanup ===\n");

    // Get all auth users (requires service_role key)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("❌ Error fetching auth users:", authError);
      console.error("⚠️  Make sure you're using the service_role key in your .env file");
      return;
    }

    console.log(`📊 Found ${authUsers.users.length} users in Supabase Auth\n`);

    let orphanedCount = 0;
    let cleanedCount = 0;

    // Check each auth user
    for (const authUser of authUsers.users) {
      const dbUser = await UserModel.findById(authUser.id);

      if (!dbUser) {
        orphanedCount++;
        console.log(`🔍 Found orphaned auth user:`);
        console.log(`   Email: ${authUser.email}`);
        console.log(`   UUID: ${authUser.id}`);
        console.log(`   Created: ${authUser.created_at}`);

        // Delete the orphaned auth user
        const { error: deleteError } = await supabase.auth.admin.deleteUser(authUser.id);

        if (deleteError) {
          console.error(`   ❌ Failed to delete: ${deleteError.message}\n`);
        } else {
          cleanedCount++;
          console.log(`   ✅ Successfully deleted\n`);
        }
      }
    }

    console.log("\n=== Cleanup Summary ===");
    console.log(`Total auth users: ${authUsers.users.length}`);
    console.log(`Orphaned users found: ${orphanedCount}`);
    console.log(`Successfully cleaned: ${cleanedCount}`);
    console.log(`Failed to clean: ${orphanedCount - cleanedCount}`);

    if (orphanedCount === 0) {
      console.log("\n✨ No orphaned users found. Database is clean!");
    } else if (cleanedCount === orphanedCount) {
      console.log("\n✅ All orphaned users have been cleaned up!");
    }

  } catch (err) {
    console.error("\n❌ Unexpected error during cleanup:", err);
    console.error(err.stack);
  }
}

// Run the cleanup
cleanupOrphanedAuthUsers()
  .then(() => {
    console.log("\n=== Cleanup Complete ===\n");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });

