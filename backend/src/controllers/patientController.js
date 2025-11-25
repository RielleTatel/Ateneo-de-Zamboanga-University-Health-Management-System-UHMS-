import PatientModel from "../models/patientModel.js";
import supabase from "../config/supabaseClient.js";

const PatientController = {

  async getAllPatients(req, res) {
    try {
      console.log("Getting all patients..");  

      const patients = await PatientModel.getAllPatients();

      if (!patients || patients.length === 0) {
        console.log("⚠️ No patients found in table");
        return res.json({ 
          success: true, 
          message: "No patients found.",
          patients: []
        });
      }   

      console.log(` ✅ Found ${patients.length} patient(s) in Supabase`);  
      
      // Return only necessary fields for the Records page
      const patientsSanitized = patients.map(patient => ({
        id: patient.uuid,
        uuid: patient.uuid,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
        first_name: patient.first_name,
        last_name: patient.last_name,
        email: patient.school_email,
        position: patient.role || 'Student',
        department: patient.department || 'N/A',
        phone_number: patient.phone_number
      })); 

      res.json({
        success: true,
        message: `Found ${patients.length} patient(s).`,
        patients: patientsSanitized
      });

    } catch (err) {
      console.error("[getAllPatients] ❌ Error:", err.message);
      console.error("[getAllPatients] Full error:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message,
        hint: "Check your Supabase credentials and RLS policies."
      });
    }
  },

  async getPatientById(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[getPatientById] Fetching patient UUID:", uuid);

      const patient = await PatientModel.findById(uuid);

      if (!patient) {
        console.log("⚠️ Patient not found");
        return res.status(404).json({ 
          success: false, 
          message: "Patient not found." 
        });
      }

      res.json({
        success: true,
        message: "Patient found successfully",
        patient
      });

    } catch (err) {
      console.error("[getPatientById] ❌ Error:", err.message);
      res.status(500).json({ 
        success: false, 
        error: err.message
      });
    }
  },

  async addPatient(req, res) {
    try {
      console.log("[addPatient] Creating new patient...");

      const patientData = req.body;
      const { data, error } = await PatientModel.insertPatient(patientData);

      if (error) {
        console.error("[addPatient] Error inserting patient:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[addPatient] Patient created successfully");
      res.status(201).json({
        success: true,
        message: "Patient created successfully",
        patient: data
      });

    } catch (err) {
      console.error("[addPatient] Unexpected error:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async updatePatient(req, res) {
    try {
      const { uuid } = req.params;
      const updateData = req.body;

      console.log("[updatePatient] Updating patient:", { uuid, updateData });

      const { data, error } = await PatientModel.updatePatient(uuid, updateData);

      if (error) {
        console.error("[updatePatient] Error updating patient:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[updatePatient] Patient updated successfully");
      res.json({
        success: true,
        message: "Patient updated successfully",
        patient: data
      });

    } catch (err) {
      console.error("[updatePatient] Unexpected error:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async deletePatient(req, res) {
    try {
      const { uuid } = req.params;
      console.log("[deletePatient] Deleting patient UUID:", uuid);

      const { error } = await PatientModel.deletePatient(uuid);

      if (error) {
        console.error("[deletePatient] Error deleting patient:", error);
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      console.log("[deletePatient] Patient deleted successfully");
      res.json({
        success: true,
        message: "Patient deleted successfully"
      });

    } catch (err) {
      console.error("[deletePatient] Unexpected error:", err);
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

};

export default PatientController;
