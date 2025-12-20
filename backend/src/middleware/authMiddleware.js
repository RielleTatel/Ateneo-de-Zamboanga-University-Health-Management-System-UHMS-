import supabase from "../config/supabaseClient.js";

/**
 * Middleware to verify Supabase access token
 * Extracts token from Authorization header and validates it with Supabase
 */
export const verifyToken = async (req, res, next) => {
  try { 
    
    // Check if Supabase client is initialized
    if (!supabase) {
      return res.status(500).json({ 
        error: "Configuration error",
        message: "Server is not properly configured. Please contact the administrator."
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: "Authentication required",
        message: "No access token provided" 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ 
        error: "Invalid token",
        message: error?.message || "Token verification failed" 
      });
    }

    // Attach user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };

    next();
  } catch (err) {
    return res.status(500).json({ 
      error: "Server error",
      message: "Failed to authenticate request",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * Middleware to check if user has required role(s)
 * Must be used after verifyToken middleware
 * @param {string|string[]} allowedRoles - Role or array of roles allowed
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check if Supabase client is initialized
      if (!supabase) {
        return res.status(500).json({ 
          error: "Configuration error",
          message: "Server is not properly configured. Please contact the administrator."
        });
      }

      if (!req.user) {
        return res.status(401).json({ 
          error: "Authentication required",
          message: "No user found in request" 
        });
      }

      // Get user's role from database
      const { data: userData, error } = await supabase
        .from("users")
        .select("role, status")
        .eq("uuid", req.user.id)
        .single();

      if (error || !userData) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "User profile not found" 
        });
      }

      // Check if user is verified
      if (!userData.status) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "User account not verified by admin" 
        });
      }

      // Attach role to request
      req.user.role = userData.role;

      // Check if user has required role
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!roles.includes(userData.role)) {
        return res.status(403).json({ 
          error: "Access denied",
          message: "Insufficient permissions for this action" 
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({ 
        error: "Server error",
        message: "Failed to verify permissions" 
      });
    }
  };
};

