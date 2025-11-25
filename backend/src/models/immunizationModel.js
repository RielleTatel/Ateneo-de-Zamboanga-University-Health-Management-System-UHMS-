import supabase from "../config/supabaseClient.js";

const ImmunizationModel = {

  // Insert a new immunization record
  async insertImmunization(vaccine, last_administered, next_due, status) {
    console.log("[insertImmunization] Inserting immunization:", { vaccine, last_administered, next_due, status });

    const { data, error } = await supabase.from('immunization').insert([{
      vaccine,
      last_administered,
      next_due,
      status
    }])
    .select()
    .single();

    if (error) {
      console.error("[insertImmunization] Error:", error);
    } else {
      console.log("[insertImmunization] Success:", data);
    }

    return { data, error };
  },

  // Get immunization by ID
  async findById(immunization_id) {
    console.log("[findById] Looking up immunization ID:", immunization_id);

    const { data, error } = await supabase
      .from("immunization")
      .select("*")
      .eq("immunization_id", immunization_id)
      .single();

    if (error) {
      console.error("[findById] Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      // If not found, return null
      if (error.code === 'PGRST116') {
        console.log("[findById] Immunization not found in database");
        return null;
      }

      throw new Error(`Database error: ${error.message}`);
    }

    console.log("[findById] Immunization found:", data ? 'Yes' : 'No');
    return data;
  },

  // Get all immunizations
  async getAllImmunizations() {
    console.log("[getAllImmunizations] Fetching all immunizations");

    const { data, error } = await supabase.from("immunization").select("*");

    if (error) {
      console.error("[getAllImmunizations] Supabase error:", error);
      throw new Error(`Supabase error: ${error.message}. Code: ${error.code}`);
    }

    console.log(`[getAllImmunizations] ✅ Fetched ${data.length} records`);
    return data;
  },

  // Update an immunization record
  async updateImmunization(immunization_id, updates) {
    console.log("[updateImmunization] Updating immunization:", { immunization_id, updates });

    const { data, error } = await supabase
      .from("immunization")
      .update(updates)
      .eq("immunization_id", immunization_id)
      .select()
      .single();

    if (error) {
      console.error("[updateImmunization] Error:", error);
    } else {
      console.log("[updateImmunization] Success:", data);
    }

    return { data, error };
  },

  // Delete an immunization record
  async deleteImmunization(immunization_id) {
    console.log("[deleteImmunization] Deleting immunization:", immunization_id);

    const { data, error } = await supabase
      .from("immunization")
      .delete()
      .eq("immunization_id", immunization_id);

    if (error) {
      console.error("[deleteImmunization] Error:", error);
    } else {
      console.log("[deleteImmunization] Success");
    }

    return { data, error };
  }

};

export default ImmunizationModel;
