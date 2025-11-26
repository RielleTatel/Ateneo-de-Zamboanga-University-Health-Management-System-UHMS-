import ConsultationModel from "../models/consultationModel.js";
import ConsultationPrescriptionsModel from "../models/consultationPrescriptionsModel.js";
import PrescriptionSchedulesModel from "../models/prescriptionSchedulesModel.js";
import supabase from "../config/supabaseClient.js";

const ConsultationController = {

  // GET ALL CONSULTATIONS
  async getAllConsultations(req, res) {
    try {
      console.log("[getAllConsultations] Fetching all consultations...");

      const consultations = await ConsultationModel.getAllConsultations();

      if (!consultations || consultations.length === 0) {
        console.log("⚠️ No consultations found.");
        return res.status(404).json({
          success: false,
          message: "No consultations found. Table may be empty or RLS is blocking access."
        });
      }

      console.log(`✅ Found ${consultations.length} consultation(s)`);

      const sanitized = consultations.map(c => ({
        consultation_id: c.consultation_id,
        uuid: c.uuid,
        date_of_check: c.date_of_check,
        allFields: Object.keys(c)
      }));

      res.json({
        success: true,
        message: `Found ${consultations.length} consultation(s).`,
        consultations: sanitized
      });

    } catch (err) {
      console.error("[getAllConsultations] ❌ Error:", err.message);
      console.error("[getAllConsultations] Full error:", err);
      res.status(500).json({
        success: false,
        error: err.message,
        hint: "Check Supabase credentials or RLS policies."
      });
    }
  },

  // GET CONSULTATIONS BY USER UUID
  async getConsultationsByUUID(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[getConsultationsByUUID] Fetching consultations for uuid:", uuid);

      const consultations = await ConsultationModel.getConsultationsByUUID(uuid);

      if (!consultations || consultations.length === 0) {
        console.log(`⚠️ No consultations found for patient UUID ${uuid}`);
        return res.json({
          success: true,
          message: "No consultations found for this user.",
          consultations: []
        });
      }

      console.log(`✅ Found ${consultations.length} consultation(s)`);

      res.json({
        success: true,
        message: `Found ${consultations.length} consultation(s).`,
        consultations
      });

    } catch (err) {
      console.error("[getConsultationsByUUID] ❌ Error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // GET CONSULTATION BY ID
  async getConsultationById(req, res) {
    try {
      const { id } = req.params;
      console.log("[getConsultationById] Fetching consultation:", id);

      const consultation = await ConsultationModel.getConsultationById(id);

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found."
        });
      }

      console.log("✅ Consultation found");
      res.json({
        success: true,
        consultation
      });

    } catch (err) {
      console.error("[getConsultationById] ❌ Error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // CREATE CONSULTATION
  async createConsultation(req, res) {
    try {
      console.log("[createConsultation] Creating new consultation...");

      const { consultation, prescriptions } = req.body;

      // Insert the main consultation record
      const { data, error } = await ConsultationModel.insertConsultation(consultation);

      if (error) {
        console.error("[createConsultation] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[createConsultation] Consultation created successfully:", data.consultation_id);

      // If prescriptions exist, store them in consultation_prescriptions table
      if (prescriptions && prescriptions.length > 0) {
        console.log("[createConsultation] Storing", prescriptions.length, "prescriptions...");
        
        for (const prescription of prescriptions) {
          // Extract schedules from prescription
          const { schedules, ...prescriptionData } = prescription;

          // Insert prescription into consultation_prescriptions
          const prescriptionToInsert = {
            consultation_id: data.consultation_id,
            medication_name: prescriptionData.name || prescriptionData.medication_name,
            quantity: prescriptionData.quantity,
            instructions: prescriptionData.frequency || prescriptionData.instructions
          };

          const { data: prescriptionResult, error: prescriptionError } = 
            await ConsultationPrescriptionsModel.insertPrescription(prescriptionToInsert);

          if (prescriptionError) {
            console.error("[createConsultation] Error storing prescription:", prescriptionError);
            continue; // Skip to next prescription
          }

          console.log("[createConsultation] Prescription stored with ID:", prescriptionResult.prescription_id);

          // If schedules exist for this prescription, store them
          if (schedules && schedules.length > 0) {
            console.log("[createConsultation] Storing", schedules.length, "schedules for prescription...");
            
            const schedulesToInsert = schedules.map(schedule => ({
              prescription_id: prescriptionResult.prescription_id,
              meal_time: schedule.time,
              dosage: schedule.tabsPerSchedule || schedule.dosage
            }));

            const { error: schedulesError } = 
              await PrescriptionSchedulesModel.insertMultipleSchedules(schedulesToInsert);

            if (schedulesError) {
              console.error("[createConsultation] Error storing schedules:", schedulesError);
            } else {
              console.log("[createConsultation] Successfully stored", schedulesToInsert.length, "schedules");
            }
          }
        }
      }

      res.json({
        success: true,
        message: "Consultation created successfully",
        consultation: data
      });

    } catch (err) {
      console.error("[createConsultation] Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // UPDATE CONSULTATION
  async updateConsultation(req, res) {
    try {
      const { id } = req.params;
      console.log("[updateConsultation] Updating consultation:", id);

      const updates = req.body;

      const { data, error } = await ConsultationModel.updateConsultation(id, updates);

      if (error) {
        console.error("[updateConsultation] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[updateConsultation] Update successful");

      res.json({
        success: true,
        message: "Consultation updated successfully",
        consultation: data
      });

    } catch (err) {
      console.error("[updateConsultation] Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // DELETE CONSULTATION
  async deleteConsultation(req, res) {
    try {
      const { id } = req.params;
      console.log("[deleteConsultation] Deleting consultation:", id);

      const { error } = await ConsultationModel.deleteConsultation(id);

      if (error) {
        console.error("[deleteConsultation] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[deleteConsultation] Consultation deleted successfully");

      res.json({
        success: true,
        message: "Consultation deleted successfully"
      });

    } catch (err) {
      console.error("[deleteConsultation] Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // GET PRESCRIPTIONS BY CONSULTATION ID
  async getPrescriptionsByConsultation(req, res) {
    try {
      const { id } = req.params;
      console.log("[getPrescriptionsByConsultation] Fetching prescriptions for consultation:", id);

      const prescriptions = await ConsultationPrescriptionsModel.getPrescriptionsByConsultationId(id);

      console.log(`✅ Found ${prescriptions.length} prescription(s)`);

      res.json({
        success: true,
        message: `Found ${prescriptions.length} prescription(s)`,
        prescriptions
      });

    } catch (err) {
      console.error("[getPrescriptionsByConsultation] Error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // GET SCHEDULES BY PRESCRIPTION ID
  async getSchedulesByPrescription(req, res) {
    try {
      const { prescription_id } = req.params;
      console.log("[getSchedulesByPrescription] Fetching schedules for prescription:", prescription_id);

      const schedules = await PrescriptionSchedulesModel.getSchedulesByPrescriptionId(prescription_id);

      console.log(`✅ Found ${schedules.length} schedule(s)`);

      res.json({
        success: true,
        message: `Found ${schedules.length} schedule(s)`,
        schedules
      });

    } catch (err) {
      console.error("[getSchedulesByPrescription] Error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ConsultationController;
