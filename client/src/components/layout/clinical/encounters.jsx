import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartPlus, Eye, Trash2 } from "lucide-react";  

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        })
    }

    const initialNotes = [
         {
            id: 1, 
            date: '3000-10-23', 
            attendingStaff: 'Dr. Alicia Ramos, MD', 
            chiefComplaint: 'Persistent cough and mild fever for 4 days', 
            riskFactors: 'Smoker (10 years), mild hypertension', 
            History: 'Patient reports onset of cough after flu symptoms.', 
            Treatment: 'Prescribed rest, hydration, and mild expectorant therapy.', 
            Prescription: 'Guaifenesin 200mg tablet – Breakfast 1 tab, Lunch 1 tab', 
            Signatura: 'Dr. Alicia Ramos, MD – General Medicine',
        },  

        {
            id: 2, 
            date: '4000-10-23', 
            attendingStaff: 'RESLY', 
            chiefComplaint: 'Persistent cough and mild fever for 4 days', 
            riskFactors: 'Smoker (10 years), mild hypertension', 
            History: 'Patient reports onset of cough after', 
            Treatment: 'Prescribed rest, hydration, and mild expectorant therapy.', 
            Prescription: 'Guaifenesin 200mg tablet – Breakfast 1 tab, Lunch 1 tab', 
            Signatura: 'Dr. Alicia Ramos, MD – General Medicine',
        }, 
    ];   

    const blankForm = {
        id: '', 
        date: '', 
        attendingStaff: '', 
        chiefComplaint: '', 
        riskFactors: '', 
        History: '', 
        Treatment: '', 
        Prescription: '', 
        Subscription: '', 
        Signatura: '',
    }

const Encounters = () => { 
    
        const [formData, setFormData] = useState(blankForm);    
        const [reports, setReports] = useState(initialNotes); 

        const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
        const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

        const [isEditing, setIsEditing] = useState(false);
        const [selectedReport, setSelectedReport] = useState(null); 

        const [errors, setErrors] = useState({});
    

    const handleOpenViewModal = (notes) => {
        setSelectedReport(notes);
        setIsEditing(false);
        setIsViewEditModalOpen(true); 
    }; 

    const handleOpenArchiveModal = (e, report) => {
        e.stopPropagation(); 
        setSelectedReport(report);
        setIsArchiveModalOpen(true);
    };  

    const handleOpenEditModal = (e, report) => {
        e.stopPropagation(); // Prevent triggering view modal
        setSelectedReport({ ...report }); // Clone report to avoid mutating state directly
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };
 


    return ( 

        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6"> {/* MAIN CONTAINER */}

            {/* FIRST LAYER */}
            <div className="flex justify-between items-center gap-2 mb-6"> 
                <p className="text-xl font-bold"> Notes </p> 
                {/* --- Drop down button --- */}  
                <div className="flex items-center gap-4">  
                    <Select defaultValue="recent">
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

            {/* --- SECOND lAYER --- */}  
            </div>  
        
                {/* --- TABLE CONTAINER --- */}  
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                    {initialNotes.length > 0 ? (
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
                                    <TableHead className="font-semibold text-gray-700">Attending Staff</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Chief Complaint</TableHead>
                                    <TableHead className="w-[120px] text-center font-semibold text-gray-700">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {initialNotes.map((notes) => (
                                    <TableRow 
                                        key={notes.id}
                                        className="cursor-pointer hover:bg-blue-50/50 transition-colors border-outline"
                                        onClick={() => handleOpenViewModal(notes)}
                                    >
                                        <TableCell className="font-medium text-gray-900">
                                            #{notes.id}
                                        </TableCell>
                                        <TableCell className="text-gray-700">
                                            {formatDate(notes.date)}
                                        </TableCell>
                                        <TableCell className="text-gray-700">
                                            {notes.attendingStaff}
                                        </TableCell>
                                        <TableCell className="text-gray-600 max-w-md">
                                            <div className="truncate" title={notes.chiefComplaint}>
                                                {notes.chiefComplaint || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenViewModal(notes);
                                                    }}
                                                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenArchiveModal(e, notes);
                                                    }}
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
            
                {/* --- OUTSIDE LAYER/MODAL--- */}   
                <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
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
            {selectedReport ? (
                <>
                    {/* Modal Header */}
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Encounter Details
                        </DialogTitle>
                    </DialogHeader>

                    {/* Date and Attending Staff */}
                    <div>
                        <p className="text-lg font-semibold text-gray-800">
                            Visit on {selectedReport.date}
                        </p>
                        <p className="text-gray-600">
                            Attending Staff: <span className="font-medium">{selectedReport.attendingStaff}</span>
                        </p>
                    </div>

                    {/* Main Unified Container */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-8">

                        {/* Chief Complaint */}
                        <section>
                            <p className="text-lg font-bold text-gray-700">Chief Complaint</p>
                            <p className="mt-1 text-gray-900 leading-relaxed">
                                {selectedReport.chiefComplaint}
                            </p>
                        </section>

                        {/* Risk Factors */}
                        <section>
                            <p className="text-lg font-bold text-gray-700">Risk Factors</p>
                            <p className="mt-1 text-gray-900 leading-relaxed">
                                {selectedReport.riskFactors}
                            </p>
                        </section>

                        {/* History */}
                        <section>
                            <p className="text-lg font-bold text-gray-700">History</p>
                            <p className="mt-1 text-gray-900 whitespace-pre-wrap leading-relaxed">
                                {selectedReport.History}
                            </p>
                        </section>

                        {/* Prescription - bullet list */}
                        <section>
                            <p className="text-lg font-bold text-gray-700">Prescription</p>
                            <ul className="list-disc pl-6 mt-1 text-gray-900 space-y-1">
                                {selectedReport.Prescription.split('.').map((item, index) => 
                                    item.trim() && <li key={index}> 4{item.trim()}</li>
                                )}
                            </ul>
                        </section>

                    </div>

                    {/* Footer */}
                    <DialogFooter className="mt-6">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsViewEditModalOpen(false)}
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

    )
} 

export default Encounters; 

