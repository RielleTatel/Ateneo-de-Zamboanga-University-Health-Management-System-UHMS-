/**
 * Dashboard API Layer
 * Centralizes all API calls for the dashboard
 */
import axiosInstance from '@/lib/axiosInstance';

/**
 * Fetch all consultations
 * @returns {Promise<Array>} Array of consultation records
 */
export const fetchAllConsultations = async () => {
  try {
    const { data } = await axiosInstance.get('/consultations/');
    return data.consultations || [];
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
};

/**
 * Fetch all lab results
 * @returns {Promise<Array>} Array of result records
 */
export const fetchAllResults = async () => {
  try {
    const { data } = await axiosInstance.get('/results/all');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};

/**
 * Fetch all vitals
 * @returns {Promise<Array>} Array of vital records
 */
export const fetchAllVitals = async () => {
  try {
    const { data } = await axiosInstance.get('/vitals/');
    return data.vitals || [];
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return [];
  }
};

/**
 * Fetch all patients
 * @returns {Promise<Array>} Array of patient records
 */
export const fetchAllPatients = async () => {
  try {
    const { data } = await axiosInstance.get('/patients/');
    return data.patients || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};
