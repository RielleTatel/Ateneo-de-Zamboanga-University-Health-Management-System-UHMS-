import supabase from "../config/supabaseClient.js";

const PrescriptionSchedulesModel = {

  // INSERT a new schedule
  async insertSchedule(scheduleData) {
    console.log("[insertSchedule] Inserting schedule:", scheduleData);

    const { data, error } = await supabase
      .from("prescription_schedules")
      .insert([scheduleData])
      .select()
      .single();

    if (error) {
      console.error("[insertSchedule] Error:", error);
    } else {
      console.log("[insertSchedule] Success:", data);
    }

    return { data, error };
  },

  // INSERT multiple schedules at once
  async insertMultipleSchedules(schedulesArray) {
    console.log("[insertMultipleSchedules] Inserting", schedulesArray.length, "schedules");

    const { data, error } = await supabase
      .from("prescription_schedules")
      .insert(schedulesArray)
      .select();

    if (error) {
      console.error("[insertMultipleSchedules] Error:", error);
    } else {
      console.log("[insertMultipleSchedules] Success: Inserted", data.length, "schedules");
    }

    return { data, error };
  },

  // GET schedules for a specific prescription
  async getSchedulesByPrescriptionId(prescription_id) {
    console.log("[getSchedulesByPrescriptionId] Fetching schedules for prescription:", prescription_id);

    const { data, error } = await supabase
      .from("prescription_schedules")
      .select("*")
      .eq("prescription_id", prescription_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[getSchedulesByPrescriptionId] Error:", error);
      throw new Error(error.message);
    }

    return data;
  },

  // GET a specific schedule by ID
  async getScheduleById(schedule_id) {
    console.log("[getScheduleById] Fetching schedule:", schedule_id);

    const { data, error } = await supabase
      .from("prescription_schedules")
      .select("*")
      .eq("schedule_id", schedule_id)
      .single();

    if (error) {
      console.error("[getScheduleById] Error:", error);
      return null;
    }

    return data;
  },

  // UPDATE a schedule
  async updateSchedule(schedule_id, updates) {
    console.log("[updateSchedule] Updating schedule:", { schedule_id, updates });

    const { data, error } = await supabase
      .from("prescription_schedules")
      .update(updates)
      .eq("schedule_id", schedule_id)
      .select()
      .single();

    if (error) {
      console.error("[updateSchedule] Error:", error);
    } else {
      console.log("[updateSchedule] Success:", data);
    }

    return { data, error };
  },

  // DELETE a schedule
  async deleteSchedule(schedule_id) {
    console.log("[deleteSchedule] Deleting schedule:", schedule_id);

    const { data, error } = await supabase
      .from("prescription_schedules")
      .delete()
      .eq("schedule_id", schedule_id);

    if (error) {
      console.error("[deleteSchedule] Error:", error);
    } else {
      console.log("[deleteSchedule] Success");
    }

    return { data, error };
  },

  // DELETE all schedules for a prescription
  async deleteAllSchedulesForPrescription(prescription_id) {
    console.log("[deleteAllSchedulesForPrescription] Deleting all schedules for prescription:", prescription_id);

    const { data, error } = await supabase
      .from("prescription_schedules")
      .delete()
      .eq("prescription_id", prescription_id);

    if (error) {
      console.error("[deleteAllSchedulesForPrescription] Error:", error);
    } else {
      console.log("[deleteAllSchedulesForPrescription] Success");
    }

    return { data, error };
  }

};

export default PrescriptionSchedulesModel;

