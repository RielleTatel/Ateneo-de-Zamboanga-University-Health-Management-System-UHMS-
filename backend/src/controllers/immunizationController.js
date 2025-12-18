import ImmunizationModel from "../models/immunizationModel.js";
import supabase from "../config/supabaseClient.js";

const ImmunizationController = {

  // Get all immunizations
  async getAllImmunizations(req, res) {
    try {

      const immunizations = await ImmunizationModel.getAllImmunizations();

      if (!immunizations || immunizations.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No immunizations found, table might be empty or RLS is blocking access."
        });
      }


      res.json({
        success: true,
        message: `Fetched ${immunizations.length} immunization record(s).`,
        immunizations
      });

    } catch (err) {
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

      const immunization = await ImmunizationModel.findById(id);

      if (!immunization) {
        return res.status(404).json({
          success: false,
          message: "Immunization record not found"
        });
      }

      res.json({
        success: true,
        immunization
      });

    } catch (err) {
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

      if (!patient_uuid) {
        return res.status(400).json({
          success: false,
          error: "patient_uuid is required"
        });
      }

      const { data, error } = await ImmunizationModel.insertImmunization(vaccine, last_administered, next_due, status, patient_uuid);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Immunization added successfully",
        immunization: data
      });

    } catch (err) {
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

      const immunizations = await ImmunizationModel.getImmunizationsByPatient(patientUuid);

      res.json({
        success: true,
        message: `Fetched ${immunizations.length} immunization record(s).`,
        immunizations
      });

    } catch (err) {
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

      const { data, error } = await ImmunizationModel.updateImmunization(id, updates);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Immunization updated successfully",
        immunization: data
      });

    } catch (err) {
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

      const { data, error } = await ImmunizationModel.deleteImmunization(id);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Immunization deleted successfully"
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ImmunizationController;
