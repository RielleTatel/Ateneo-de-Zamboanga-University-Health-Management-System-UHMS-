import express from "express";
import ConsultationController from "../controllers/consultationController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Consultation management routes - Protected (Admin only)
router.get("/", ConsultationController.getAllConsultations);
router.get("/user/:uuid", ConsultationController.getConsultationsByUUID);
router.get("/:id", ConsultationController.getConsultationById);
router.get("/:id/prescriptions", ConsultationController.getPrescriptionsByConsultation);
router.post("/create", ConsultationController.createConsultation);
router.patch("/update/:id", ConsultationController.updateConsultation);
router.delete("/delete/:id", ConsultationController.deleteConsultation);

export default router;
