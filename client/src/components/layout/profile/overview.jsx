import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// API function to fetch patient by ID
const fetchPatientById = async (uuid) => {
    const { data } = await axiosInstance.get(`/patients/${uuid}`);
    return data.patient;
};

// API function to fetch consultations by patient UUID
const fetchConsultationsByUUID = async (uuid) => {
    const { data } = await axiosInstance.get(`/consultations/user/${uuid}`);
    return data.consultations || [];
};

// API function to fetch prescriptions by consultation ID
const fetchPrescriptionsByConsultation = async (consultationId) => {
    const { data } = await axiosInstance.get(`/consultations/${consultationId}/prescriptions`);
    return data.prescriptions || [];
};

const Overview = ({ recordId }) => {
    // Fetch patient data
    const { 
        data: patient, 
        isLoading: isLoadingPatient,
        error: patientError 
    } = useQuery({
        queryKey: ["patient", recordId],
        queryFn: () => fetchPatientById(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

    // Fetch consultations for this patient
    const { 
        data: consultations = [], 
        isLoading: isLoadingConsultations 
    } = useQuery({
        queryKey: ["consultations", recordId],
        queryFn: () => fetchConsultationsByUUID(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

    // Get the most recent consultation
    const latestConsultation = consultations.length > 0 ? consultations[0] : null;

    // Fetch prescriptions for the latest consultation
    const { 
        data: prescriptions = [] 
    } = useQuery({
        queryKey: ["prescriptions", latestConsultation?.consultation_id],
        queryFn: () => fetchPrescriptionsByConsultation(latestConsultation.consultation_id),
        enabled: !!latestConsultation?.consultation_id,
        refetchOnWindowFocus: false
    });

    const isLoading = isLoadingPatient || isLoadingConsultations;
    const error = patientError;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Loading patient information...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-12">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <span className="ml-3 text-red-500">Error loading patient data: {error.message}</span>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center p-12">
                <span className="text-gray-500">No patient data available</span>
            </div>
        );
    }

    // Format data for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatAddress = () => {
        const parts = [];
        if (patient.house_number) parts.push(patient.house_number);
        if (patient.street_name) parts.push(patient.street_name);
        if (patient.barangay) parts.push(patient.barangay);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    };

    const emergencyName = `${patient.emergency_first_name || ''} ${patient.emergency_middle_name ? patient.emergency_middle_name + ' ' : ''}${patient.emergency_last_name || ''}`.trim() || 'N/A';

    // Helper function to determine medical clearance status and color
    const getMedicalClearanceInfo = () => {
        if (!latestConsultation) return { status: 'N/A', color: 'text-gray-500' };
        
        const clearance = latestConsultation.medical_clearance;
        
        // Match the database schema values: 'Normal', 'At Risk', 'Critical'
        if (clearance === 'Normal') {
            return { status: 'Normal', color: 'text-green-600' };
        } else if (clearance === 'Critical') {
            return { status: 'Critical', color: 'text-red-600' };
        } else if (clearance === 'At Risk') {
            return { status: 'At Risk', color: 'text-yellow-600' };
        }
        
        return { status: clearance || 'N/A', color: 'text-gray-500' };
    };

    const medicalClearance = getMedicalClearanceInfo();

    // Get chronic risk factors from latest consultation
    // chronic_risk_factor is an array in the database
    const chronicFactors = latestConsultation?.chronic_risk_factor 
        ? (Array.isArray(latestConsultation.chronic_risk_factor) 
            ? latestConsultation.chronic_risk_factor.join(', ') 
            : latestConsultation.chronic_risk_factor)
        : 'None';
    
    // Get prescribed medications from prescriptions
    const medicationsList = prescriptions.length > 0 
        ? prescriptions.map(p => p.medication_name).join(', ') 
        : 'None';

    return (
                        <div className="grid grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="text-gray-800">{formatDate(patient.date_of_birth)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Year Level:</span>
                                        <span className="text-gray-800">{patient.year || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Department:</span>
                                        <span className="text-gray-800">{patient.department || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Course:</span>
                                        <span className="text-gray-800">{patient.course || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Address:</span>
                                        <span className="text-gray-800 text-right">{formatAddress()}</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Emergency Contact</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="text-gray-800">{emergencyName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Relationship:</span>
                                        <span className="text-gray-800">{patient.emergency_relationship || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Contact No:</span>
                                        <span className="text-gray-800">{patient.emergency_contact_number || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                        {/* Health Summary */}
                        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Health Summary</h2>
                                
                                <div className="space-y-4"> 
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600">Latest Check-up:</span>
                                        <span className="text-gray-800">
                                            {latestConsultation 
                                                ? formatDate(latestConsultation.date_of_check) 
                                                : 'No consultations yet'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start"> 
                                        <span className="text-gray-600">Medical Clearance:</span>
                                        <span className={`font-bold ${medicalClearance.color}`}>
                                            {medicalClearance.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-start gap-3">
                                        <span className="text-gray-600 whitespace-nowrap">Chronic Risk Factors:</span>
                                        {chronicFactors !== 'None' ? (
                                            <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                                                {(Array.isArray(latestConsultation?.chronic_risk_factor)
                                                    ? latestConsultation.chronic_risk_factor
                                                    : chronicFactors.split(',').map(f => f.trim())
                                                ).map((factor, idx) => (
                                                    <span
                                                        key={`${factor}-${idx}`}
                                                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300"
                                                    >
                                                        {factor}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-gray-800">None</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600">Prescribed Medication:</span>
                                        <span className="text-gray-800 text-right max-w-[60%]">
                                            {medicationsList}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
    )

}

export default Overview; 