import supabase from "../config/supabaseClient.js";

const ConsultationModel = {

  // CREATE
  async insertConsultation(consultationData) {

    const { data, error } = await supabase
      .from("consultations")
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

    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("consultation_id", consultation_id)
      .single();

    if (error) {
      return null;
    }

    return data;
  },

  // READ BY USER UUID
  async getConsultationsByUUID(uuid) {

    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("uuid", uuid)
      .order("date_of_check", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // READ ALL
  async getAllConsultations() {

    const { data, error } = await supabase
      .from("consultations")
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  // UPDATE
  async updateConsultation(consultation_id, updates) {

    const { data, error } = await supabase
      .from("consultations")
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

    const { data, error } = await supabase
      .from("consultations")
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
