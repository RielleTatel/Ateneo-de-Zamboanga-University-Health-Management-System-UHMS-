import supabase from "../config/supabaseClient.js";

const ConsultationModel = {

  // CREATE
  async insertConsultation(consultationData) {
    console.log("[insertConsultation] Inserting consultation:", consultationData);

    const { data, error } = await supabase
      .from("consultation")
      .insert([ consultationData ])
      .select()
      .single();

    if (error) {
      console.error("[insertConsultation] Error:", error);
    } else {
      console.log("[insertConsultation] Success:", data);
    }

    return { data, error };
  },

  // READ BY ID
  async getConsultationById(consultation_id) {
    console.log("[getConsultationById] Looking up:", consultation_id);

    const { data, error } = await supabase
      .from("consultation")
      .select("*")
      .eq("consultation_id", consultation_id)
      .single();

    if (error) {
      console.error("[getConsultationById] Error:", error);
      return null;
    }

    return data;
  },

  // READ BY USER UUID
  async getConsultationsByUUID(uuid) {
    console.log("[getConsultationsByUUID] Fetching consultations for uuid:", uuid);

    const { data, error } = await supabase
      .from("consultation")
      .select("*")
      .eq("uuid", uuid);

    if (error) {
      console.error("[getConsultationsByUUID] Error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // READ ALL
  async getAllConsultations() {
    console.log("[getAllConsultations] Fetching all consultations");

    const { data, error } = await supabase
      .from("consultation")
      .select("*");

    if (error) {
      console.error("[getAllConsultations] Error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // UPDATE
  async updateConsultation(consultation_id, updates) {
    console.log("[updateConsultation] Updating:", { consultation_id, updates });

    const { data, error } = await supabase
      .from("consultation")
      .update(updates)
      .eq("consultation_id", consultation_id)
      .select()
      .single();

    if (error) {
      console.error("[updateConsultation] Error:", error);
    } else {
      console.log("[updateConsultation] Success:", data);
    }

    return { data, error };
  },

  // DELETE
  async deleteConsultation(consultation_id) {
    console.log("[deleteConsultation] Deleting:", consultation_id);

    const { data, error } = await supabase
      .from("consultation")
      .delete()
      .eq("consultation_id", consultation_id);

    if (error) {
      console.error("[deleteConsultation] Error:", error);
    } else {
      console.log("[deleteConsultation] Success");
    }

    return { data, error };
  }

};

export default ConsultationModel;
