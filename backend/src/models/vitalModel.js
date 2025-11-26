import supabase from "../config/supabaseClient.js";

const VitalModel = {

  // Insert a new vital record
  async insertVital(vitalData) {
    console.log("[insertVital] Inserting vital record:", vitalData);
    
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
    console.log("[getAllVitals] Fetching all vitals");
    const { data, error } = await supabase.from('vitals').select('*');

    if (error) {
      console.error("[getAllVitals] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`[getAllVitals] ✅ Fetched ${data.length} vital records`);
    return data;
  },

  // Get vitals by patient UUID
  async getVitalsByPatient(uuid) {
    console.log("[getVitalsByPatient] Fetching vitals for patient UUID:", uuid);
    const { data, error } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_uuid', uuid)
      .order('date_of_check', { ascending: false });

    if (error) {
      console.error("[getVitalsByPatient] Error:", error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    console.log(`[getVitalsByPatient] ✅ Fetched ${data.length} records`);
    return data;
  },

  // Get a single vital record by ID
  async getVitalById(vital_id) {
    console.log("[getVitalById] Fetching vital ID:", vital_id);
    const { data, error } = await supabase.from('vitals').select('*').eq('vital_id', vital_id).single();

    if (error) {
      console.error("[getVitalById] Error:", error);
      return null;
    }

    console.log("[getVitalById] Record found:", data ? 'Yes' : 'No');
    return data;
  },

  // Update a vital record
  async updateVital(vital_id, updates) {
    console.log("[updateVital] Updating vital record:", { vital_id, updates });
    const { data, error } = await supabase.from('vitals').update(updates).eq('vital_id', vital_id).select().single();

    if (error) {
      console.error("[updateVital] Error:", error);
    } else {
      console.log("[updateVital] Success:", data);
    }

    return { data, error };
  },

  // Delete a vital record
  async deleteVital(vital_id) {
    console.log("[deleteVital] Deleting vital ID:", vital_id);
    const { data, error } = await supabase.from('vitals').delete().eq('vital_id', vital_id);

    if (error) {
      console.error("[deleteVital] Error:", error);
    } else {
      console.log("[deleteVital] Success");
    }

    return { data, error };
  }

};

export default VitalModel;
