import UserModel from "../models/userModel.js"; 
import supabase from "../config/supabaseClient.js";

const Debugging = { 

    async testSupabase (req, res) {
        try {
            console.log("[testSupabase] Testing Supabase connection..."); 
            
            const allUsers = await UserModel.getAllUsers(); 

            if (!allUsers || allUsers.length === 0) {
                console.log("[testSupabase] ⚠️ No users found in the users table");
                return res.status(404).json({ 
                  success: false, 
                  message: "No users found in database. The users table might be empty or RLS is blocking access." 
                });
            }  

            console.log(`[testSupabase] ✅ Found ${allUsers.length} user(s) in Supabase`); 

                allUsers.forEach((user, index) => {
                    console.log(`[testSupabase] User ${index + 1}:`, {
                    uuid: user.uuid,
                    email: user.email,
                    full_name: user.full_name,
                    allFields: Object.keys(user)
                    });
                }); 

                const sanitizedUsers = allUsers.map(user => ({
                    uuid: user.uuid,
                    email: user.email,
                    full_name: user.full_name,
                    allFields: Object.keys(user)
                })); 

                res.json({
                    success: true,
                    message: `Supabase connection working! Found ${allUsers.length} user(s).`,
                    users: sanitizedUsers
                  });
 
        } catch (err){
            console.error("[testSupabase] ❌ Error:", err.message);
            console.error("[testSupabase] Full error:", err);
            res.status(500).json({ 
              success: false, 
              error: err.message,
              hint: "Check your Supabase credentials and RLS policies. You may need to use the service_role key instead of the anon key."
            });
        }
    },

    async checkUserStatus (req, res) {
        try {
            const { userId } = req.params;
            console.log("[checkUserStatus] Checking status for user:", userId);

            // Check if user exists in database
            const dbUser = await UserModel.findById(userId);
            
            // Check if user exists in auth
            const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(userId);

            const status = {
                userId: userId,
                existsInAuth: !authError && !!authUser,
                existsInDatabase: !!dbUser,
                authDetails: authUser ? {
                    email: authUser.email,
                    created_at: authUser.created_at,
                    user_metadata: authUser.user_metadata
                } : null,
                databaseDetails: dbUser ? {
                    email: dbUser.email,
                    full_name: dbUser.full_name,
                    role: dbUser.role,
                    status: dbUser.status
                } : null,
                synced: !authError && !!authUser && !!dbUser,
                issues: []
            };

            if (status.existsInAuth && !status.existsInDatabase) {
                status.issues.push('User exists in Auth but not in database. Run syncAuthUsers script to fix.');
            }

            if (!status.existsInAuth && status.existsInDatabase) {
                status.issues.push('User exists in database but not in Auth. This should not happen.');
            }

            if (!status.existsInAuth && !status.existsInDatabase) {
                status.issues.push('User does not exist in Auth or database.');
            }

            res.json(status);

        } catch (err) {
            console.error("[checkUserStatus] ❌ Error:", err.message);
            res.status(500).json({ 
              success: false, 
              error: err.message
            });
        }
    }
}

export default Debugging; 