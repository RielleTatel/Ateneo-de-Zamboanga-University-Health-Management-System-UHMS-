import PatientModel from "../models/patientModel.js";
import supabase from "../config/supabaseClient.js";

const PatientController = {

  async getAllPatients(req, res) {
    try {
      const patients = await PatientModel.getAllPatients();

      if (!patients || patients.length === 0) {
        return res.json({ 
          success: true, 
          message: "No patients found.",
          patients: []
        });
      }   

      // Return only necessary fields for the Records page
      const patientsSanitized = patients.map(patient => ({
        id: patient.uuid,
        uuid: patient.uuid,
        patient_id: patient.patient_id,
        id_number: patient.id_number,
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

      const patient = await PatientModel.findById(uuid);

      if (!patient) {
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
      res.status(500).json({ 
        success: false, 
        error: err.message
      });
    }
  },

  async addPatient(req, res) {
    try {
      const patientData = req.body;
      const { data, error } = await PatientModel.insertPatient(patientData);

      if (error) {
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      res.status(201).json({
        success: true,
        message: "Patient created successfully",
        patient: data
      });

    } catch (err) {
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

      const { data, error } = await PatientModel.updatePatient(uuid, updateData);

      if (error) {
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      res.json({
        success: true,
        message: "Patient updated successfully",
        patient: data
      });

    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  },

  async deletePatient(req, res) {
    try {
      const { uuid } = req.params;

      const { error } = await PatientModel.deletePatient(uuid);

      if (error) {
        return res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }

      res.json({
        success: true,
        message: "Patient deleted successfully"
      });

    } catch (err) {
      res.status(500).json({ 
        success: false, 
        error: err.message 
      });
    }
  }

};

export default PatientController;
