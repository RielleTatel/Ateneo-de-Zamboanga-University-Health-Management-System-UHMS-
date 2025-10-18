import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, Calendar, User, Stethoscope, AlertTriangle } from "lucide-react";

// Mock data for initial visit logs
const initialVisitsData = [
    {
        id: 1,
        date: "2025-09-03",
        reason: "Medical Check",
        attendingStaff: "Dr. AC",
        actionTaken: "referral-followup"
    },
    // Add more mock visits here
];

// Blank form for adding new visits
const blankForm = {
    date: '',
    attendingStaff: '',
    reason: '',
    actionTaken: 'referral-followup'
};

const visits = () => {
    const [visits, setVisits] = useState(initialVisitsData);
    
    // State for Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    
    const [selectedVisit, setSelectedVisit] = useState(null); // For view/edit/archive
    const [formData, setFormData] = useState(blankForm); // For the "Add" form
    const [editFormData, setEditFormData] = useState(null); // For the "Edit" form
    
    const [errors, setErrors] = useState({});
    const [editErrors, setEditErrors] = useState({});

    // --- Validation ---
    const validateForm = (data) => {
        const newErrors = {};
        
        if (!data.date) {
            newErrors.date = 'Date is required';
        } else {
            const visitDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize today's date
            if (visitDate > today && visitDate.toDateString() !== today.toDateString()) {
                newErrors.date = 'Visit date cannot be in the future';
            }
        }
        
        if (!data.attendingStaff.trim()) {
            newErrors.attendingStaff = 'Attending staff is required';
        } else if (data.attendingStaff.trim().length < 2) {
            newErrors.attendingStaff = 'Must be at least 2 characters';
        }
        
        if (!data.reason.trim()) {
            newErrors.reason = 'Reason is required';
        } else if (data.reason.trim().length < 3) {
            newErrors.reason = 'Must be at least 3 characters';
        }
        
        return newErrors;
    };

    // --- "Add" Modal Logic ---
    const handleAddInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleAddSubmit = () => {
        const newErrors = validateForm(formData);
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            const newVisit = { ...formData, id: Date.now() };
            setVisits([newVisit, ...visits]); // Add new visit to the beginning
            console.log('Visit log submitted:', newVisit);
            setIsAddModalOpen(false);
            setFormData(blankForm);
            setErrors({});
        }
    };

    // --- "Edit" Modal Logic ---
    const handleEditInputChange = (field, value) => {
        setEditFormData(prev => ({ ...prev, [field]: value }));
        if (editErrors[field]) {
            setEditErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleEditSubmit = () => {
        const newErrors = validateForm(editFormData);
        setEditErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setVisits(visits.map(visit => 
                visit.id === editFormData.id ? editFormData : visit
            ));
            console.log('Visit log updated:', editFormData);
            setIsEditModalOpen(false);
            setEditFormData(null);
            setEditErrors({});
        }
    };

    // --- Modal Open/Close Handlers ---
    const handleOpenViewModal = (visit) => {
        setSelectedVisit(visit);
        setIsViewModalOpen(true);
    };

    const handleOpenEditModal = (e, visit) => {
        e.stopPropagation(); // Prevent view modal from opening
        setEditFormData({ ...visit }); // Set form data for editing
        setEditErrors({}); // Clear any previous errors
        setIsEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, visit) => {
        e.stopPropagation(); // Prevent view modal from opening
        setSelectedVisit(visit);
        setIsArchiveModalOpen(true);
    };

    const handleArchiveConfirm = () => {
        setVisits(visits.filter(visit => visit.id !== selectedVisit.id));
        setIsArchiveModalOpen(false);
        setSelectedVisit(null);
    };
    
    // --- Helper Functions ---
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' // Added timeZone to prevent off-by-one day issues
        });
    };

    const formatActionTaken = (action) => {
        switch (action) {
            case 'referral-followup': return 'Referral/Follow-up';
            case 'treatment': return 'Treatment';
            case 'consultation': return 'Consultation';
            case 'checkup': return 'Check-up';
            default: return 'N/A';
        }
    };

    // --- Reusable Form Fields Component ---
    const VisitFormFields = ({ data, onInputChange, formErrors }) => (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Date *</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input type="date" value={data.date} onChange={(e) => onInputChange('date', e.target.value)} className={formErrors.date ? 'border-red-500' : ''} />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {formErrors.date && <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>}
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Action Taken</FieldLabel>
                        <FieldContent>
                            <Select value={data.actionTaken} onValueChange={(value) => onInputChange('actionTaken', value)}>
                                <SelectTrigger><SelectValue placeholder="Select action" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="referral-followup">Referral/Follow-up</SelectItem>
                                    <SelectItem value="treatment">Treatment</SelectItem>
                                    <SelectItem value="consultation">Consultation</SelectItem>
                                    <SelectItem value="checkup">Check-up</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldContent>
                    </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Attending Staff *</FieldLabel>
                        <FieldContent>
                            <Input placeholder="Dr. AC" value={data.attendingStaff} onChange={(e) => onInputChange('attendingStaff', e.target.value)} className={formErrors.attendingStaff ? 'border-red-500' : ''} />
                            {formErrors.attendingStaff && <p className="text-red-500 text-sm mt-1">{formErrors.attendingStaff}</p>}
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Reason *</FieldLabel>
                        <FieldContent>
                            <Input placeholder="Medical Check" value={data.reason} onChange={(e) => onInputChange('reason', e.target.value)} className={formErrors.reason ? 'border-red-500' : ''} />
                            {formErrors.reason && <p className="text-red-500 text-sm mt-1">{formErrors.reason}</p>}
                        </FieldContent>
                    </Field>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Clinic Visit Logs</p>
                <div className="flex items-center gap-4">
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
                    
                    {/* --- ADD VISIT MODAL --- */}
                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="modify" onClick={() => { setFormData(blankForm); setErrors({}); setIsAddModalOpen(true); }}>
                                + Add Visit Log
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Add Visit Log</DialogTitle></DialogHeader>
                            <VisitFormFields data={formData} onInputChange={handleAddInputChange} formErrors={errors} />
                            <DialogFooter className="gap-2">
                                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddSubmit}>Add Log</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* --- Visit Records List --- */}
            <div className="space-y-4">
                {visits.length > 0 ? (
                    visits.map((visit) => (
                        <div 
                            key={visit.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleOpenViewModal(visit)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-3">{formatDate(visit.date)}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">Reason: </span>
                                            <span className="text-gray-900">{visit.reason}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Staff: </span>
                                            <span className="text-gray-900">{visit.attendingStaff}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Action: </span>
                                            <span className="text-gray-900">{formatActionTaken(visit.actionTaken)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenEditModal(e, visit)}
                                        title="Edit Visit"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button 
                                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        onClick={(e) => handleOpenArchiveModal(e, visit)}
                                        title="Archive Visit"
                                    >
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No visit logs found. Add a new log to get started.</p>
                )}
            </div>

            {/* --- VIEW MODAL --- */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Clinic Visit Details</DialogTitle>
                    </DialogHeader>
                    {selectedVisit && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Visit on {formatDate(selectedVisit.date)}</CardTitle>
                                <CardDescription>Details of the clinic consultation.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Reason for Visit</p>
                                        <p className="font-semibold">{selectedVisit.reason}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Attending Staff</p>
                                        <p className="font-semibold">{selectedVisit.attendingStaff}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Stethoscope className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Action Taken</p>
                                        <p className="font-semibold">{formatActionTaken(selectedVisit.actionTaken)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- EDIT MODAL --- */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Edit Visit Log</DialogTitle></DialogHeader>
                    {editFormData && (
                        <VisitFormFields data={editFormData} onInputChange={handleEditInputChange} formErrors={editErrors} />
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleEditSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* --- ARCHIVE CONFIRMATION MODAL --- */}
            <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Archive Visit Log
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive the visit log from {formatDate(selectedVisit?.date)}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleArchiveConfirm}>Archive</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default visits;