import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User, Loader2, AlertCircle } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

// API function to fetch patient by ID
const fetchPatientById = async (uuid) => {
    const { data } = await axiosInstance.get(`/patients/${uuid}`);
    return data.patient;
};

const ProfileHeader = ({ recordId }) => {
    // Fetch patient data
    const { 
        data: patient, 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["patient", recordId],
        queryFn: () => fetchPatientById(recordId),
        enabled: !!recordId, // Only fetch if recordId exists
        refetchOnWindowFocus: false
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 mb-4">
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className="text-gray-600">Loading patient data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 mb-4">
                <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-6 h-6" />
                    <span>Error loading patient data: {error.message}</span>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 mb-4">
                <div className="text-gray-500">No patient data available</div>
            </div>
        );
    }

    // Format the full name
    const fullName = `${patient.first_name || ''} ${patient.middle_name ? patient.middle_name + ' ' : ''}${patient.last_name || ''}`.trim();
    
    // Format role for display
    const role = (patient.role || 'Student').toUpperCase();

    // Get age or calculate from date of birth
    const displayAge = patient.age || 'N/A';

    // Get sex - format to display first letter
    const displaySex = patient.sex ? patient.sex.charAt(0).toUpperCase() : 'N/A';

    // Format phone number
    const displayPhone = patient.phone_number || 'N/A';

    // Get ID number
    const displayIdNumber = patient.id_number || 'N/A';

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-2 mb-4">
            <div className="flex items-center gap-x-2">
                {/* Logo Container */}
                <div className="ml-5 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-text-primary" />
                 </div>
                    {/* Text Container */}
                        <div className="flex flex-col items-start justify-center ml-4">
                            {/* Name row */}
                            <div className="flex items-center gap-x-3 text-left w-full h-[48px] ">
                                <h1 className="text-2xl font-bold text-text-primary leading-tight p-0 m-0">
                                    {fullName || 'Unknown Patient'}
                                </h1>
                                <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full font-medium">
                                    {role}
                                </span>
                            </div>
                            {/* Details row */}    
                            <div className="flex gap-x-8 text-text-primary mb-1">
                                <span> ID: {displayIdNumber} </span>
                                <span> Age: {displayAge} </span>
                                <span> Sex: {displaySex} </span>
                                <span> Contact No: {displayPhone} </span>
                            </div>
                         </div>
                </div>
            </div>
    )
}

export default ProfileHeader; 