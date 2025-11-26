import supabase from "../config/supabaseClient.js";

const ResultModel = {

  // Insert a new result
  async insertResult(resultData) {
    console.log("[insertResult] Inserting:", resultData);

    const { data, error } = await supabase
      .from("results")
      .insert([resultData])
      .select()
      .single();

    return { data, error };
  },

  // Get results by patient UUID
  async getResultsByPatient(uuid) {
    console.log("[getResultsByPatient] Fetching results for patient UUID:", uuid);
    
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("user_uuid", uuid)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getResultsByPatient] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`[getResultsByPatient] ✅ Fetched ${data.length} records`);
    return data;
  },

  // Get result by ID
  async findById(result_id) {
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("result_id", result_id)
      .single();

    if (error) return null;
    return data;
  },

  // Get all results
  async getAllResults() {
    const { data, error } = await supabase
      .from("results")
      .select("*");

    if (error) throw new Error(error.message);
    return data;
  },

  // Update a result
  async updateResult(result_id, updatedData) {
    const { data, error } = await supabase
      .from("results")
      .update(updatedData)
      .eq("result_id", result_id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a result
  async deleteResult(result_id) {
    const { data, error } = await supabase
      .from("results")
      .delete()
      .eq("result_id", result_id);

    return { data, error };
  }
};

export default ResultModel;
