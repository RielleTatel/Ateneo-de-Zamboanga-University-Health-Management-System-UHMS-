import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

    const initialNotes = [
        {
            id: 1, 
            date: '2025-09-03', 
            medicalClearance: 'Normal', 
            chiefComplaint: 'Diagnosis', 
            historyOfSickness: 'Coughing', 
            Prescription: 'Amoxicilin', 
            nextCheckupdate: 'April 10, 2024', 
        }
    ];  

    const blackForm = {
        id: '', 
        date: '', 
        medicalClearance: '', 
        chiefComplaint: '', 
        historyOfSickness: '', 
        Prescription: '', 
        nextCheckupdate: '', 
    }

const Encounters = () => { 

    const [reports, setReports] = useState(initialNotes); 
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
    const [isViewEditModal, setIsViewEditModal] = usestate(false); 
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false); 

    const [isEditing, setIsEditing] = useState(false); 
    const [selectedReport, setSelectedReport] = useState(null); 

    // Use a single state for form data (for both add and edit) 
    const [formData, setFormData] = useState(blackForm); 
    const [errors, setErrors] = useState({}); 


    //Validates the entry form 
    const validateForm = () => {
        const newErrors = {}; 
        const dataToValidate = isEditing ? selectedReport : formData; 

        {}
        if (!dataToValidate.date) {
            newErrors.date = 'Date is required'; 
        } else {
            const reportDate = new Date(dataTaValidate.date); 
            const today = new Date(); 

            today.setHours(0, 0, 0, 0); // Nomalize today's date 
            if (reportDate > today && reportDate.toDateString() !== today.toDateString()) {
                newErrors.date = 'Report date cannot be in the future';
            }
        }

        setErrors(newErrors); 
        return Object.keys(newErrors).lenght === 0; 
    } 

    const handleSubmit = () => {
        if (validateForm()) {
            if (isEditing) {
                //update existing report
                setReports(reports.map(report => 
                    report.id ===selectedReport.id ? selectedReport : report
                ))
                console.log('Reported updated: ', selectedReport); 
            } else {
                // Add new report 
                const newReport = {...formData, id: Date.now() }; 
                setReports([newreport, ...reports]); //Add to the Beginning 
                console.log('report submitted: ', newReport); 
            } 

            // Close and reset
            setIsAddModalOpen(false);
            setIsViewEditModalOpen(false);
            setIsEditing(false);
            setSelectedReport(null);
            setFormData(blankForm);
            setErrors({});
        }
    } 

    const handleOpenModal = () => {
        setIsEditing(false);
        setFormData(blankForm);
        setErrors({});
        setIsAddModalOpen(true);
    } 


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

    const ReportFormFields = ({ data, onInputChange }) => {
        
    }

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6"> 
            <div className="flex justify-between items-center gap-2 mb-6"> 
                <p className="text-xl font-bold"> Notes </p> 

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
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="modify">
                                +Add Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add Report </DialogTitle>
                            </DialogHeader>
                                
                            <DialogFooter className="gap-2">
                                <Button variant="outline" >Cancel</Button>
                                <Button >Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> 

                </div>

            </div> 
        </div>
    )
} 

export default Encounters; 

