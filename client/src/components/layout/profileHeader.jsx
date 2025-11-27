import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// API function to fetch patient by ID
const fetchPatientById = async (uuid) => {
    const { data } = await axiosInstance.get(`/patients/${uuid}`);
    return data.patient;
};

// API function to delete patient
const deletePatient = async (uuid) => {
    const { data } = await axiosInstance.delete(`/patients/delete/${uuid}`);
    return data;
};

const ProfileHeader = ({ recordId }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    // Delete patient mutation
    const deletePatientMutation = useMutation({
        mutationFn: deletePatient,
        onSuccess: () => {
            // Invalidate patients list query
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            // Navigate back to records page
            navigate('/records');
        },
        onError: (error) => {
            console.error('Error deleting patient:', error);
            alert(`Failed to delete patient: ${error.response?.data?.error || error.message}`);
        }
    });

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        deletePatientMutation.mutate(recordId);
        setShowDeleteDialog(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
    };

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
        <>
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-2 mb-4">
                <div className="flex items-center justify-between gap-x-2">
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

                    {/* Delete Button */}
                    <div className="mr-6">
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDeleteClick}
                            disabled={deletePatientMutation.isPending}
                            className="flex items-center gap-2"
                        >
                            {deletePatientMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Delete Patient
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Patient Record</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{fullName}</strong>'s record? 
                            This action cannot be undone and will permanently remove all associated 
                            medical records, consultations, and vitals.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={handleCancelDelete}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ProfileHeader; 