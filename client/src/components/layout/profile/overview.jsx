import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// API function to fetch patient by ID
const fetchPatientById = async (uuid) => {
    const { data } = await axiosInstance.get(`/patients/${uuid}`);
    return data.patient;
};

const Overview = ({ recordId }) => {
    // Fetch patient data
    const { 
        data: patient, 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["patient", recordId],
        queryFn: () => fetchPatientById(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

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
                                        <span className="text-gray-800">September 3, 2025</span>
                                    </div>
                                    <div className="flex justify-between items-start"> 
                                        <span className="text-gray-600">Medical Clearance:</span>
                                        {/* Use conditional coloring based on status:
                                            - text-green-600 for "Fit"
                                            - text-yellow-600 for "At Risk" / "Conditional"
                                            - text-red-600 for "Unfit"
                                        */}
                                        <span className="font-bold text-green-600">Fit</span>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600"> Chronic Risk Factors: </span>
                                        <span className="text-gray-800 text-right font-medium bg-blue-400 rounded-lg px-2 p-1"> Asthma </span>
                                    </div>

                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-600"> Prescribed Medication: </span>
                                        <span className="text-gray-800 text-right"> Fluticasone inhaler </span>
                                    </div>
                                </div>
                            </div>
                        </div>
    )

}

export default Overview; 