import express from "express";
import AuthController from "../controllers/authController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.post("/password-reset/request", AuthController.requestPasswordReset);
router.post("/check-user-role", AuthController.checkUserRole);

// Protected routes
router.get("/me", verifyToken, AuthController.getMe);

// Admin-only routes for password reset management
router.get("/password-reset/pending", verifyToken, requireRole("admin"), AuthController.getPendingResetRequests);
router.patch("/password-reset/approve/:requestId", verifyToken, requireRole("admin"), AuthController.approvePasswordReset);
router.patch("/password-reset/reject/:requestId", verifyToken, requireRole("admin"), AuthController.rejectPasswordReset);

export default router;

