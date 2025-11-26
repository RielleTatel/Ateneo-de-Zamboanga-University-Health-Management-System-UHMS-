import supabase from "../config/supabaseClient.js";

const ResultsFieldsModel = {

  // INSERT custom field for a result
  async insertResultField(result_id, field_key, field_value, value_type = "text", created_by = null) {
    console.log("[insertResultField] Inserting custom field:", { result_id, field_key, value_type });

    const { data, error } = await supabase
      .from("results_fields")
      .insert([{
        result_id,
        field_key,
        field_value,
        value_type,
        created_by
      }])
      .select()
      .single();

    if (error) {
      console.error("[insertResultField] Error:", error);
    } else {
      console.log("[insertResultField] Success:", data);
    }

    return { data, error };
  },

  // INSERT multiple custom fields at once
  async insertMultipleResultFields(fieldsArray) {
    console.log("[insertMultipleResultFields] Inserting", fieldsArray.length, "custom fields");

    const { data, error } = await supabase
      .from("results_fields")
      .insert(fieldsArray)
      .select();

    if (error) {
      console.error("[insertMultipleResultFields] Error:", error);
    } else {
      console.log("[insertMultipleResultFields] Success: Inserted", data.length, "fields");
    }

    return { data, error };
  },

  // GET all custom fields for a specific result
  async getFieldsByResultId(result_id) {
    console.log("[getFieldsByResultId] Fetching custom fields for result:", result_id);

    const { data, error } = await supabase
      .from("results_fields")
      .select("*")
      .eq("result_id", result_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getFieldsByResultId] Error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // GET a specific custom field by result_id and field_key
  async getFieldByKey(result_id, field_key) {
    console.log("[getFieldByKey] Fetching custom field:", { result_id, field_key });

    const { data, error } = await supabase
      .from("results_fields")
      .select("*")
      .eq("result_id", result_id)
      .eq("field_key", field_key)
      .single();

    if (error) {
      console.error("[getFieldByKey] Error:", error);
      return null;
    }

    return data;
  },

  // UPDATE a custom field
  async updateResultField(id, field_value) {
    console.log("[updateResultField] Updating custom field:", { id, field_value });

    const { data, error } = await supabase
      .from("results_fields")
      .update({ field_value })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[updateResultField] Error:", error);
    } else {
      console.log("[updateResultField] Success:", data);
    }

    return { data, error };
  },

  // DELETE a custom field by id
  async deleteResultField(id) {
    console.log("[deleteResultField] Deleting custom field:", id);

    const { data, error } = await supabase
      .from("results_fields")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[deleteResultField] Error:", error);
    } else {
      console.log("[deleteResultField] Success");
    }

    return { data, error };
  },

  // DELETE all custom fields for a result
  async deleteAllFieldsForResult(result_id) {
    console.log("[deleteAllFieldsForResult] Deleting all custom fields for result:", result_id);

    const { data, error } = await supabase
      .from("results_fields")
      .delete()
      .eq("result_id", result_id);

    if (error) {
      console.error("[deleteAllFieldsForResult] Error:", error);
    } else {
      console.log("[deleteAllFieldsForResult] Success");
    }

    return { data, error };
  }

};

export default ResultsFieldsModel;

