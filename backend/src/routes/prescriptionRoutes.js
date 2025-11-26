import express from "express";
import ConsultationController from "../controllers/consultationController.js";

const router = express.Router();

// Prescription routes
router.get("/:prescription_id/schedules", ConsultationController.getSchedulesByPrescription);

export default router;

