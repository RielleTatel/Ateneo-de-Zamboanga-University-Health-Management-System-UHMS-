import ConsultationModel from "../models/consultationModel.js";
import ConsultationPrescriptionsModel from "../models/consultationPrescriptionsModel.js";
import PrescriptionSchedulesModel from "../models/prescriptionSchedulesModel.js";
import supabase from "../config/supabaseClient.js";

const ConsultationController = {

  // GET ALL CONSULTATIONS
  async getAllConsultations(req, res) {
    try {
      const consultations = await ConsultationModel.getAllConsultations();

      if (!consultations || consultations.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No consultations found. Table may be empty or RLS is blocking access."
        });
      }


      res.json({
        success: true,
        message: `Found ${consultations.length} consultation(s).`,
        consultations
      });

    } catch (err) {
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

      const consultations = await ConsultationModel.getConsultationsByUUID(uuid);

      if (!consultations || consultations.length === 0) {
        return res.json({
          success: true,
          message: "No consultations found for this user.",
          consultations: []
        });
      }

      res.json({
        success: true,
        message: `Found ${consultations.length} consultation(s).`,
        consultations
      });

    } catch (err) {
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

      const consultation = await ConsultationModel.getConsultationById(id);

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: "Consultation not found."
        });
      }

      res.json({
        success: true,
        consultation
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // CREATE CONSULTATION
  async createConsultation(req, res) {
    try {
      const { consultation, prescriptions } = req.body;

      // Insert the main consultation record
      const { data, error } = await ConsultationModel.insertConsultation(consultation);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      // If prescriptions exist, store them in consultation_prescriptions table
      if (prescriptions && prescriptions.length > 0) {
        
        for (const prescription of prescriptions) {
          // Extract schedules from prescription
          const { schedules, id, ...prescriptionData } = prescription;

          // Insert prescription into consultation_prescriptions
          const prescriptionToInsert = {
            consultation_id: data.consultation_id,
            medication_name: prescriptionData.name || prescriptionData.medication_name,
            quantity: prescriptionData.quantity || null,
            instructions: prescriptionData.frequency || prescriptionData.instructions,
            created_by: consultation.uuid || null
          };


          const { data: prescriptionResult, error: prescriptionError } = 
            await ConsultationPrescriptionsModel.insertPrescription(prescriptionToInsert);

          if (prescriptionError) {
            continue; // Skip to next prescription
          }

          if (!prescriptionResult) {
            continue;
          }


          // If schedules exist for this prescription, store them
          if (schedules && schedules.length > 0) {
            
            const schedulesToInsert = schedules.map(schedule => ({
              prescription_id: prescriptionResult.prescription_id,
              meal_time: schedule.time,
              dosage: schedule.tabsPerSchedule || schedule.dosage,
              created_by: consultation.uuid || null
            }));

            const { error: schedulesError } = 
              await PrescriptionSchedulesModel.insertMultipleSchedules(schedulesToInsert);

            if (schedulesError) {
              console.error("[createConsultation] Error storing schedules:", schedulesError);
            } else {
              console.log("[createConsultation] Successfully stored", schedulesToInsert.length, "schedules");
            }
          } else {
            console.log("[createConsultation] No schedules to store for this prescription");
          }
        }
      } else {
        console.log("[createConsultation] No prescriptions to store");
      }

      res.json({
        success: true,
        message: "Consultation created successfully",
        consultation: data
      });

    } catch (err) {
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

      const updates = req.body;

      const { data, error } = await ConsultationModel.updateConsultation(id, updates);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Consultation updated successfully",
        consultation: data
      });

    } catch (err) {
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

      const { error } = await ConsultationModel.deleteConsultation(id);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }


      res.json({
        success: true,
        message: "Consultation deleted successfully"
      });

    } catch (err) {
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

      const prescriptions = await ConsultationPrescriptionsModel.getPrescriptionsByConsultationId(id);


      res.json({
        success: true,
        message: `Found ${prescriptions.length} prescription(s)`,
        prescriptions
      });

    } catch (err) {
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

      const schedules = await PrescriptionSchedulesModel.getSchedulesByPrescriptionId(prescription_id);


      res.json({
        success: true,
        message: `Found ${schedules.length} schedule(s)`,
        schedules
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ConsultationController;
