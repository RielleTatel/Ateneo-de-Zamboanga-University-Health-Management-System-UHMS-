import express from "express";
import VitalController from "../controllers/vitalController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Vital management routes - Protected (Admin only)
router.get("/",  VitalController.getAllVitals); // Get all vitals
router.get("/patient/:uuid", VitalController.getVitalsByPatient); // Get vitals by patient UUID
router.get("/:vital_id", VitalController.getVitalById); // Get a single vital by ID
router.post("/add", VitalController.addVital); // Add new vital
router.patch("/update/:vital_id", VitalController.updateVital); // Update a vital
router.delete("/delete/:vital_id", VitalController.deleteVital); // Delete a vital

export default router;
