import axiosInstance from '@/lib/axiosInstance';


export const fetchAllConsultations = async () => {
  try {
    const { data } = await axiosInstance.get('/consultations/');
    return data.consultations || [];
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return [];
  }
};

export const fetchAllResults = async () => {
  try {
    const { data } = await axiosInstance.get('/results/all');
    return data.results || [];
  } catch (error) {
    console.error('Error fetching results:', error);
    return [];
  }
};

export const fetchAllVitals = async () => {
  try {
    const { data } = await axiosInstance.get('/vitals/');
    return data.vitals || [];
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return [];
  }
};

export const fetchAllPatients = async () => {
  try {
    const { data } = await axiosInstance.get('/patients/');
    return data.patients || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};
