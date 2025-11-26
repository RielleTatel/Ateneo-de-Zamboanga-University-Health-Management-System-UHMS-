import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartPlus, Eye, Trash2, Loader2, AlertCircle } from "lucide-react";  
import axiosInstance from "@/lib/axiosInstance";

// API Functions
const fetchConsultationsByPatient = async (uuid) => {
    const { data } = await axiosInstance.get(`/consultations/user/${uuid}`);
    return data.consultations;
};

const fetchPrescriptionsByConsultation = async (consultation_id) => {
    const { data } = await axiosInstance.get(`/consultations/${consultation_id}/prescriptions`);
    return data.prescriptions || [];
};

const fetchSchedulesByPrescription = async (prescription_id) => {
    const { data } = await axiosInstance.get(`/prescriptions/${prescription_id}/schedules`);
    return data.schedules || [];
};

const deleteConsultation = async (consultation_id) => {
    const { data } = await axiosInstance.delete(`/consultations/delete/${consultation_id}`);
    return data;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
};

const Encounters = ({ recordId }) => { 
    const queryClient = useQueryClient();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedEncounter, setSelectedEncounter] = useState(null); 
    const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
    const [sortOrder, setSortOrder] = useState("recent");

    // Fetch consultations for the patient
    const { 
        data: encounters = [], 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["consultations", recordId],
        queryFn: () => fetchConsultationsByPatient(recordId),
        enabled: !!recordId,
        refetchOnWindowFocus: false
    });

    // Delete consultation mutation
    const deleteEncounterMutation = useMutation({
        mutationFn: deleteConsultation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["consultations", recordId] });
        }
    });

    const handleOpenViewModal = async (encounter) => {
        setSelectedEncounter(encounter);
        setIsViewModalOpen(true);
        
        // Fetch prescriptions for this consultation
        try {
            const prescriptions = await fetchPrescriptionsByConsultation(encounter.consultation_id);
            
            // For each prescription, fetch its schedules
            const prescriptionsWithSchedules = await Promise.all(
                prescriptions.map(async (prescription) => {
                    const schedules = await fetchSchedulesByPrescription(prescription.prescription_id);
                    return { ...prescription, schedules };
                })
            );
            
            setSelectedPrescriptions(prescriptionsWithSchedules);
        } catch (error) {
            console.error("Error fetching prescriptions:", error);
            setSelectedPrescriptions([]);
        }
    }; 

    const handleDeleteEncounter = (e, consultation_id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this encounter?")) {
            deleteEncounterMutation.mutate(consultation_id);
        }
    };

    // Sort encounters based on selected order
    const sortedEncounters = [...encounters].sort((a, b) => {
        switch (sortOrder) {
            case "recent":
                return new Date(b.date_of_check) - new Date(a.date_of_check);
            case "oldest":
                return new Date(a.date_of_check) - new Date(b.date_of_check);
            case "date":
                return new Date(b.date_of_check) - new Date(a.date_of_check);
            default:
                return 0;
        }
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="ml-3 text-gray-600">Loading consultation records...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                <div className="flex items-center justify-center p-12">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <span className="ml-3 text-red-500">Error loading consultations: {error.message}</span>
                </div>
            </div>
        );
    }

    return ( 
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* FIRST LAYER */}
            <div className="flex justify-between items-center gap-2 mb-6"> 
                <p className="text-xl font-bold"> Notes </p> 
                {/* --- Drop down button --- */}  
                <div className="flex items-center gap-4">  
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent"> Most Recent</SelectItem>
                            <SelectItem value="oldest"> Oldest First</SelectItem>
                            <SelectItem value="date"> By Date</SelectItem>
                        </SelectContent>
                    </Select>    
                </div>      
            </div>  
        
            {/* --- TABLE CONTAINER --- */}  
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                {sortedEncounters.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 hover:bg-gray-50 border-outline">
                                <TableHead className="w-[100px] font-semibold text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <HeartPlus className="w-4 h-4" />
                                        Encounter
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                                <TableHead className="font-semibold text-gray-700">Medical Clearance</TableHead>
                                <TableHead className="font-semibold text-gray-700">Chief Complaint</TableHead>
                                <TableHead className="w-[120px] text-center font-semibold text-gray-700">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedEncounters.map((encounter) => (
                                <TableRow 
                                    key={encounter.consultation_id}
                                    className="cursor-pointer hover:bg-blue-50/50 transition-colors border-outline"
                                    onClick={() => handleOpenViewModal(encounter)}
                                >
                                    <TableCell className="font-medium text-gray-900">
                                        #{encounter.consultation_id}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {formatDate(encounter.date_of_check)}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            encounter.medical_clearance === 'Fit' 
                                                ? 'bg-green-100 text-green-800' 
                                                : encounter.medical_clearance === 'Unfit'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {encounter.medical_clearance || 'N/A'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-600 max-w-md">
                                        <div className="truncate" title={encounter.symptoms}>
                                            {encounter.symptoms || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenViewModal(encounter);
                                                }}
                                                className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteEncounter(e, encounter.consultation_id)}
                                                disabled={deleteEncounterMutation.isPending}
                                                className="p-2 hover:bg-red-100 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="p-12 text-center">
                        <HeartPlus className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">No encounter records found</p>
                        <p className="text-sm text-gray-400 mt-1">Add a new encounter to get started</p>
                    </div>
                )}
            </div>
        
            {/* --- VIEW MODAL --- */}   
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent 
                    className="
                        sm:max-w-3xl     
                        w-full
                        h-[90vh]          
                        overflow-y-auto
                        py-8 px-6         
                        text-[17px]     
                    "
                >
                    {selectedEncounter ? (
                        <>
                            {/* Modal Header */}
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                    Encounter Details
                                </DialogTitle>
                            </DialogHeader>

                            {/* Date and Medical Clearance */}
                            <div>
                                <p className="text-lg font-semibold text-gray-800">
                                    Visit on {formatDate(selectedEncounter.date_of_check)}
                                </p>
                                <p className="text-gray-600">
                                    Medical Clearance: 
                                    <span className={`ml-2 font-medium ${
                                        selectedEncounter.medical_clearance === 'Fit' 
                                            ? 'text-green-600' 
                                            : selectedEncounter.medical_clearance === 'Unfit'
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                    }`}>
                                        {selectedEncounter.medical_clearance || 'N/A'}
                                    </span>
                                </p>
                            </div>

                            {/* Main Unified Container */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-8">

                                {/* Symptoms */}
                                <section>
                                    <p className="text-lg font-bold text-gray-700">Chief Complaint / Symptoms</p>
                                    <p className="mt-1 text-gray-900 leading-relaxed">
                                        {selectedEncounter.symptoms || 'N/A'}
                                    </p>
                                </section>

                                {/* Chronic Risk Factors */}
                                <section>
                                    <p className="text-lg font-bold text-gray-700">Chronic Risk Factors</p>
                                    <p className="mt-1 text-gray-900 leading-relaxed">
                                        {selectedEncounter.chronic_risk_factor || 'None'}
                                    </p>
                                </section>

                                {/* History */}
                                <section>
                                    <p className="text-lg font-bold text-gray-700">History</p>
                                    <p className="mt-1 text-gray-900 whitespace-pre-wrap leading-relaxed">
                                        {selectedEncounter.history || 'N/A'}
                                    </p>
                                </section>

                                {/* Prescriptions */}
                                {selectedPrescriptions.length > 0 && (
                                    <section>
                                        <p className="text-lg font-bold text-gray-700 mb-3">Prescriptions</p>
                                        <div className="space-y-4">
                                            {selectedPrescriptions.map((prescription, index) => (
                                                <div key={prescription.prescription_id} className="bg-white border border-gray-300 rounded-lg p-4">
                                                    <p className="font-semibold text-gray-800 mb-2">
                                                        Medication {index + 1}: {prescription.medication_name}
                                                    </p>
                                                    
                                                    <div className="space-y-1 text-gray-900">
                                                        {prescription.quantity && (
                                                            <p><strong>Quantity:</strong> {prescription.quantity}</p>
                                                        )}
                                                        {prescription.instructions && (
                                                            <p><strong>Instructions:</strong> {prescription.instructions}</p>
                                                        )}
                                                        
                                                        {/* Schedules */}
                                                        {prescription.schedules && prescription.schedules.length > 0 && (
                                                            <div className="mt-3">
                                                                <p className="font-semibold text-gray-700 mb-2">Dosage Schedule:</p>
                                                                <div className="space-y-2 ml-4">
                                                                    {prescription.schedules.map((schedule, scheduleIndex) => (
                                                                        <div key={schedule.schedule_id} className="text-sm">
                                                                            <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                                                                                {schedule.meal_time}
                                                                            </span>
                                                                            <span>{schedule.dosage}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                                
                                {/* Legacy Prescription (fallback for old records) */}
                                {selectedPrescriptions.length === 0 && 
                                 (selectedEncounter.prescription_medication_name || 
                                  selectedEncounter.prescription_instructions) && (
                                    <section>
                                        <p className="text-lg font-bold text-gray-700">Prescription (Legacy)</p>
                                        <div className="mt-1 text-gray-900 space-y-2">
                                            {selectedEncounter.prescription_medication_name && (
                                                <p><strong>Medication:</strong> {selectedEncounter.prescription_medication_name}</p>
                                            )}
                                            {selectedEncounter.prescription_dosage && (
                                                <p><strong>Dosage:</strong> {selectedEncounter.prescription_dosage}</p>
                                            )}
                                            {selectedEncounter.prescription_quantity && (
                                                <p><strong>Quantity:</strong> {selectedEncounter.prescription_quantity}</p>
                                            )}
                                            {selectedEncounter.prescription_meal_time && (
                                                <p><strong>Meal Time:</strong> {selectedEncounter.prescription_meal_time}</p>
                                            )}
                                            {selectedEncounter.prescription_instructions && (
                                                <p><strong>Instructions:</strong> {selectedEncounter.prescription_instructions}</p>
                                            )}
                                        </div>
                                    </section>
                                )}

                            </div>

                            {/* Footer */}
                            <DialogFooter className="mt-6">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="text-base px-6 py-2"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <DialogHeader>
                            <DialogTitle>Error</DialogTitle>
                            <DialogDescription>
                                No data found. Please close and try again.
                            </DialogDescription>
                        </DialogHeader>
                    )}
                </DialogContent>
            </Dialog>
        </div> 
    );
}; 

export default Encounters;
