import supabase from "../config/supabaseClient.js";
import UserModel from "../models/userModel.js";

const AuthController = {
  /**
   * Sign in with Supabase Auth
   * Supabase handles password verification and returns session tokens
   */
  async login(req, res) {
    try {
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
      const { email, password, full_name, role } = req.body;
      
      console.log("[register] Registration attempt:", { email, full_name, role });

      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role
          }
        }
      });

      if (authError) {
        console.error("[register] Auth error:", authError);
        return res.status(400).json({ 
          error: "Registration failed",
          message: authError.message 
        });
      }

      console.log("[register] Supabase auth user created:", authData.user.id);

      // Create user profile in database (pending approval)
      const { data: userData, error: dbError } = await UserModel.insertUser(
        authData.user.id,
        full_name,
        role
      );

      if (dbError) {
        console.error("[register] Database error:", dbError);
        return res.status(500).json({ 
          error: "Registration failed",
          message: "Failed to create user profile" 
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

      const userData = await UserModel.findById(req.user.id);

      if (!userData) {
        return res.status(404).json({ 
          error: "User not found",
          message: "User profile not found" 
        });
      }

      res.json({
        user: {
          id: userData.uuid,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          status: userData.status
        }
      });
    } catch (err) {
      console.error("[getMe] Error:", err);
      res.status(500).json({ 
        error: "Server error",
        message: err.message 
      });
    }
  }
};

export default AuthController;

