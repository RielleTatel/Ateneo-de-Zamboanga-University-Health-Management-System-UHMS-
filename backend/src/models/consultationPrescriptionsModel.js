import supabase from "../config/supabaseClient.js";

const ConsultationPrescriptionsModel = {

  // INSERT a new prescription
  async insertPrescription(prescriptionData) {
    console.log("[insertPrescription] Inserting prescription:", prescriptionData);

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .insert([prescriptionData])
      .select()
      .single();

    if (error) {
      console.error("[insertPrescription] Error:", error);
    } else {
      console.log("[insertPrescription] Success:", data);
    }

    return { data, error };
  },

  // INSERT multiple prescriptions at once
  async insertMultiplePrescriptions(prescriptionsArray) {
    console.log("[insertMultiplePrescriptions] Inserting", prescriptionsArray.length, "prescriptions");

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .insert(prescriptionsArray)
      .select();

    if (error) {
      console.error("[insertMultiplePrescriptions] Error:", error);
    } else {
      console.log("[insertMultiplePrescriptions] Success: Inserted", data.length, "prescriptions");
    }

    return { data, error };
  },

  // GET prescriptions for a specific consultation
  async getPrescriptionsByConsultationId(consultation_id) {
    console.log("[getPrescriptionsByConsultationId] Fetching prescriptions for consultation:", consultation_id);

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .select("*")
      .eq("consultation_id", consultation_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getPrescriptionsByConsultationId] Error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // GET a specific prescription by ID
  async getPrescriptionById(prescription_id) {
    console.log("[getPrescriptionById] Fetching prescription:", prescription_id);

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .select("*")
      .eq("prescription_id", prescription_id)
      .single();

    if (error) {
      console.error("[getPrescriptionById] Error:", error);
      return null;
    }

    return data;
  },

  // UPDATE a prescription
  async updatePrescription(prescription_id, updates) {
    console.log("[updatePrescription] Updating prescription:", { prescription_id, updates });

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .update(updates)
      .eq("prescription_id", prescription_id)
      .select()
      .single();

    if (error) {
      console.error("[updatePrescription] Error:", error);
    } else {
      console.log("[updatePrescription] Success:", data);
    }

    return { data, error };
  },

  // DELETE a prescription
  async deletePrescription(prescription_id) {
    console.log("[deletePrescription] Deleting prescription:", prescription_id);

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .delete()
      .eq("prescription_id", prescription_id);

    if (error) {
      console.error("[deletePrescription] Error:", error);
    } else {
      console.log("[deletePrescription] Success");
    }

    return { data, error };
  },

  // DELETE all prescriptions for a consultation
  async deleteAllPrescriptionsForConsultation(consultation_id) {
    console.log("[deleteAllPrescriptionsForConsultation] Deleting all prescriptions for consultation:", consultation_id);

    const { data, error } = await supabase
      .from("consultation_prescriptions")
      .delete()
      .eq("consultation_id", consultation_id);

    if (error) {
      console.error("[deleteAllPrescriptionsForConsultation] Error:", error);
    } else {
      console.log("[deleteAllPrescriptionsForConsultation] Success");
    }

    return { data, error };
  }

};

export default ConsultationPrescriptionsModel;

