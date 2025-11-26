import express from "express";
import ImmunizationController from "../controllers/immunizationController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Immunization routes - Protected (Admin only)
router.get("/", ImmunizationController.getAllImmunizations);
router.get("/:id", ImmunizationController.getImmunizationById);
router.get("/patient/:patientUuid", ImmunizationController.getImmunizationsByPatient);
router.post("/add", ImmunizationController.addImmunization);
router.patch("/update/:id", ImmunizationController.updateImmunization);
router.delete("/delete/:id", ImmunizationController.deleteImmunization);

export default router;
