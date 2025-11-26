import UserModel from "../models/userModel.js";
import supabase from "../config/supabaseClient.js";

const UserController = { 

  async getPendingUsers(req, res) { 

      try { 
        console.log("[getPendingUsers] Getting pending users...");  

        const pendingUsers = await UserModel.getUsers({status: false}) 

        // Return empty array instead of 404 when no users found
        if (!pendingUsers || pendingUsers.length === 0) {
          console.log("[getPendingUsers] No pending users found");
          return res.json({ 
            success: true, 
            message: "No pending users",
            users: []  // Return empty array instead of error
          });
        }   

        console.log(`[getPendingUsers] ✅ Found ${pendingUsers.length} pending user(s)`);  
        
        const pendingUsersSanitized = pendingUsers.map(user => ({
          uuid: user.uuid,
          email: user.email,
          full_name: user.full_name,
          role: user.role, 
          allFields: Object.keys(user)
        })) 

        res.json({
          success: true,
          message: `Found ${pendingUsers.length} pending user(s).`,
          users: pendingUsersSanitized
        });
 
      } catch (err) {
          console.error("[getPendingUsers] ❌ Error:", err.message);
          console.error("[getPendingUsers] Full error:", err);
          res.status(500).json({ 
            success: false, 
            error: err.message,
            hint: "Check your Supabase credentials and RLS policies."
          });
      }
  },

  async getVerifiedUsers (req, res) { 

      try { 
        console.log("[getVerifiedUsers] Getting verified users...");  

        const verifiedUsers = await UserModel.getUsers({status: true}) 

        // Return empty array instead of 404 when no users found
        if (!verifiedUsers || verifiedUsers.length === 0) {
          console.log("[getVerifiedUsers] No verified users found");
          return res.json({ 
            success: true, 
            message: "No verified users",
            users: []  // Return empty array instead of error
          });
        }   

        console.log(`[getVerifiedUsers] ✅ Found ${verifiedUsers.length} verified user(s)`);  
        
        const verifiedUsersSanitized = verifiedUsers.map(user => ({
          uuid: user.uuid,
          email: user.email,
          full_name: user.full_name,
          role: user.role, 
          allFields: Object.keys(user)
        })) 

        res.json({
          success: true,
          message: `Found ${verifiedUsers.length} verified user(s).`,
          users: verifiedUsersSanitized
        });

      } catch (err) {
          console.error("[getVerifiedUsers] ❌ Error:", err.message);
          console.error("[getVerifiedUsers] Full error:", err);
          res.status(500).json({ 
            success: false, 
            error: err.message,
            hint: "Check your Supabase credentials and RLS policies."
          });
      }
  },

  async approveUser(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[approveUser] Approving user:", uuid);

      // Step 1: Update user status in custom users table
      const { data: userData, error: dbError } = await UserModel.updateUserStatus(uuid, true);

      if (dbError) {
        console.error("[approveUser] Database error:", dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }

      console.log("[approveUser] Database status updated successfully");

      // Step 2: Confirm user in Supabase Auth (CRITICAL FIX)
      // This removes the "Email not confirmed" error
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.updateUserById(
          uuid,
          { email_confirm: true }  // Manually confirm the user's email
        );

        if (authError) {
          console.error("[approveUser] Supabase Auth error:", authError);
          // Don't fail the whole operation - status is already updated
          console.warn("[approveUser] User status updated but email confirmation failed");
        } else {
          console.log("[approveUser] User email confirmed in Supabase Auth");
        }
      } catch (authErr) {
        console.error("[approveUser] Failed to confirm user in Supabase Auth:", authErr);
        // Don't fail - status is updated, user can still login after page refresh
      }

      console.log("[approveUser] User approved successfully");
      return res.json({
        success: true,
        message: "User approved successfully",
        user: userData
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

      // Delete from custom users table
      const { error: dbError } = await UserModel.deleteUser(uuid);

      if (dbError) {
        console.error("[rejectUser] Database error:", dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }

      // Also delete from Supabase Auth
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(uuid);
        
        if (authError) {
          console.error("[rejectUser] Failed to delete from Supabase Auth:", authError);
          // Don't fail the operation - database record is already deleted
        } else {
          console.log("[rejectUser] User deleted from Supabase Auth");
        }
      } catch (authErr) {
        console.error("[rejectUser] Auth deletion error:", authErr);
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

      // Delete from custom users table
      const { error: dbError } = await UserModel.deleteUser(uuid);

      if (dbError) {
        console.error("[deleteUser] Database error:", dbError);
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }

      // Also delete from Supabase Auth
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(uuid);
        
        if (authError) {
          console.error("[deleteUser] Failed to delete from Supabase Auth:", authError);
        } else {
          console.log("[deleteUser] User deleted from Supabase Auth");
        }
      } catch (authErr) {
        console.error("[deleteUser] Auth deletion error:", authErr);
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