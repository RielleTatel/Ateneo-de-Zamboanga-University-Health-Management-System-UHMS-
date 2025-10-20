import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, FileText, Calendar, AlertTriangle } from "lucide-react";

// Mock data for initial reports
const initialReports = [
    {
        id: 1,
        date: '2025-09-03',
        medicalClearanceStatus: 'fit',
        clinicalFindings: 'Slight wheezing in lungs, otherwise normal.',
        diagnosis: 'Asthma - Mild',
        chronicRiskFactors: 'Pollen allergy',
        treatmentPlan: 'Continue current Asthma controller, follow-up if symptoms worsen.',
        medicationPrescribed: 'Fluticasone inhaler — 1 puff BID for maintenance.',
        lifestyleAdvice: 'Avoid known allergens like dust or pollen.',
        nextCheckupDate: '2026-03-03'
    }
];

// Blank form data for adding new reports or clearing the form
const blankForm = {
    date: '',
    medicalClearanceStatus: 'fit',
    clinicalFindings: '',
    diagnosis: '',
    chronicRiskFactors: '',
    treatmentPlan: '',
    medicationPrescribed: '',
    lifestyleAdvice: '',
    nextCheckupDate: ''
};

const Report = () => {
    const [reports, setReports] = useState(initialReports);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    
    // Use a single state for form data (for both add and edit)
    const [formData, setFormData] = useState(blankForm);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const dataToValidate = isEditing ? selectedReport : formData;
        
        // Date validation
        if (!dataToValidate.date) {
            newErrors.date = 'Date is required';
        } else {
            const reportDate = new Date(dataToValidate.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date
            if (reportDate > today && reportDate.toDateString() !== today.toDateString()) {
                newErrors.date = 'Report date cannot be in the future';
            }
        }
        
        // Clinical Findings validation
        if (!dataToValidate.clinicalFindings.trim()) {
            newErrors.clinicalFindings = 'Clinical findings are required';
        } else if (dataToValidate.clinicalFindings.trim().length < 5) {
            newErrors.clinicalFindings = 'Clinical findings must be at least 5 characters';
        }
        
        // Diagnosis validation
        if (!dataToValidate.diagnosis.trim()) {
            newErrors.diagnosis = 'Diagnosis is required';
        } else if (dataToValidate.diagnosis.trim().length < 3) {
            newErrors.diagnosis = 'Diagnosis must be at least 3 characters';
        }
        
        // Treatment Plan validation
        if (!dataToValidate.treatmentPlan.trim()) {
            newErrors.treatmentPlan = 'Treatment plan is required';
        } else if (dataToValidate.treatmentPlan.trim().length < 10) {
            newErrors.treatmentPlan = 'Treatment plan must be at least 10 characters';
        }
        
        // Next Checkup Date validation
        if (dataToValidate.nextCheckupDate && dataToValidate.date) {
            const nextDate = new Date(dataToValidate.nextCheckupDate);
            const reportDate = new Date(dataToValidate.date);
            if (nextDate <= reportDate) {
                newErrors.nextCheckupDate = 'Next checkup date must be after report date';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        const updater = isEditing ? setSelectedReport : setFormData;
        updater(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (isEditing) {
                // Update existing report
                setReports(reports.map(report => 
                    report.id === selectedReport.id ? selectedReport : report
                ));
                console.log('Report updated:', selectedReport);
            } else {
                // Add new report
                const newReport = { ...formData, id: Date.now() };
                setReports([newReport, ...reports]); // Add to the beginning
                console.log('Report submitted:', newReport);
            }
            
            // Close and reset
            setIsAddModalOpen(false);
            setIsViewEditModalOpen(false);
            setIsEditing(false);
            setSelectedReport(null);
            setFormData(blankForm);
            setErrors({});
        }
    };

    const handleOpenAddModal = () => {
        setIsEditing(false);
        setFormData(blankForm);
        setErrors({});
        setIsAddModalOpen(true);
    };

    const handleOpenViewModal = (report) => {
        setSelectedReport(report);
        setIsEditing(false);
        setIsViewEditModalOpen(true);
    };
    
    const handleOpenEditModal = (e, report) => {
        e.stopPropagation(); // Prevent triggering view modal
        setSelectedReport({ ...report }); // Clone report to avoid mutating state directly
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, report) => {
        e.stopPropagation(); // Prevent triggering view modal
        setSelectedReport(report);
        setIsArchiveModalOpen(true);
    };

    const handleArchive = () => {
        setReports(reports.filter(report => report.id !== selectedReport.id));
        setIsArchiveModalOpen(false);
        setSelectedReport(null);
    };

    // Helper to format date string
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' // Add timeZone to avoid off-by-one day
        });
    };

    // Reusable Form Fields component
    const ReportFormFields = ({ data, onInputChange }) => (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Date and Medical Clearance Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Date *</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => onInputChange('date', e.target.value)}
                                    className={errors.date ? 'border-red-500' : ''}
                                />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Medical Clearance Status</FieldLabel>
                        <FieldContent>
                            <Select value={data.medicalClearanceStatus} onValueChange={(value) => onInputChange('medicalClearanceStatus', value)}>
                                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fit">Fit</SelectItem>
                                    <SelectItem value="unfit">Unfit</SelectItem>
                                    <SelectItem value="conditional">Conditional</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
                {/* ... other form fields ... */}
                <Field>
                    <FieldLabel>Clinical Findings *</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Slight wheezing in lungs" value={data.clinicalFindings} onChange={(e) => onInputChange('clinicalFindings', e.target.value)} rows={2} className={errors.clinicalFindings ? 'border-red-500' : ''} />
                        {errors.clinicalFindings && <p className="text-red-500 text-sm mt-1">{errors.clinicalFindings}</p>}
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Diagnosis *</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Asthma - Mild" value={data.diagnosis} onChange={(e) => onInputChange('diagnosis', e.target.value)} rows={2} className={errors.diagnosis ? 'border-red-500' : ''} />
                        {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>}
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Chronic Risk Factors</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="No Significant Factors" value={data.chronicRiskFactors} onChange={(e) => onInputChange('chronicRiskFactors', e.target.value)} rows={2} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Treatment Plan *</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Continue current Asthma controller..." value={data.treatmentPlan} onChange={(e) => onInputChange('treatmentPlan', e.target.value)} rows={2} className={errors.treatmentPlan ? 'border-red-500' : ''} />
                        {errors.treatmentPlan && <p className="text-red-500 text-sm mt-1">{errors.treatmentPlan}</p>}
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Medication Prescribed</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Fluticasone inhaler..." value={data.medicationPrescribed} onChange={(e) => onInputChange('medicationPrescribed', e.target.value)} rows={2} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Lifestyle Advice</FieldLabel>
                    <FieldContent>
                        <Textarea placeholder="Avoid allergens..." value={data.lifestyleAdvice} onChange={(e) => onInputChange('lifestyleAdvice', e.target.value)} rows={2} />
                    </FieldContent>
                </Field>
                <Field>
                    <FieldLabel>Next Checkup Date</FieldLabel>
                    <FieldContent>
                        <div className="relative">
                            <Input type="date" value={data.nextCheckupDate} onChange={(e) => onInputChange('nextCheckupDate', e.target.value)} className={errors.nextCheckupDate ? 'border-red-500' : ''} />
                            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.nextCheckupDate && <p className="text-red-500 text-sm mt-1">{errors.nextCheckupDate}</p>}
                    </FieldContent>
                </Field>
            </CardContent>
        </Card>
    );

    // Reusable View Component
    const ReportView = ({ report }) => (
        <Card>
            <CardHeader>
                <CardTitle>Report Details</CardTitle>
                <CardDescription>Medical report from {formatDate(report.date)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><p className="text-sm text-gray-500">Medical Clearance</p><p className="font-medium capitalize">{report.medicalClearanceStatus}</p></div>
                    <div><p className="text-sm text-gray-500">Next Checkup</p><p className="font-medium">{formatDate(report.nextCheckupDate)}</p></div>
                </div>
                <div><p className="text-sm text-gray-500">Clinical Findings</p><p className="font-medium">{report.clinicalFindings || "N/A"}</p></div>
                <div><p className="text-sm text-gray-500">Diagnosis</p><p className="font-medium">{report.diagnosis || "N/A"}</p></div>
                <div><p className="text-sm text-gray-500">Chronic Risk Factors</p><p className="font-medium">{report.chronicRiskFactors || "N/A"}</p></div>
                <div><p className="text-sm text-gray-500">Treatment Plan</p><p className="font-medium">{report.treatmentPlan || "N/A"}</p></div>
                <div><p className="text-sm text-gray-500">Medication Prescribed</p><p className="font-medium">{report.medicationPrescribed || "N/A"}</p></div>
                <div><p className="text-sm text-gray-500">Lifestyle Advice</p><p className="font-medium">{report.lifestyleAdvice || "N/A"}</p></div>
            </CardContent>
        </Card>
    );

    return (
        <div className="bg-white rounded-[23px] border-2  ">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Doctor Report</p>
                <div className="flex items-center gap-4"> 

                    {/* --- Drop down button --- */}
                    <Select defaultValue="recent">
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="date">By Date</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {/* --- ADD MODAL --- */}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" onClick={handleOpenAddModal}>
                                +Add Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Report</DialogTitle>
                            </DialogHeader>
                            <ReportFormFields data={formData} onInputChange={handleInputChange} />
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* --- Doctor Report Records --- */}
            <div className="space-y-4">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <div 
                            key={report.id} 
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleOpenViewModal(report)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="p-2 bg-gray-200 rounded-full">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Report on {formatDate(report.date)}</h3>
                                        <p className="text-sm text-gray-600">{report.diagnosis}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenEditModal(e, report)}
                                        title="Edit Report"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenArchiveModal(e, report)}
                                        title="Archive Report"
                                    >
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No reports found. Add a new report to get started.</p>
                )}
            </div>

            {/* --- VIEW/EDIT MODAL --- */}
            <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
                <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Report' : 'View Report'}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedReport && (
                        isEditing ? (
                            <ReportFormFields data={selectedReport} onInputChange={handleInputChange} />
                        ) : (
                            <ReportView report={selectedReport} />
                        )
                    )}

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsViewEditModalOpen(false)}>
                            {isEditing ? 'Cancel' : 'Close'}
                        </Button>
                        {isEditing && (
                            <Button onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- ARCHIVE CONFIRMATION MODAL --- */}
            <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Archive Report
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive the report from {formatDate(selectedReport?.date)}? This action cannot be easily undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleArchive}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Report;