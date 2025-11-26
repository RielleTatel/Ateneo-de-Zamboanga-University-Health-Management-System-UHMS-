import express from "express";
import UserController from "../controllers/userController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// User management routes - Protected (Admin only)
router.get("/pending", verifyToken, requireRole("admin"), UserController.getPendingUsers);
router.get("/verified", verifyToken, requireRole("admin"), UserController.getVerifiedUsers);
router.patch("/approve/:uuid", verifyToken, requireRole("admin"), UserController.approveUser);
router.delete("/reject/:uuid", verifyToken, requireRole("admin"), UserController.rejectUser);
router.delete("/delete/:uuid", verifyToken, requireRole("admin"), UserController.deleteUser);
router.post("/transfer-admin", verifyToken, requireRole("admin"), UserController.transferAdminRole);

export default router; 