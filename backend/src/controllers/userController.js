import UserModel from "../models/userModel.js";
import supabase from "../config/supabaseClient.js";

const UserController = { 

  async getPendingUsers(req, res) { 

      try { 
        const pendingUsers = await UserModel.getUsers({status: false}) 

        // Return empty array instead of 404 when no users found
        if (!pendingUsers || pendingUsers.length === 0) {
          return res.json({ 
            success: true, 
            message: "No pending users",
            users: []  // Return empty array instead of error
          });
        }   

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
          res.status(500).json({ 
            success: false, 
            error: err.message,
            hint: "Check your Supabase credentials and RLS policies."
          });
      }
  },

  async getVerifiedUsers (req, res) { 

      try { 
        const verifiedUsers = await UserModel.getUsers({status: true}) 

        // Return empty array instead of 404 when no users found
        if (!verifiedUsers || verifiedUsers.length === 0) {
          return res.json({ 
            success: true, 
            message: "No verified users",
            users: []  // Return empty array instead of error
          });
        }   

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

      // Step 1: Update user status in custom users table
      const { data: userData, error: dbError } = await UserModel.updateUserStatus(uuid, true);

      if (dbError) {
        return res.status(500).json({ 
          success: false, 
          error: dbError.message 
        });
      }

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
        }
      } catch (authErr) {
        console.error("[approveUser] Failed to confirm user in Supabase Auth:", authErr);
        // Don't fail - status is updated, user can still login after page refresh
      }

      return res.json({
        success: true,
        message: "User approved successfully",
        user: userData
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async rejectUser(req, res) {
    try {
      const { uuid } = req.params;

      // Delete from custom users table
      const { error: dbError } = await UserModel.deleteUser(uuid);

      if (dbError) {
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
        }
      } catch (authErr) {
        console.error("[rejectUser] Auth deletion error:", authErr);
      }

      return res.json({
        success: true,
        message: "User rejected successfully"
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async deleteUser(req, res) {
    try {
      const { uuid } = req.params;

      // First, check if user exists
      const existingUser = await UserModel.findById(uuid);
      if (!existingUser) {
        return res.status(404).json({ 
          success: false, 
          error: "User not found" 
        });
      }

      // Delete related patient record first (if exists) to avoid foreign key issues
      try {
        const { error: patientError } = await supabase
          .from("patient")
          .delete()
          .eq("uuid", uuid);
        
        if (patientError) {
          console.log("[deleteUser] Note: No patient record or error deleting patient:", patientError.message);
        }
      } catch (patientErr) {
      }

      // Delete from custom users table
      const { error: dbError } = await UserModel.deleteUser(uuid);

      if (dbError) {
        return res.status(500).json({ 
          success: false, 
          error: dbError.message,
          hint: "This user may have associated records that prevent deletion. Check foreign key constraints."
        });
      }

      // Also delete from Supabase Auth
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(uuid);
        
        if (authError) {
          console.error("[deleteUser] Failed to delete from Supabase Auth:", authError);
        }
      } catch (authErr) {
        console.error("[deleteUser] Auth deletion error:", authErr);
      }

      return res.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  // Transfer admin role from current authenticated admin to another verified user
  async transferAdminRole(req, res) {
    try {
      const currentAdminUuid = req.user.id;
      const { targetUuid } = req.body;

      if (!targetUuid) {
        return res.status(400).json({
          success: false,
          message: "Target user ID (targetUuid) is required"
        });
      }

      if (targetUuid === currentAdminUuid) {
        return res.status(400).json({
          success: false,
          message: "You are already the admin. Select a different user to transfer the role."
        });
      }

      // Ensure target user exists and is verified
      const targetUser = await UserModel.findById(targetUuid);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "Target user not found"
        });
      }

      if (!targetUser.status) {
        return res.status(400).json({
          success: false,
          message: "Target user must be verified before receiving admin role"
        });
      }

      // Update roles: promote target to admin, demote current admin to staff
      const { error: promoteError } = await UserModel.updateUserRole(targetUuid, "admin");
      if (promoteError) {
        return res.status(500).json({
          success: false,
          message: "Failed to promote target user to admin"
        });
      }

      const { error: demoteError } = await UserModel.updateUserRole(currentAdminUuid, "staff");
      if (demoteError) {
        // We already changed the target to admin; report partial success
        return res.status(500).json({
          success: false,
          message: "Admin role transferred, but failed to update your own role. Please contact support."
        });
      }

      return res.json({
        success: true,
        message: "Admin role transferred successfully. You will lose admin permissions after your next login.",
        data: {
          from: currentAdminUuid,
          to: targetUuid
        }
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
};

export default UserController;