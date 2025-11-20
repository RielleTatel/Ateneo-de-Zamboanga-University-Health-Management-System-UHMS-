import UserModel from "../models/userModel.js"; 

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
    }
}

export default Debugging; 