import supabase from "../config/supabaseClient.js";

const ResultModel = {

  // Insert a new result
  async insertResult(resultData) {
    console.log("[insertResult] Inserting:", resultData);

    // Only allow fields that EXIST in your table  
    const allowedFields = [
      "hgb", "mcv", "wbc", "slp", "tchol", "hdl", "ldl", "trig",
      "fbs", "hba1c", "sgpt", "screa", "burica", "na", "k", "psa",
      "ekg", "2d_echo", "cxr", "diastolic", "systolic", "urinalysis",
      "folate", "vitd", "b12", "tsh"
    ];

    const filtered = {};
    for (const key of allowedFields) {
      if (resultData[key] !== undefined) {
        filtered[key] = resultData[key];
      }
    }

    const { data, error } = await supabase
      .from("result")
      .insert([filtered])
      .select()
      .single();

    return { data, error };
  },

  // Get result by ID
  async findById(result_id) {
    const { data, error } = await supabase
      .from("result")
      .select("*")
      .eq("result_id", result_id)
      .single();

    if (error) return null;
    return data;
  },

  // Get all results
  async getAllResults() {
    const { data, error } = await supabase
      .from("result")
      .select("*");

    if (error) throw new Error(error.message);
    return data;
  },

  // Update a result
  async updateResult(result_id, updatedData) {
    // Only update allowed fields
    const allowedFields = [
      "hgb", "mcv", "wbc", "slp", "tchol", "hdl", "ldl", "trig",
      "fbs", "hba1c", "sgpt", "screa", "burica", "na", "k", "psa",
      "ekg", "2d_echo", "cxr", "diastolic", "systolic", "urinalysis",
      "folate", "vitd", "b12", "tsh"
    ];

    const filtered = {};
    for (const key of allowedFields) {
      if (updatedData[key] !== undefined) {
        filtered[key] = updatedData[key];
      }
    }

    const { data, error } = await supabase
      .from("result")
      .update(filtered)
      .eq("result_id", result_id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a result
  async deleteResult(result_id) {
    const { data, error } = await supabase
      .from("result")
      .delete()
      .eq("result_id", result_id);

    return { data, error };
  }
};

export default ResultModel;
