import VitalModel from "../models/vitalModel.js";

const VitalController = {

  // Get all vital records
  async getAllVitals(req, res) {
    try {

      const vitals = await VitalModel.getAllVitals();

      if (!vitals || vitals.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No vital records found. Table might be empty or RLS is blocking access."
        });
      }

      res.json({
        success: true,
        message: `Fetched ${vitals.length} vital record(s).`,
        vitals
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get vitals by patient UUID
  async getVitalsByPatient(req, res) {
    try {
      const { uuid } = req.params;

      const vitals = await VitalModel.getVitalsByPatient(uuid);

      if (!vitals || vitals.length === 0) {
        return res.json({
          success: true,
          message: `No vitals found for patient UUID ${uuid}`,
          vitals: []
        });
      }

      res.json({
        success: true,
        message: `Fetched ${vitals.length} vital record(s) for patient.`,
        vitals
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get a single vital record by ID
  async getVitalById(req, res) {
    try {
      const { vital_id } = req.params;

      const vital = await VitalModel.getVitalById(vital_id);

      if (!vital) {
        return res.status(404).json({
          success: false,
          message: `Vital record with ID ${vital_id} not found`
        });
      }

      res.json({
        success: true,
        message: "Vital record fetched successfully",
        vital
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Add a new vital record
  async addVital(req, res) {
    try {
      const vitalData = req.body;

      const { data, error } = await VitalModel.insertVital(vitalData);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Vital record added successfully",
        vital: data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Update a vital record
  async updateVital(req, res) {
    try {
      const { vital_id } = req.params;
      const updates = req.body;

      const { data, error } = await VitalModel.updateVital(vital_id, updates);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Vital record updated successfully",
        vital: data
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Delete a vital record
  async deleteVital(req, res) {
    try {
      const { vital_id } = req.params;

      const { error } = await VitalModel.deleteVital(vital_id);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      res.json({
        success: true,
        message: "Vital record deleted successfully"
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default VitalController;
