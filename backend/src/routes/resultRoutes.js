import express from "express";
import ResultController from "../controllers/resultController.js";

const router = express.Router();

router.post("/add", ResultController.addResult);                // Create a new result
router.get("/all", ResultController.getAllResults);             // Get all results
router.get("/patient/:uuid", ResultController.getResultsByPatient); // Get results by patient
router.get("/:result_id/fields", ResultController.getCustomFieldsByResult); // Get custom fields for a result
router.get("/:result_id", ResultController.getResultById);      // Get one result
router.patch("/update/:result_id", ResultController.updateResult); // Update result
router.delete("/delete/:result_id", ResultController.deleteResult); // Delete result

export default router;

