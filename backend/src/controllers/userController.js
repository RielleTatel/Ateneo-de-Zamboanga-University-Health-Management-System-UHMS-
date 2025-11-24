import UserModel from "../models/userModel.js";
import supabase from "../config/supabaseClient.js";

const UserController = {  

  async getPendingUsers(req, res) { 

      try { 
        console.log("Getting users..");  

        const pendingUsers = await UserModel.getUsers({status: false}) 

        if (!pendingUsers || pendingUsers.length === 0) {
          console.log("⚠️ No registered users found table");
          return res.status(404).json({ 
            success: false, 
            message: "No registered users, table might be empty or RLS is blocking access." 
          });
        }   

        console.log(` ✅ Found ${pendingUsers.length} user(s) in Supabase`);  
        
        const pendingUsersSanitized = pendingUsers.map(user => ({
          uuid: user.uuid,
          email: user.email,
          full_name: user.full_name,
          role: user.role, 
          allFields: Object.keys(user)
        })) 

        res.json({
          success: true,
          message: `Supabase connection working! Found ${pendingUsers.length} user(s).`,
          users: pendingUsersSanitized
        });
 
      } catch (err) {
          console.error("[testSupabase] ❌ Error:", err.message);
          console.error("[testSupabase] Full error:", err);
          res.status(500).json({ 
            success: false, 
            error: err.message,
            hint: "Check your Supabase credentials and RLS policies. You may need to use the service_role key instead of the anon key."
          });
      }
  },

  async getVerifiedUsers (req, res) { 

      try { 
        console.log("Getting users..");  

        const verifiedUsers = await UserModel.getUsers({status: true}) 

        if (!verifiedUsers || verifiedUsers.length === 0) {
          console.log("⚠️ No verified users found table");
          return res.status(404).json({ 
            success: false, 
            message: "No verified users, table might be empty or RLS is blocking access." 
          });
        }   

        console.log(` ✅ Found ${verifiedUsers.length} user(s) in Supabase`);  
        
        const verifiedUsersSanitized = verifiedUsers.map(user => ({
          uuid: user.uuid,
          email: user.email,
          full_name: user.full_name,
          role: user.role, 
          allFields: Object.keys(user)
        })) 

        res.json({
          success: true,
          message: `Supabase connection working! Found ${verifiedUsers.length} user(s).`,
          users: verifiedUsersSanitized
        });

      } catch (err) {
          console.error("[testSupabase] ❌ Error:", err.message);
          console.error("[testSupabase] Full error:", err);
          res.status(500).json({ 
            success: false, 
            error: err.message,
            hint: "Check your Supabase credentials and RLS policies. You may need to use the service_role key instead of the anon key."
          });
      }
  },

  async approveUser(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[approveUser] Approving user:", uuid);

      const { data, error } = await UserModel.updateUserStatus(uuid, true);

      if (error) {
        console.error("[approveUser] Error:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[approveUser] User approved successfully");
      return res.json({
        success: true,
        message: "User approved successfully",
        user: data
      });
    } catch (err) {
      console.error("[approveUser] Unexpected error:", err);
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async rejectUser(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[rejectUser] Rejecting user:", uuid);

      const { error } = await UserModel.deleteUser(uuid);

      if (error) {
        console.error("[rejectUser] Error:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[rejectUser] User rejected successfully");
      return res.json({
        success: true,
        message: "User rejected successfully"
      });
    } catch (err) {
      console.error("[rejectUser] Unexpected error:", err);
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[deleteUser] Deleting user:", uuid);

      const { error } = await UserModel.deleteUser(uuid);

      if (error) {
        console.error("[deleteUser] Error:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[deleteUser] User deleted successfully");
      return res.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (err) {
      console.error("[deleteUser] Unexpected error:", err);
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }
};

export default UserController;