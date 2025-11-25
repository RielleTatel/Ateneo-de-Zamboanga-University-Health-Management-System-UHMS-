import express from "express";
import PatientController from "../controllers/patientController.js";
import { verifyToken, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Patient management routes
// You can make them admin-only like user routes if desired
router.get("/", PatientController.getAllPatients);
router.get("/:uuid", PatientController.getPatientById);
router.post("/add", PatientController.addPatient);
router.patch("/update/:uuid", PatientController.updatePatient);
router.delete("/delete/:uuid", PatientController.deletePatient);

export default router;
