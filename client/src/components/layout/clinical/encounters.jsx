import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Edit, Archive, Stethoscope, FileText, Activity, ShieldAlert } from "lucide-react";  

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
            Prescription: 'Guaifenesin 200mg tablet – take one tablet every 6 hours as needed.', 
            Subscription: 'Follow-up appointment scheduled in one week if symptoms persist.', 
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
            Prescription: 'Guaifenesin 200mg tablet – take one tablet every 6 hours as needed.', 
            Subscription: 'Follow-up appointment scheduled in one week if symptoms persist.', 
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
                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={() => handleOpenViewModal(notes)}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-3"> {formatDate(notes.date)} </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500"> Staff: </span>
                                                <span className="text-gray-900">{notes.attendingStaff}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button 
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            onClick={(e) => handleOpenEditModal(e, notes)}
                                            title="Edit Visit"
                                        >
                                            <Edit className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button 
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                            onClick={(e) => handleOpenArchiveModal(e, notes)}
                                            title="Archive Visit"
                                        >
                                            <Archive className="w-4 h-4 text-gray-600" />
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
                    <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                        {selectedReport ? (
                            <>
                                {/* 1. A proper DialogHeader for the modal itself */}
                                <DialogHeader>
                                    <DialogTitle>Encounter Details</DialogTitle>
                                    <DialogDescription>
                                        A detailed summary of the patient encounter.
                                    </DialogDescription>
                                </DialogHeader>

                                {/* 2. Use a Card to structure the content cleanly */}
                                <Card className="border-none shadow-none">
                                    <CardHeader className="px-1 pt-2">
                                        {/* 3. CardHeader for the report's main info */}
                                        <CardTitle>Visit on {selectedReport.date}</CardTitle>
                                        <CardDescription>
                                            Attending Staff: {selectedReport.attendingStaff}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="px-1 pt-4 space-y-6">
                                        {/* 4. Use vertical stacks (not flex-between) for clarity */}
                                        
                                        <div className="flex items-start gap-3">
                                            <Stethoscope className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Chief Complaint</p>
                                                <p className="font-semibold text-gray-900">{selectedReport.chiefComplaint}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <ShieldAlert className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Risk Factors</p>
                                                <p className="font-semibold text-gray-900">{selectedReport.riskFactors}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">History</p>
                                                <p className="font-semibold text-gray-900 whitespace-pre-wrap">{selectedReport.History}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Activity className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-500">Treatment</p>
                                                <p className="font-semibold text-gray-900 whitespace-pre-wrap">{selectedReport.Treatment}</p>
                                            </div>
                                        </div>
                                        
                                    </CardContent>
                                </Card>

                                {/* 5. A proper DialogFooter */}
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsViewEditModalOpen(false)}>
                                        Close
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            // 6. A fallback in case selectedReport is null
                            <DialogHeader>
                                <DialogTitle>Error</DialogTitle>
                                <DialogDescription>
                                    There is no data found. Please close and try again.
                                </DialogDescription>
                            </DialogHeader>
                        )}
                    </DialogContent>
                </Dialog>

            </div> 

    )
} 

export default Encounters; 

