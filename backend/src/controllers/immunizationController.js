import ImmunizationModel from "../models/immunizationModel.js";
import supabase from "../config/supabaseClient.js";

const ImmunizationController = {

  // Get all immunizations
  async getAllImmunizations(req, res) {
    try {
      console.log("Fetching all immunizations...");

      const immunizations = await ImmunizationModel.getAllImmunizations();

      if (!immunizations || immunizations.length === 0) {
        console.log("⚠️ No immunizations found in the table");
        return res.status(404).json({
          success: false,
          message: "No immunizations found, table might be empty or RLS is blocking access."
        });
      }

      console.log(`✅ Found ${immunizations.length} immunization record(s)`);

      res.json({
        success: true,
        message: `Fetched ${immunizations.length} immunization record(s).`,
        immunizations
      });

    } catch (err) {
      console.error("[getAllImmunizations] ❌ Error:", err.message);
      res.status(500).json({
        success: false,
        error: err.message,
        hint: "Check your Supabase credentials and RLS policies."
      });
    }
  },

  // Get immunization by ID
  async getImmunizationById(req, res) {
    try {
      const { id } = req.params;
      console.log("[getImmunizationById] Fetching immunization:", id);

      const immunization = await ImmunizationModel.findById(id);

      if (!immunization) {
        console.log("⚠️ Immunization not found");
        return res.status(404).json({
          success: false,
          message: "Immunization record not found"
        });
      }

      console.log("✅ Immunization found");
      res.json({
        success: true,
        immunization
      });

    } catch (err) {
      console.error("[getImmunizationById] ❌ Error:", err.message);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Insert a new immunization
  async addImmunization(req, res) {
    try {
      const { vaccine, last_administered, next_due, status, patient_uuid } = req.body;
      console.log("[addImmunization] Adding new immunization:", { vaccine, last_administered, next_due, status, patient_uuid });

      if (!patient_uuid) {
        return res.status(400).json({
          success: false,
          error: "patient_uuid is required"
        });
      }

      const { data, error } = await ImmunizationModel.insertImmunization(vaccine, last_administered, next_due, status, patient_uuid);

      if (error) {
        console.error("[addImmunization] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("✅ Immunization added successfully");
      res.json({
        success: true,
        message: "Immunization added successfully",
        immunization: data
      });

    } catch (err) {
      console.error("[addImmunization] ❌ Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get immunizations by patient UUID
  async getImmunizationsByPatient(req, res) {
    try {
      const { patientUuid } = req.params;
      console.log("[getImmunizationsByPatient] Fetching immunizations for patient:", patientUuid);

      const immunizations = await ImmunizationModel.getImmunizationsByPatient(patientUuid);

      console.log(`✅ Found ${immunizations.length} immunization record(s) for patient`);

      res.json({
        success: true,
        message: `Fetched ${immunizations.length} immunization record(s).`,
        immunizations
      });

    } catch (err) {
      console.error("[getImmunizationsByPatient] ❌ Error:", err.message);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Update an immunization
  async updateImmunization(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      console.log("[updateImmunization] Updating immunization:", { id, updates });

      const { data, error } = await ImmunizationModel.updateImmunization(id, updates);

      if (error) {
        console.error("[updateImmunization] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("✅ Immunization updated successfully");
      res.json({
        success: true,
        message: "Immunization updated successfully",
        immunization: data
      });

    } catch (err) {
      console.error("[updateImmunization] ❌ Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Delete an immunization
  async deleteImmunization(req, res) {
    try {
      const { id } = req.params;
      console.log("[deleteImmunization] Deleting immunization:", id);

      const { data, error } = await ImmunizationModel.deleteImmunization(id);

      if (error) {
        console.error("[deleteImmunization] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("✅ Immunization deleted successfully");
      res.json({
        success: true,
        message: "Immunization deleted successfully"
      });

    } catch (err) {
      console.error("[deleteImmunization] ❌ Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ImmunizationController;
