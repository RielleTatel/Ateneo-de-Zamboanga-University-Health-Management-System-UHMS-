import supabase from "../config/supabaseClient.js";

const PatientModel = {

  // Create a new patient
  async insertPatient(patientData) {
    console.log("[insertPatient] Inserting patient:", patientData);

    const { data, error } = await supabase
      .from('patient')
      .insert([patientData])
      .select()
      .single();

    if (error) {
      console.error("[insertPatient] Error:", error);
    } else {
      console.log("[insertPatient] Success:", data);
    }

    return { data, error };
  },

  // Find a patient by UUID
  async findById(uuid) {
    console.log("[findById] Looking up patient UUID:", uuid);

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
        console.log("[findById] Patient not found in database");
        return null;
      }

      throw new Error(`Database error: ${error.message}`);
    }

    console.log("[findById] Patient found:", data ? 'Yes' : 'No');
    return data;
  },

  // Fetch all patients
  async getAllPatients() {
    console.log("[getAllPatients] Fetching all patients");

    const { data, error } = await supabase
      .from("patient")
      .select("*");

    if (error) {
      console.error("[getAllPatients] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`[getAllPatients] ✅ Fetched ${data.length} patients`);
    return data;
  },

  // Update a patient by UUID
  async updatePatient(uuid, updateData) {
    console.log("[updatePatient] Updating patient:", { uuid, updateData });

    const { data, error } = await supabase
      .from("patient")
      .update(updateData)
      .eq("uuid", uuid)
      .select()
      .single();

    if (error) {
      console.error("[updatePatient] Error:", error);
    } else {
      console.log("[updatePatient] Success:", data);
    }

    return { data, error };
  },

  // Delete a patient by UUID
  async deletePatient(uuid) {
    console.log("[deletePatient] Deleting patient:", uuid);

    const { data, error } = await supabase
      .from("patient")
      .delete()
      .eq("uuid", uuid);

    if (error) {
      console.error("[deletePatient] Error:", error);
    } else {
      console.log("[deletePatient] Success");
    }

    return { data, error };
  }
};

export default PatientModel;
