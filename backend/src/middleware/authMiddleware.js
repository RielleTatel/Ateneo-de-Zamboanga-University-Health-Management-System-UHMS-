import supabase from "../config/supabaseClient.js";

/**
 * Middleware to verify Supabase access token
 * Extracts token from Authorization header and validates it with Supabase
 */
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("[authMiddleware] No token provided");
      return res.status(401).json({ 
        error: "Authentication required",
        message: "No access token provided" 
      });
    }

    const token = authHeader.split(' ')[1];
    console.log("[authMiddleware] Verifying token for request:", req.url);

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("[authMiddleware] Token verification failed:", {
        error: error?.message,
        hasUser: !!user,
        url: req.url
      });
      return res.status(401).json({ 
        error: "Invalid token",
        message: error?.message || "Token verification failed" 
      });
    }

    console.log("[authMiddleware] User authenticated:", user.id);

    // Attach user info to request object
    req.user = {
      id: user.id,
      email: user.email,
      ...user.user_metadata
    };

    next();
  } catch (err) {
    console.error("[authMiddleware] Unexpected error:", {
      error: err.message,
      stack: err.stack,
      url: req.url
    });
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
        console.log("[authMiddleware] User not found in database:", req.user.id);
        return res.status(403).json({ 
          error: "Access denied",
          message: "User profile not found" 
        });
      }

      // Check if user is verified
      if (!userData.status) {
        console.log("[authMiddleware] User not verified:", req.user.id);
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
        console.log("[authMiddleware] Insufficient permissions:", {
          required: roles,
          current: userData.role
        });
        return res.status(403).json({ 
          error: "Access denied",
          message: "Insufficient permissions for this action" 
        });
      }

      console.log("[authMiddleware] Role authorized:", userData.role);
      next();
    } catch (err) {
      console.error("[authMiddleware] Role check error:", err);
      return res.status(500).json({ 
        error: "Server error",
        message: "Failed to verify permissions" 
      });
    }
  };
};

