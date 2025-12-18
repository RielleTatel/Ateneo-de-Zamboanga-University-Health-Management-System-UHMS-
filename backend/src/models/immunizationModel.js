import supabase from "../config/supabaseClient.js";

const ImmunizationModel = {

  // Insert a new immunization record
  async insertImmunization(vaccine, last_administered, next_due, status, patient_uuid) {

    const { data, error } = await supabase.from('immunization').insert([{
      vaccine,
      last_administered,
      next_due,
      status,
      patient_uuid
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

    const { data, error } = await supabase
      .from("immunization")
      .select("*")
      .eq("immunization_id", immunization_id)
      .single();

    if (error) {

      // If not found, return null
      if (error.code === 'PGRST116') {
        return null;
      }

      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  },

  // Get all immunizations
  async getAllImmunizations() {

    const { data, error } = await supabase.from("immunization").select("*");

    if (error) {
      throw new Error(`Supabase error: ${error.message}. Code: ${error.code}`);
    }

    return data;
  },

  // Get immunizations by patient UUID
  async getImmunizationsByPatient(patient_uuid) {

    const { data, error } = await supabase
      .from("immunization")
      .select("*")
      .eq("patient_uuid", patient_uuid);

    if (error) {
      throw new Error(`Supabase error: ${error.message}. Code: ${error.code}`);
    }

    return data;
  },

  // Update an immunization record
  async updateImmunization(immunization_id, updates) {

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
