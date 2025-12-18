import supabase from "../config/supabaseClient.js";

const PatientModel = {

  // Create a new patient
  async insertPatient(patientData) {
    const { data, error } = await supabase
      .from('patient')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error("[insertPatient] Error:", error);
    }

    return { data, error };
  },

  // Find a patient by UUID
  async findById(uuid) {
    const { data, error } = await supabase
      .from("patient")
      .select("*")
      .eq("uuid", uuid)
      .single();

    if (error) {
      console.error("[findById] Supabase error:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });

      if (error.code === 'PGRST116') {
        return null;
      }

      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  },

  // Fetch all patients
  async getAllPatients() {
    const { data, error } = await supabase
      .from("patient")
      .select("*");

    if (error) {
      console.error("[getAllPatients] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
  },

  // Update a patient by UUID
  async updatePatient(uuid, updateData) {
    const { data, error } = await supabase
      .from("patient")
      .update(updateData)
      .eq("uuid", uuid)
      .select()
      .single();

    if (error) {
      console.error("[updatePatient] Error:", error);
    }

    return { data, error };
  },

  // Delete a patient by UUID
  async deletePatient(uuid) {
    const { data, error } = await supabase
      .from("patient")
      .delete()
      .eq("uuid", uuid);

    if (error) {
      console.error("[deletePatient] Error:", error);
    }

    return { data, error };
  }
};

export default PatientModel;
