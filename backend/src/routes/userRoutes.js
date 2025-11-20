import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

// Authentication routes
router.post("/login", UserController.login);
router.post("/register", UserController.register);

// User management routes
router.get("/pending", UserController.getPendingUsers);
router.get("/verified", UserController.getVerifiedUsers);
router.patch("/approve/:uuid", UserController.approveUser);
router.delete("/reject/:uuid", UserController.rejectUser);
router.delete("/delete/:uuid", UserController.deleteUser);


export default router; 