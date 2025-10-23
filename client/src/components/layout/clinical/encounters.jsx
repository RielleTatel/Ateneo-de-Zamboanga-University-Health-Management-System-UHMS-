import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive } from "lucide-react";

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        })
    }

    const initialNotes = [
         {
            id: 'PT-20251023-1842', 
            date: '2025-10-23', 
            attendingStaff: 'Dr. Alicia Ramos, MD', 
            chiefComplaint: 'Persistent cough and mild fever for 4 days', 
            riskFactors: 'Smoker (10 years), mild hypertension', 
            History: 'Patient reports onset of cough after flu symptoms. No history of asthma or allergies.', 
            Treatment: 'Prescribed rest, hydration, and mild expectorant therapy.', 
            Prescription: 'Guaifenesin 200mg tablet – take one tablet every 6 hours as needed.', 
            Subscription: 'Follow-up appointment scheduled in one week if symptoms persist.', 
            Signatura: 'Dr. Alicia Ramos, MD – General Medicine',
        }
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
    

    const handleOpenViewModal = (report) => {
        setSelectedReport(report);
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
                </div> 
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
        </div>
    )
} 

export default Encounters; 

                    {/*  
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" onClick={handleOpenAddModal}>
                                +Add Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle> Add Report </DialogTitle>
                            </DialogHeader>
                            

                            <ReportFormFields data={formData} onInputChange={handleInputChange} errors={errors}/>

                            <DialogFooter className="gap-2">
                                <Button variant="outline"onClick={() => setIsAddModalOpen(false)} >Cancel</Button>
                                <Button onClick={handleSubmit}>Add</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>  

                    */} 