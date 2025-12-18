import supabase from "../config/supabaseClient.js";
import UserModel from "../models/userModel.js";
import PasswordResetModel from "../models/passwordResetModel.js";

const AuthController = {

  async login(req, res) {
    try {

      if (!supabase) {
        return res.status(500).json({ 
          error: "Configuration error",
          message: "Server is not properly configured. Please contact the administrator."
        });
      }

      const { email, password } = req.body;

      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        return res.status(401).json({ 
          error: "Authentication failed",
          message: authError.message 
        });
      }

      // Get user details from database
      const userData = await UserModel.findById(authData.user.id);

      if (!userData) {
        return res.status(404).json({ 
          error: "User not found",
          message: "User profile not found in database" 
        });
      }

      // Check if user is verified
      if (!userData.status) {
        return res.status(403).json({ 
          error: "Account not verified",
          message: "Your account is pending admin approval" 
        });
      }

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
        return res.status(500).json({ 
          error: "Configuration error",
          message: "Server is not properly configured. Please contact the administrator."
        });
      }

      const { email, password, full_name, role } = req.body;
      
      // Validate required fields
      if (!email || !password || !full_name || !role) {
        return res.status(400).json({
          error: "Validation error",
          message: "All fields are required: email, password, full_name, and role"
        });
      }

      // Validate role
      const validRoles = ['nurse', 'staff', 'doctor', 'admin'];
      const normalizedRole = role.toLowerCase();
      
      if (!validRoles.includes(normalizedRole)) {
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

      // Check if user already exists in database
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {

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
        return res.status(500).json({
          error: "Registration failed",
          message: "Failed to create authentication account"
        });
      }

      // Create user profile in database (pending approval)
      const { data: userData, error: dbError } = await UserModel.insertUser(
        authData.user.id,
        email,
        full_name,
        normalizedRole
      );

      if (dbError) {
        
        // Clean up: Delete the auth user if database insert fails
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
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

      return res.status(201).json({
        message: "Registration successful. Awaiting admin approval.",
        user: userData
      });
    } catch (err) {
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
      // Supabase handles logout on the client side
      // This endpoint can be used for logging or additional cleanup
      
      res.json({ 
        message: "Logout successful" 
      });
    } catch (err) {
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
      const userData = await UserModel.findById(req.user.id);

      if (!userData) {
        return res.status(404).json({ 
          error: "User not found",
          message: "User profile not found in database. Please contact admin." 
        });
      }

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

      return res.status(201).json({
        message: "Password reset request submitted successfully. Please wait for admin approval.",
        requestId: resetRequest.id
      });
    } catch (err) {
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  },

  /**
   * Check user role by email (public route)
   * Used to determine if user should get direct reset link or admin approval
   */
  async checkUserRole(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Missing required field",
          message: "Email is required"
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

      return res.json({
        role: user.role,
        email: user.email
      });
    } catch (err) {
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
      const requests = await PasswordResetModel.getPendingRequests();

      return res.json({
        requests: requests
      });
    } catch (err) {
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
        return res.status(500).json({
          error: "Failed to update password",
          message: authError.message
        });
      }

      // Update request status to approved
      await PasswordResetModel.updateRequestStatus(requestId, 'approved');

      return res.json({
        message: "Password reset approved successfully",
        user: {
          id: resetRequest.user_uuid,
          email: resetRequest.email
        }
      });
    } catch (err) {
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

      return res.json({
        message: "Password reset request rejected"
      });
    } catch (err) {
      return res.status(500).json({
        error: "Server error",
        message: err.message
      });
    }
  }
};

export default AuthController;

