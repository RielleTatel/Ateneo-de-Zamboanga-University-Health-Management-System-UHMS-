import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { HeartPlus } from "lucide-react";  

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
        
                {/* --- CONTAINER --- */}  
                <div className="space-y-4">
                    {initialNotes.length > 0 ? (
                        initialNotes.map((notes) => (
                            <div 
                                key={notes.id}
                                // Changed background to white/light gray to better match the image
                                className="bg-container rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-shadow" 
                                onClick={() => handleOpenViewModal(notes)}
                            >
                                {/* Outer flex for content and the delete/archive icon */}
                                <div className="flex justify-between items-start">
                                    
                                    {/* Main content area */}
                                    <div className="flex-1"> 
                                        
                                        {/* Title and Date/Staff line */}
                                        <div className="mb-4 ">
                                            {/* Adjusted to match the 'Clinic Encounter # 1' text size and weight */}
                                            <div className="flex flex-row gap-x-4"> 
                                                <span> <HeartPlus/> </span> 
                                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                    Clinic Encounter # {notes.id} 
                                                </h3> 
                                            </div>
                                            {/* Line below the title: Date - Dr. Staff Name */}
                                            <span className="text-sm text-gray-500"> 
                                                {notes.date} - {notes.attendingStaff} 
                                            </span>  
                                        </div>
                            
                                        {/* Grid for encounter details: Chief Complaint, Diagnosis, Treatment, Action Taken */}
                                        {/* Using a two-column grid to put items side-by-side like in the image */}
                                        <div className="grid grid-cols-2 gap-y-4 text-sm mt-4">
                                            
                                            {/* Chief Complaint */}
                                            <div>
                                                <span className="font-medium text-gray-500 block mb-1">Chief Complaint:</span>
                                                <span className="font-semibold text-gray-900">{notes.chiefComplaint || 'Feeling warm and dizzy'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Icon (Trash Can) - positioned to the top right like in the image */}
                                    {/* The image shows only a trash can, so I'm simplifying the icon group to just the trash/delete icon */}
                                    <div className="ml-4">
                                        <button 
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-red-500"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent opening the view modal when clicking the delete button
                                                handleOpenArchiveModal(e, notes); // Assuming 'Archive' is used for the trash can action
                                            }}
                                            title="Delete Visit"
                                        >
                                            {/* Replace with your actual Trash/Delete icon component (e.g., 'Trash' or 'Delete' from a library) */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500"> No visit logs found. Add a new log to get started. </p>
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

