import supabase from "../config/supabaseClient.js";

const VitalModel = {

  // Insert a new vital record
  async insertVital(vitalData) {
    
    const { data, error } = await supabase.from('vitals').insert([vitalData])
    .select()
    .single();

    if (error) {
      console.error("[insertVital] Error:", error);
    } else {
      console.log("[insertVital] Success:", data);
    }

    return { data, error };
  },

  // Get all vitals
  async getAllVitals() {
    const { data, error } = await supabase.from('vitals').select('*');

    if (error) {
      console.error("[getAllVitals] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
  },

  // Get vitals by patient UUID
  async getVitalsByPatient(uuid) {
    const { data, error } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_uuid', uuid)
      .order('date_of_check', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data;
  },

  // Get a single vital record by ID
  async getVitalById(vital_id) {
    const { data, error } = await supabase.from('vitals').select('*').eq('vitals_id', vital_id).single();

    if (error) {
      return null;
    }

    return data;
  },

  // Update a vital record
  async updateVital(vital_id, updates) {
    const { data, error } = await supabase.from('vitals').update(updates).eq('vitals_id', vital_id).select().single();

    if (error) {
      console.error("[updateVital] Error:", error);
    } else {
      console.log("[updateVital] Success:", data);
    }

    return { data, error };
  },

  // Delete a vital record
  async deleteVital(vital_id) {
    const { data, error } = await supabase.from('vitals').delete().eq('vitals_id', vital_id);

    if (error) {
      console.error("[deleteVital] Error:", error);
    } else {
      console.log("[deleteVital] Success");
    }

    return { data, error };
  }

};

export default VitalModel;
