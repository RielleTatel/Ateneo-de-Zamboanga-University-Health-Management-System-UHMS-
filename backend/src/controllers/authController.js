import supabase from "../config/supabaseClient.js";
import UserModel from "../models/userModel.js";
import PasswordResetModel from "../models/passwordResetModel.js";

const AuthController = {

  /**
   * Sign in with Supabase Auth
   * Supabase handles password verification and returns session tokens
   */ 
  
  async login(req, res) {
    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        console.error("[login] Supabase client not initialized - missing environment variables");
        return res.status(500).json({ 
          error: "Configuration error",
          message: "Server is not properly configured. Please contact the administrator."
        });
      }

      const { email, password } = req.body;

      console.log("[login] Attempting login for:", email);

      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.log("[login] Authentication failed:", authError.message);
        return res.status(401).json({ 
          error: "Authentication failed",
          message: authError.message 
        });
      }

      console.log("[login] Authentication successful for user:", authData.user.id);

      // Get user details from database
      const userData = await UserModel.findById(authData.user.id);

      if (!userData) {
        console.log("[login] User profile not found in database");
        return res.status(404).json({ 
          error: "User not found",
          message: "User profile not found in database" 
        });
      }

      // Check if user is verified
      if (!userData.status) {
        console.log("[login] User not verified:", userData.uuid);
        return res.status(403).json({ 
          error: "Account not verified",
          message: "Your account is pending admin approval" 
        });
      }

      console.log("[login] Login successful");

      // Return session and user data
      res.json({
        message: "Login successful",
        session: authData.session,
        user: {
          id: userData.uuid,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status
        }
      });
    } catch (err) {
      console.error("[login] Unexpected error:", err);
      res.status(500).json({ 
        error: "Server error",
        message: err.message 
      });
    }
  },

  /**
   * Sign up with Supabase Auth
   * Supabase handles password hashing and user creation
   */
  async register(req, res) {
    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        console.error("[register] Supabase client not initialized - missing environment variables");
        return res.status(500).json({ 
          error: "Configuration error",
          message: "Server is not properly configured. Please contact the administrator."
        });
      }

      const { email, password, full_name, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !full_name || !role) {
        console.log("[register] Missing required fields:", { 
          hasEmail: !!email, 
          hasPassword: !!password, 
          hasFullName: !!full_name, 
          hasRole: !!role 
        });
        return res.status(400).json({
          error: "Validation error",
          message: "All fields are required: email, password, full_name, and role"
        });
      }

      // Validate role
      const validRoles = ['nurse', 'staff', 'doctor', 'admin'];
      const normalizedRole = role.toLowerCase();
      
      if (!validRoles.includes(normalizedRole)) {
        console.log("[register] Invalid role:", role);
        return res.status(400).json({
          error: "Validation error",
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        });
      }

      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({
          error: "Validation error",
          message: "Password must be at least 6 characters long"
        });
      }
      
      console.log("[register] Registration attempt:", { email, full_name, role: normalizedRole });

      // Check if user already exists in database
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        console.log("[register] User already exists:", email);
        return res.status(400).json({
          error: "Registration failed",
          message: "An account with this email already exists. Please login or use a different email."
        });
      }

      // Create user with Supabase Auth
      // Set emailRedirectTo to null and disable auto-confirm to prevent immediate login
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: normalizedRole
          },
          emailRedirectTo: null
        }
      });

      if (authError) {
        console.error("[register] Auth error:", authError);
        
        // Provide user-friendly error messages
        let errorMessage = authError.message;
        if (authError.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please login instead.";
        } else if (authError.message.includes("email_send_rate_limit")) {
          errorMessage = "Too many registration attempts. Please wait a minute and try again.";
        }
        
        return res.status(400).json({ 
          error: "Registration failed",
          message: errorMessage 
        });
      }

      if (!authData.user) {
        console.error("[register] No user returned from Supabase Auth");
        return res.status(500).json({
          error: "Registration failed",
          message: "Failed to create authentication account"
        });
      }

      console.log("[register] Supabase auth user created:", authData.user.id);

      // Create user profile in database (pending approval)
      const { data: userData, error: dbError } = await UserModel.insertUser(
        authData.user.id,
        email,
        full_name,
        normalizedRole
      );

      if (dbError) {
        console.error("[register] Database error:", dbError);
        
        // Clean up: Delete the auth user if database insert fails
        try {
          console.log("[register] Cleaning up auth user due to database error...");
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log("[register] Auth user cleaned up successfully");
        } catch (cleanupError) {
          console.error("[register] Failed to cleanup auth user:", cleanupError);
        }
        
        // Provide specific error messages
        let errorMessage = "Failed to create user profile";
        if (dbError.code === '23505') {
          errorMessage = "This account already exists. Please try logging in or contact support.";
        } else if (dbError.message) {
          errorMessage = dbError.message;
        }
        
        return res.status(500).json({ 
          error: "Registration failed",
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? dbError : undefined
        });
      }

      console.log("[register] User profile created successfully");

      return res.status(201).json({
        message: "Registration successful. Awaiting admin approval.",
        user: userData
      });
    } catch (err) {
      console.error("[register] Unexpected error:", err);
      return res.status(500).json({ 
        error: "Server error",
        message: err.message 
      });
    }
  },

  /**
   * Sign out (client-side will handle Supabase signOut)
   * This endpoint is optional as Supabase handles logout client-side
   */
  async logout(req, res) {
    try {
      console.log("[logout] Logout request received");
      
      // Supabase handles logout on the client side
      // This endpoint can be used for logging or additional cleanup
      
      res.json({ 
        message: "Logout successful" 
      });
    } catch (err) {
      console.error("[logout] Error:", err);
      res.status(500).json({ 
        error: "Server error",
        message: err.message 
      });
    }
  },

  /**
   * Get current user session info
   * Protected route - requires valid token
   */
  async getMe(req, res) {
    try {
      console.log("[getMe] Fetching user data for:", req.user.id);
      console.log("[getMe] Request user object:", req.user);

      const userData = await UserModel.findById(req.user.id);

      console.log("[getMe] User data retrieved:", userData);

      if (!userData) {
        console.log("[getMe] User not found in database, user exists in auth but not in users table");
        return res.status(404).json({ 
          error: "User not found",
          message: "User profile not found in database. Please contact admin." 
        });
      }

      console.log("[getMe] Returning user data");
      res.json({
        user: {
          id: userData.uuid,
          email: userData.email || req.user.email,
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status
        }
      });
    } catch (err) {
      console.error("[getMe] Unexpected error:", err);
      console.error("[getMe] Error stack:", err.stack);
      res.status(500).json({ 
        error: "Server error",
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  },

  /**
   * Request password reset (public route)
   * User submits their email and new password
   * Request goes to admin for approval
   */
  async requestPasswordReset(req, res) {
    try {
      const { email, newPassword } = req.body;

      console.log("[requestPasswordReset] Password reset request for:", email);

      // Validate input
      if (!email || !newPassword) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Email and new password are required"
        });
      }

      // Check if user exists
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "No account found with this email address"
        });
      }

      // Check if user already has a pending request
      const existingRequest = await PasswordResetModel.findPendingRequestByUser(user.uuid);
      if (existingRequest) {
        return res.status(400).json({
          error: "Request already exists",
          message: "You already have a pending password reset request. Please wait for admin approval."
        });
      }

      // Create password reset request (password will be hashed by Supabase on approval)
      const resetRequest = await PasswordResetModel.createResetRequest(
        user.uuid,
        email,
        newPassword
      );

      console.log("[requestPasswordReset] Reset request created:", resetRequest.id);

      return res.status(201).json({
        message: "Password reset request submitted successfully. Please wait for admin approval.",
        requestId: resetRequest.id
      });
    } catch (err) {
      console.error("[requestPasswordReset] Error:", err);
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  },

  /**
   * Get all pending password reset requests (admin only)
   * Protected route - requires valid token and admin role
   */
  async getPendingResetRequests(req, res) {
    try {
      console.log("[getPendingResetRequests] Fetching pending reset requests");

      const requests = await PasswordResetModel.getPendingRequests();

      console.log(`[getPendingResetRequests] Found ${requests.length} pending requests`);

      return res.json({
        requests: requests
      });
    } catch (err) {
      console.error("[getPendingResetRequests] Error:", err);
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  },

  /**
   * Approve password reset request (admin only)
   * Updates the user's password in Supabase Auth
   */
  async approvePasswordReset(req, res) {
    try {
      const { requestId } = req.params;

      console.log("[approvePasswordReset] Approving request:", requestId);

      // Get the reset request
      const resetRequest = await PasswordResetModel.getRequestById(requestId);

      if (!resetRequest) {
        return res.status(404).json({
          error: "Request not found",
          message: "Password reset request not found"
        });
      }

      if (resetRequest.status !== 'pending') {
        return res.status(400).json({
          error: "Invalid request",
          message: "This request has already been processed"
        });
      }

      // Update password in Supabase Auth (Supabase will hash it)
      const { error: authError } = await supabase.auth.admin.updateUserById(
        resetRequest.user_uuid,
        { password: resetRequest.new_password }
      );

      if (authError) {
        console.error("[approvePasswordReset] Auth error:", authError);
        return res.status(500).json({
          error: "Failed to update password",
          message: authError.message
        });
      }

      // Update request status to approved
      await PasswordResetModel.updateRequestStatus(requestId, 'approved');

      console.log("[approvePasswordReset] Password reset approved successfully");

      return res.json({
        message: "Password reset approved successfully",
        user: {
          id: resetRequest.user_uuid,
          email: resetRequest.email
        }
      });
    } catch (err) {
      console.error("[approvePasswordReset] Error:", err);
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  },

  /**
   * Reject password reset request (admin only)
   */
  async rejectPasswordReset(req, res) {
    try {
      const { requestId } = req.params;

      console.log("[rejectPasswordReset] Rejecting request:", requestId);

      // Get the reset request
      const resetRequest = await PasswordResetModel.getRequestById(requestId);

      if (!resetRequest) {
        return res.status(404).json({
          error: "Request not found",
          message: "Password reset request not found"
        });
      }

      if (resetRequest.status !== 'pending') {
        return res.status(400).json({
          error: "Invalid request",
          message: "This request has already been processed"
        });
      }

      // Update request status to rejected
      await PasswordResetModel.updateRequestStatus(requestId, 'rejected');

      console.log("[rejectPasswordReset] Password reset rejected successfully");

      return res.json({
        message: "Password reset request rejected"
      });
    } catch (err) {
      console.error("[rejectPasswordReset] Error:", err);
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  }
};

export default AuthController;

