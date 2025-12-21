import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartPlus, Eye, Trash2, Loader2, AlertCircle, ChevronDown, Printer, Calendar, User, FileText, Pill, Clock, Activity, AlertTriangle, Lock } from "lucide-react";  
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/context/AuthContext";
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const fetchConsultationsByPatient = async (uuid) => {
    const { data } = await axiosInstance.get(`/consultations/user/${uuid}`);
    return data.consultations;
};

const fetchPatientByUUID = async (uuid) => {
    const { data } = await axiosInstance.get(`/patients/${uuid}`);
    return data.patient;
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

// PDF Styles
const pdfStyles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 10,
        fontFamily: 'Helvetica',
        size: [595.28, 700], // A4 width (595.28) x shorter height (700 instead of 841.89)
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#000',
    },
    headerTop: {
        textAlign: 'center',
        marginBottom: 8,
    },
    doctorName: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    headerDetail: {
        fontSize: 8,
        color: '#333',
        marginBottom: 2,
    },
    prescriptionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 15,
        textDecoration: 'underline',
    },
    patientSection: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    patientIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#D3D3D3',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #D3D3D3',
    },
    patientIconText: {
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    patientInfo: {
        flex: 1,
    },
    patientRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    patientLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        width: 100,
    },
    patientValue: {
        fontSize: 9,
        flex: 1,
    },
    table: {
        display: 'table',
        width: 'auto',
        marginTop: 10,
        marginBottom: 60,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#000',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        borderBottomStyle: 'solid',
        minHeight: 35,
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
        minHeight: 30,
    },
    tableColMed: {
        width: '40%',
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
    },
    tableColSchedule: {
        width: '35%',
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: '#000',
        borderRightStyle: 'solid',
    },
    tableColQty: {
        width: '25%',
        padding: 8,
    },
    tableCellHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'center',
    },
    tableCellMedName: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    tableCellSubtext: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2,
    },
    tableCellSchedule: {
        fontSize: 8,
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 50,
        right: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerLeft: {
        fontSize: 8,
        color: '#333',
    },
    footerRight: {
        fontSize: 8,
        textAlign: 'right',
    },
    footerLabel: {
        fontWeight: 'bold',
        marginBottom: 2,
    },
});

// Helper function to check if meal time matches category
const checkMealTime = (mealTime, category) => {
    if (!mealTime) return false;
    const time = mealTime.toLowerCase().trim();
    
    switch(category) {
        case 'breakfast':
            return time.includes('breakfast');
        case 'lunch':
            return time.includes('lunch');
        case 'dinner':
            return time.includes('dinner');
        default:
            return false;
    }
};

// PDF Document Component
const PrescriptionPDF = ({ patient, encounter, prescriptions }) => {
    // Calculate patient age
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // Process prescriptions  
    const processedPrescriptions = prescriptions.map(prescription => {
        const schedules = prescription.schedules || [];
        
        // Get all schedule times as a formatted string
        const scheduleText = schedules.map(s => {
            const time = s.meal_time || '';
            const dose = s.dosage || '';
            return `${time}${dose ? ` (${dose})` : ''}`;
        }).join('\n');
        
        // Get dosage info - combine all unique dosages
        const dosages = [...new Set(schedules.map(s => s.dosage).filter(Boolean))];
        const dosageInfo = dosages.length > 0 ? dosages.join(' / ') : '';
            
        return {
            medication_name: prescription.medication_name,
            instructions: prescription.instructions || '',
            dosage: dosageInfo,
            schedule: scheduleText || 'As prescribed',
            quantity: prescription.quantity || 'As needed'
        };
    });

    return (
        <Document>
            <Page style={pdfStyles.page}>
                {/* Header */}
                <View style={pdfStyles.header}>
                    <View style={pdfStyles.headerTop}>
                        <Text style={pdfStyles.doctorName}>FR. ALBERTO "TEX" PAUROM, SJ</Text>
                        <Text style={pdfStyles.headerDetail}>Internal Medicine</Text>
                        <Text style={pdfStyles.headerDetail}>University Chaplain</Text>
                        <Text style={pdfStyles.headerDetail}>La Purisima, Ateneo de Zamboanga University, Zamboanga City</Text>
                    </View>
                    
                    <Text style={pdfStyles.prescriptionTitle}>MEDICAL PRESCRIPTION</Text>
                </View>

                {/* Patient Information with Icon */}
                <View style={pdfStyles.patientSection}>
                    <View style={pdfStyles.patientIcon}>
                        <Text style={pdfStyles.patientIconText}>
                            {patient?.first_name?.charAt(0)?.toUpperCase() || patient?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </Text>
                    </View>
                    <View style={pdfStyles.patientInfo}>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Patient Name:</Text>
                            <Text style={pdfStyles.patientValue}>
                                {patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || 'N/A'}
                            </Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Age:</Text>
                            <Text style={pdfStyles.patientValue}>{calculateAge(patient?.date_of_birth)}</Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Sex:</Text>
                            <Text style={pdfStyles.patientValue}>{patient?.sex || 'N/A'}</Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Date Generated:</Text>
                            <Text style={pdfStyles.patientValue}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                        </View>
                    </View>
                </View>

                {/* Prescription Table */}
                {processedPrescriptions.length > 0 ? (
                    <View style={pdfStyles.table}>
                        {/* Table Header */}
                        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
                            <View style={pdfStyles.tableColMed}>
                                <Text style={pdfStyles.tableCellHeader}>Medicine</Text>
                            </View>
                            <View style={pdfStyles.tableColSchedule}>
                                <Text style={pdfStyles.tableCellHeader}>Schedule</Text>
                            </View>
                            <View style={pdfStyles.tableColQty}>
                                <Text style={pdfStyles.tableCellHeader}>Quantity</Text>
                            </View>
                        </View>

                        {/* Table Rows */}
                        {processedPrescriptions.map((prescription, index) => (
                            <View key={index} style={pdfStyles.tableRow}>
                                {/* Medicine Column */}
                                <View style={pdfStyles.tableColMed}>
                                    <Text style={pdfStyles.tableCellMedName}>
                                        {prescription.medication_name}
                                    </Text>
                                    {prescription.instructions && (
                                        <Text style={pdfStyles.tableCellSubtext}>
                                            {prescription.instructions}
                                        </Text>
                                    )}
                                </View>
                                
                                {/* Schedule Column */}
                                <View style={pdfStyles.tableColSchedule}>
                                    <Text style={pdfStyles.tableCellSchedule}>
                                        {prescription.schedule}
                                    </Text>
                                </View>
                                
                                {/* Quantity Column */}
                                <View style={pdfStyles.tableColQty}>
                                    <Text style={pdfStyles.tableCell}>
                                        {prescription.quantity}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text>No prescriptions available</Text>
                )}

                {/* Footer */}
                <View style={pdfStyles.footer}>
                    <View style={pdfStyles.footerLeft}>
                        <Text style={pdfStyles.footerLabel}> For follow-up consult</Text>
                        <Text style={pdfStyles.footerLabel}>Please contact us on:</Text>
                        <Text>+63 917 123 4567</Text>
                    </View>
                    <View style={pdfStyles.footerRight}>
                        <Text style={pdfStyles.footerLabel}>FR. ALBERTO "TEX" PAUROM, SJ</Text>
                        <Text>Lic. No.: 0123456</Text>
                        <Text>PTR No.: 7891011</Text>
                        <Text>S2 No.: 1213141</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

// Medical Certificate PDF Component
const MedicalCertificatePDF = ({ patient, encounter, diagnosis, remarks }) => {
    // Calculate patient age
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatAddress = () => {
        const parts = [];
        if (patient.house_number) parts.push(patient.house_number);
        if (patient.street_name) parts.push(patient.street_name);
        if (patient.barangay) parts.push(patient.barangay);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
    };

    return (
        <Document>
            <Page style={pdfStyles.page}>
                {/* Header */}
                <View style={pdfStyles.header}>
                    <View style={pdfStyles.headerTop}>
                        <Text style={pdfStyles.doctorName}>FR. ALBERTO "TEX" PAUROM, SJ</Text>
                        <Text style={pdfStyles.headerDetail}>Internal Medicine</Text>
                        <Text style={pdfStyles.headerDetail}>University Chaplain</Text>
                        <Text style={pdfStyles.headerDetail}>La Purisima, Ateneo de Zamboanga University, Zamboanga City</Text>
                    </View>
                    
                    <Text style={pdfStyles.prescriptionTitle}>MEDICAL CERTIFICATE</Text>
                </View>

                {/* Patient Information with Icon */}
                <View style={pdfStyles.patientSection}>
                    <View style={pdfStyles.patientIcon}>
                        <Text style={pdfStyles.patientIconText}>
                            {patient?.first_name?.charAt(0)?.toUpperCase() || patient?.name?.charAt(0)?.toUpperCase() || 'P'}
                        </Text>
                    </View>
                    <View style={pdfStyles.patientInfo}>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Patient Name:</Text>
                            <Text style={pdfStyles.patientValue}>
                                {patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || 'N/A'}
                            </Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Age:</Text>
                            <Text style={pdfStyles.patientValue}>{calculateAge(patient?.date_of_birth)}</Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Sex:</Text>
                            <Text style={pdfStyles.patientValue}>{patient?.sex || 'N/A'}</Text>
                        </View>
                        <View style={pdfStyles.patientRow}>
                            <Text style={pdfStyles.patientLabel}>Date Generated:</Text>
                            <Text style={pdfStyles.patientValue}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                        </View>
                    </View>
                </View>

                {/* Certificate Content */}
                <View style={{ marginBottom: 60, marginTop: 10 }}>
                    <Text style={{ fontSize: 10, lineHeight: 1.6, textAlign: 'justify', marginBottom: 20 }}>
                        This is to certify that{' '}
                        <Text style={{ fontWeight: 'bold' }}>
                            {patient?.name || `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim() || 'N/A'}
                        </Text>
                        , {calculateAge(patient?.date_of_birth)} years old, {patient?.sex || 'N/A'}, of {formatAddress()}, was examined on{' '}
                        <Text style={{ fontWeight: 'bold' }}>{formatDate(encounter.date_of_check)}</Text> due to the following:
                    </Text>

                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Diagnosis:</Text>
                        <Text style={{ fontSize: 10, lineHeight: 1.5, marginLeft: 20 }}>{diagnosis || 'N/A'}</Text>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>Remarks:</Text>
                        <Text style={{ fontSize: 10, lineHeight: 1.5, marginLeft: 20 }}>{remarks || 'N/A'}</Text>
                    </View>

                    <Text style={{ fontSize: 10, lineHeight: 1.6, textAlign: 'justify' }}>
                        This certificate is being issued upon the request of the above-mentioned name for whatever purpose it may serve (excluding legal matters).
                    </Text>
                </View>

                {/* Footer */}
                <View style={pdfStyles.footer}>
                    <View style={pdfStyles.footerLeft}>
                        <Text style={pdfStyles.footerLabel}>For follow-up consult</Text>
                        <Text style={pdfStyles.footerLabel}>Please contact us on:</Text>
                        <Text>+63 917 123 4567</Text>
                    </View>
                    <View style={pdfStyles.footerRight}>
                        <Text style={pdfStyles.footerLabel}>FR. ALBERTO "TEX" PAUROM, SJ</Text>
                        <Text>Lic. No.: 0123456</Text>
                        <Text>PTR No.: 7891011</Text>
                        <Text>S2 No.: 1213141</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const Encounters = ({ recordId }) => { 
    const queryClient = useQueryClient();
    const { canAccessConsultation } = useAuth();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedEncounter, setSelectedEncounter] = useState(null); 
    const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sortOrder, setSortOrder] = useState("recent");
    const [isMedCertModalOpen, setIsMedCertModalOpen] = useState(false);
    const [medCertData, setMedCertData] = useState({ diagnosis: '', remarks: '' });

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
        
        // Fetch patient information
        try {
            const patient = await fetchPatientByUUID(recordId);
            setSelectedPatient(patient);
        } catch (error) {
            console.error("Error fetching patient:", error);
            setSelectedPatient(null);
        }
        
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
        
        // Open modal AFTER fetching data
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        // Don't clear the data immediately - let it persist for smooth closing animation
    }; 

    const handleDeleteEncounter = (e, consultation_id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this encounter?")) {
            deleteEncounterMutation.mutate(consultation_id);
        }
    };

    const handlePrintPrescription = async (encounter) => {
        try {
            // Fetch patient data
            const patient = await fetchPatientByUUID(recordId);
            
            // Fetch prescriptions
            const prescriptions = await fetchPrescriptionsByConsultation(encounter.consultation_id);
            
            // Fetch schedules for each prescription
            const prescriptionsWithSchedules = await Promise.all(
                prescriptions.map(async (prescription) => {
                    const schedules = await fetchSchedulesByPrescription(prescription.prescription_id);
                    return { ...prescription, schedules };
                })
            );
            
            // Generate and download PDF
            const blob = await pdf(
                <PrescriptionPDF 
                    patient={patient}
                    encounter={encounter}
                    prescriptions={prescriptionsWithSchedules}
                />
            ).toBlob();
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `prescription_${encounter.consultation_id}_${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate prescription PDF. Please try again.");
        }
    };

    const handleOpenMedCertModal = (encounter) => {
        setSelectedEncounter(encounter);
        setMedCertData({ diagnosis: '', remarks: '' });
        setIsMedCertModalOpen(true);
    };

    const handlePrintMedicalCertificate = async () => {
        try {
            // Fetch patient data
            const patient = await fetchPatientByUUID(recordId);
            
            // Generate and download PDF
            const blob = await pdf(
                <MedicalCertificatePDF 
                    patient={patient}
                    encounter={selectedEncounter}
                    diagnosis={medCertData.diagnosis}
                    remarks={medCertData.remarks}
                />
            ).toBlob();
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `medical_certificate_${selectedEncounter.consultation_id}_${new Date().toISOString().split('T')[0]}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            
            setIsMedCertModalOpen(false);
        } catch (error) {
            console.error("Error generating medical certificate:", error);
            alert("Failed to generate medical certificate. Please try again.");
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
                                            
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                                        title="More Actions"
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56 p-2" align="end">
                                                    {canAccessConsultation() ? (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handlePrintPrescription(encounter);
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                                                            >
                                                                <Printer className="w-4 h-4" />
                                                                <span>Print Prescription</span>
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenMedCertModal(encounter);
                                                                }}
                                                                className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors w-full text-left"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                                <span>Print Medical Certificate</span>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                                                            <Lock className="w-4 h-4 text-red-500" />
                                                            <span className="text-xs text-gray-500">Print options available to doctors and admins only</span>
                                                        </div>
                                                    )}
                                                </PopoverContent>
                                            </Popover>

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
        
            <Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModal}>
                <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    {selectedEncounter ? (
                        <div className="space-y-6">
                            <DialogHeader className="pb-2">
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Encounter Details
                                </DialogTitle>
                                <div className="flex items-center gap-4 mt-3 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span className="font-medium">{formatDate(selectedEncounter.date_of_check)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-gray-600" />
                                        <span className="text-gray-600"> Medical Clearance: </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            selectedEncounter.medical_clearance === 'Normal' 
                                                ? 'bg-green-100 text-green-700' 
                                                : selectedEncounter.medical_clearance === 'Critical'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {selectedEncounter.medical_clearance || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2"> 

                                        <div className="flex flex-row"> 
                                            <span className="text-gray-600 text-bold"> Risk Factors: </span>
                                        </div>

                                        {selectedEncounter.chronic_risk_factor && selectedEncounter !== 'None' && (
                                            <div className="flex flex-wrap gap-2 ">
                                                {Array.isArray(selectedEncounter.chronic_risk_factor) 
                                                    ? selectedEncounter.chronic_risk_factor.map((factor, index) => (
                                                        <span 
                                                            key={index}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-full font-medium bg-orange-100 text-orange-800 border border-orange-300"
                                                        >
                                                            {factor}
                                                        </span>
                                                    ))
                                                    : <span className="inline-flex items-center px-3 py-1.5 rounded-full font-medium bg-orange-100 text-orange-800 border border-orange-300">
                                                        {selectedEncounter.chronic_risk_factor}
                                                    </span>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogHeader> 

                            {/* Clinical Information Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                {/* Chief Complaint */}
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="h-5 w-5 text-gray-700" />
                                        <h3 className="text-base font-semibold text-gray-900">Chief Complaint / Symptoms</h3>
                                    </div>
                                    <p className="text-[15px] text-gray-700 leading-relaxed pl-7">
                                        {selectedEncounter.symptoms || 'No symptoms recorded'}
                                    </p>
                                </div>

                                {/* Medical History */}
                                {selectedEncounter.history && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText className="h-5 w-5 text-gray-700" />
                                            <h3 className="text-base font-semibold text-gray-900">Medical History</h3>
                                        </div>
                                        <p className="text-[15px] text-gray-700 whitespace-pre-wrap leading-relaxed pl-7">
                                            {selectedEncounter.history}
                                        </p>
                                    </div>
                                )}

                                {/* Remarks Section */}
                                {selectedEncounter.remarks && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText className="h-5 w-5 text-gray-700" />
                                            <h3 className="text-base font-semibold text-gray-900">Remarks</h3>
                                        </div>
                                        <p className="text-[15px] text-gray-700 whitespace-pre-wrap leading-relaxed pl-7">
                                            {selectedEncounter.remarks}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Prescriptions Section */}
                            {selectedPrescriptions && selectedPrescriptions.length > 0 ? (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Pill className="h-5 w-5 text-gray-700" />
                                        <h3 className="text-base font-semibold text-gray-900">Prescribed Medications</h3>
                                    </div>
                                    <div className="overflow-hidden rounded-lg border border-gray-200">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                                                    <TableHead className="font-semibold text-gray-900 text-[15px]">Medication</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 text-[15px]">Dosage</TableHead>
                                                    <TableHead className="font-semibold text-gray-900 text-[15px]">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            Meal Time
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900 text-[15px]">Instructions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedPrescriptions.map((prescription, index) => (
                                                    prescription.schedules && prescription.schedules.length > 0 ? (
                                                        prescription.schedules.map((schedule, schedIndex) => (
                                                            <TableRow key={`${prescription.prescription_id}-${schedIndex}`} className="hover:bg-gray-50 border-gray-200">
                                                                <TableCell className={`text-[15px] border-gray-200 ${schedIndex === 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                                                    {schedIndex === 0 ? prescription.medication_name : ''}
                                                                </TableCell>
                                                                <TableCell className="text-[15px] text-gray-700 border-gray-200">
                                                                    {schedule.dosage || '—'}
                                                                </TableCell>
                                                                <TableCell className="border-gray-200">
                                                                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md text-[13px] font-medium">
                                                                        {schedule.meal_time || 'N/A'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-[15px] text-gray-700 border-gray-200">
                                                                    {schedIndex === 0 ? (prescription.instructions || '—') : ''}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow key={prescription.prescription_id} className="hover:bg-gray-50 border-gray-200">
                                                            <TableCell className="font-semibold text-[15px] text-gray-900 border-gray-200">
                                                                {prescription.medication_name}
                                                            </TableCell>
                                                            <TableCell className="text-[15px] text-gray-500 border-gray-200">—</TableCell>
                                                            <TableCell className="text-[15px] text-gray-500 border-gray-200">—</TableCell>
                                                            <TableCell className="text-[15px] text-gray-700 border-gray-200">
                                                                {prescription.instructions || '—'}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <Pill className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-gray-500 text-sm">No prescriptions recorded for this encounter</p>
                                </div>
                            )}

                            {/* Footer */}
                            <DialogFooter className="pt-2">
                                <Button 
                                    variant="outline" 
                                    onClick={handleCloseViewModal}
                                    className="px-6"
                                >
                                    Close
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                            <DialogTitle className="text-lg font-semibold mb-2">Error Loading Data</DialogTitle>
                            <DialogDescription>
                                No encounter data found. Please close and try again.
                            </DialogDescription>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* --- MEDICAL CERTIFICATE MODAL --- */}
            <Dialog open={isMedCertModalOpen} onOpenChange={setIsMedCertModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Medical Certificate Information</DialogTitle>
                        <DialogDescription>
                            Please provide the diagnosis and remarks for the medical certificate.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Diagnosis *</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px] text-sm"
                                placeholder="Enter diagnosis..."
                                value={medCertData.diagnosis}
                                onChange={(e) => setMedCertData(prev => ({ ...prev, diagnosis: e.target.value }))}
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Remarks *</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[100px] text-sm"
                                placeholder="Enter remarks..."
                                value={medCertData.remarks}
                                onChange={(e) => setMedCertData(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsMedCertModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handlePrintMedicalCertificate}
                            disabled={!medCertData.diagnosis.trim() || !medCertData.remarks.trim()}
                            style={{ backgroundColor: '#0033A0' }}
                        >
                            Generate Certificate
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div> 
    );
}; 

export default Encounters;

