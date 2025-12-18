import ResultModel from "../models/resultModel.js";
import ResultsFieldsModel from "../models/resultsFieldsModel.js";
import supabase from "../config/supabaseClient.js";

const ResultController = {

  // Create a new result
  async addResult(req, res) {
    try {
      const { standardFields, customFields, ...directFields } = req.body;

      // Determine which data structure we're receiving
      let resultData;
      let customFieldsArray = [];

      if (standardFields) {
        // From consultation module
        resultData = standardFields;
        customFieldsArray = customFields || [];
      } else {
        // From direct lab module (existing structure)
        resultData = directFields;
      }

      // Insert the main result record
      const { data, error } = await ResultModel.insertResult(resultData);

      if (error) {
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }


      // If custom fields exist, store them in results_fields table
      if (customFieldsArray && customFieldsArray.length > 0) {
        
        const fieldsToInsert = customFieldsArray
          .filter(field => field.field_key && field.field_value) // Only insert fields with both key and value
          .map(field => ({
            result_id: data.result_id,
            field_key: field.field_key,
            field_value: field.field_value,
            value_type: field.value_type || 'text',
            created_by: resultData.created_by || null
          }));

        if (fieldsToInsert.length > 0) {
          const { error: fieldsError } = await ResultsFieldsModel.insertMultipleResultFields(fieldsToInsert);

          if (fieldsError) {
            console.error("[addResult] Error storing custom fields:", fieldsError);
            // Don't fail the entire request, just log the error
          } else {
            console.log("[addResult] Successfully stored", fieldsToInsert.length, "custom fields");
          }
        }
      }

      return res.json({
        success: true,
        message: "Result added successfully",
        result: data
      });

    } catch (err) {
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

      const result = await ResultModel.findById(result_id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Result not found"
        });
      }

      return res.json({
        success: true,
        result
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get all results
  async getAllResults(req, res) {
    try {

      const results = await ResultModel.getAllResults();

      if (!results || results.length === 0) {
        return res.json({
          success: true,
          message: "No results found",
          results: []
        });
      }

      return res.json({
        success: true,
        results
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get results by patient UUID
  async getResultsByPatient(req, res) {
    try {
      const { uuid } = req.params;

      const results = await ResultModel.getResultsByPatient(uuid);

      if (!results || results.length === 0) {
        return res.json({
          success: true,
          message: `No results found for patient UUID ${uuid}`,
          results: []
        });
      }

      res.json({
        success: true,
        message: `Fetched ${results.length} result(s) for patient.`,
        results
      });
    } catch (err) {
      res.status(500).json({
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

      const { data, error } = await ResultModel.updateResult(result_id, updatedData);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      return res.json({
        success: true,
        message: "Result updated successfully",
        result: data
      });

    } catch (err) {
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

      const { error } = await ResultModel.deleteResult(result_id);

      if (error) {
        return res.status(500).json({
          success: false,
          error: error.message
        });
      }

      return res.json({
        success: true,
        message: "Result deleted successfully"
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  },

  // Get custom fields for a result
  async getCustomFieldsByResult(req, res) {
    try {
      const { result_id } = req.params;

      const fields = await ResultsFieldsModel.getFieldsByResultId(result_id);

      res.json({
        success: true,
        message: `Found ${fields.length} custom field(s)`,
        fields
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

};

export default ResultController;
