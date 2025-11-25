import VitalModel from "../models/vitalModel.js";

const VitalController = {

  // Get all vital records
  async getAllVitals(req, res) {
    try {
      console.log("[getAllVitals] Fetching all vitals...");

      const vitals = await VitalModel.getAllVitals();

      if (!vitals || vitals.length === 0) {
        console.log("⚠️ No vital records found");
        return res.status(404).json({
          success: false,
          message: "No vital records found. Table might be empty or RLS is blocking access."
        });
      }

      console.log(`✅ Found ${vitals.length} vital record(s)`);
      res.json({
        success: true,
        message: `Fetched ${vitals.length} vital record(s).`,
        vitals
      });
    } catch (err) {
      console.error("[getAllVitals] ❌ Error:", err.message);
      console.error("[getAllVitals] Full error:", err);
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
      console.log("[getVitalsByPatient] Fetching vitals for patient UUID:", uuid);

      const vitals = await VitalModel.getVitalsByPatient(uuid);

      if (!vitals || vitals.length === 0) {
        console.log(`⚠️ No vitals found for patient UUID ${uuid}`);
        return res.status(404).json({
          success: false,
          message: `No vitals found for patient UUID ${uuid}`
        });
      }

      console.log(`✅ Found ${vitals.length} vital record(s) for patient`);
      res.json({
        success: true,
        message: `Fetched ${vitals.length} vital record(s) for patient.`,
        vitals
      });
    } catch (err) {
      console.error("[getVitalsByPatient] ❌ Error:", err.message);
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
      console.log("[getVitalById] Fetching vital ID:", vital_id);

      const vital = await VitalModel.getVitalById(vital_id);

      if (!vital) {
        console.log(`⚠️ Vital record with ID ${vital_id} not found`);
        return res.status(404).json({
          success: false,
          message: `Vital record with ID ${vital_id} not found`
        });
      }

      console.log("[getVitalById] Vital record found");
      res.json({
        success: true,
        message: "Vital record fetched successfully",
        vital
      });
    } catch (err) {
      console.error("[getVitalById] ❌ Error:", err.message);
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
      console.log("[addVital] Adding new vital record:", vitalData);

      const { data, error } = await VitalModel.insertVital(vitalData);

      if (error) {
        console.error("[addVital] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[addVital] Vital record added successfully");
      res.json({
        success: true,
        message: "Vital record added successfully",
        vital: data
      });
    } catch (err) {
      console.error("[addVital] ❌ Unexpected error:", err);
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
      console.log("[updateVital] Updating vital record:", { vital_id, updates });

      const { data, error } = await VitalModel.updateVital(vital_id, updates);

      if (error) {
        console.error("[updateVital] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[updateVital] Vital record updated successfully");
      res.json({
        success: true,
        message: "Vital record updated successfully",
        vital: data
      });
    } catch (err) {
      console.error("[updateVital] ❌ Unexpected error:", err);
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
      console.log("[deleteVital] Deleting vital record ID:", vital_id);

      const { error } = await VitalModel.deleteVital(vital_id);

      if (error) {
        console.error("[deleteVital] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[deleteVital] Vital record deleted successfully");
      res.json({
        success: true,
        message: "Vital record deleted successfully"
      });
    } catch (err) {
      console.error("[deleteVital] ❌ Unexpected error:", err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default VitalController;
