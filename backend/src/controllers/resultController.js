import ResultModel from "../models/resultModel.js";
import supabase from "../config/supabaseClient.js";

const ResultController = {

  // Create a new result
  async addResult(req, res) {
    try {
      const resultData = req.body;
      console.log("[addResult] Adding new result:", resultData);

      const { data, error } = await ResultModel.insertResult(resultData);

      if (error) {
        console.error("[addResult] Error:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[addResult] Result added successfully");
      return res.json({
        success: true,
        message: "Result added successfully",
        result: data
      });

    } catch (err) {
      console.error("[addResult] Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get a result by ID
  async getResultById(req, res) {
    try {
      const { result_id } = req.params;
      console.log("[getResultById] Fetching result ID:", result_id);

      const result = await ResultModel.findById(result_id);

      if (!result) {
        console.log("[getResultById] Result not found");
        return res.status(404).json({
          success: false,
          message: "Result not found"
        });
      }

      console.log("[getResultById] Result found");
      return res.json({
        success: true,
        result
      });

    } catch (err) {
      console.error("[getResultById] Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get all results
  async getAllResults(req, res) {
    try {
      console.log("[getAllResults] Fetching all results");

      const results = await ResultModel.getAllResults();

      if (!results || results.length === 0) {
        console.log("[getAllResults] No results found");
        return res.status(404).json({
          success: false,
          message: "No results found"
        });
      }

      console.log(`[getAllResults] Found ${results.length} result(s)`);
      return res.json({
        success: true,
        results
      });

    } catch (err) {
      console.error("[getAllResults] Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Update a result by ID
  async updateResult(req, res) {
    try {
      const { result_id } = req.params;
      const updatedData = req.body;
      console.log("[updateResult] Updating result:", { result_id, updatedData });

      const { data, error } = await ResultModel.updateResult(result_id, updatedData);

      if (error) {
        console.error("[updateResult] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[updateResult] Result updated successfully");
      return res.json({
        success: true,
        message: "Result updated successfully",
        result: data
      });

    } catch (err) {
      console.error("[updateResult] Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Delete a result by ID
  async deleteResult(req, res) {
    try {
      const { result_id } = req.params;
      console.log("[deleteResult] Deleting result ID:", result_id);

      const { error } = await ResultModel.deleteResult(result_id);

      if (error) {
        console.error("[deleteResult] Error:", error);
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      console.log("[deleteResult] Result deleted successfully");
      return res.json({
        success: true,
        message: "Result deleted successfully"
      });

    } catch (err) {
      console.error("[deleteResult] Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ResultController;
