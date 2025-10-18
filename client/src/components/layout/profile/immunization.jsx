import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Archive, Calendar, AlertTriangle } from "lucide-react";

// Mock data
const initialImmunizations = [
    {
        id: 1,
        vaccineType: 'COVID - 19 (PFIZER)',
        lastAdministered: '2022-08-05',
        nextDue: '',
        complianceStatus: 'completed'
    },
    {
        id: 2,
        vaccineType: 'Hepatitis B',
        lastAdministered: '2007-07-05',
        nextDue: '',
        complianceStatus: 'completed'
    },
    {
        id: 3,
        vaccineType: 'Influenza',
        lastAdministered: '2024-08-23',
        nextDue: '2025-08-23',
        complianceStatus: 'overdue'
    }
];

// Blank form
const blankForm = {
    vaccineType: '',
    lastAdministered: '',
    nextDue: '',
    complianceStatus: 'up-to-date'
};

const Immunization = () => {
    const [immunizations, setImmunizations] = useState(initialImmunizations);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImmunization, setSelectedImmunization] = useState(null);

    const [formData, setFormData] = useState(blankForm);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const data = isEditing ? selectedImmunization : formData;
        
        if (!data.vaccineType.trim()) {
            newErrors.vaccineType = 'Vaccine type is required';
        } else if (data.vaccineType.trim().length < 2) {
            newErrors.vaccineType = 'Vaccine type must be at least 2 characters';
        }
        
        if (!data.lastAdministered) {
            newErrors.lastAdministered = 'Last administered date is required';
        } else {
            const adminDate = new Date(data.lastAdministered);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize
            if (adminDate > today && adminDate.toDateString() !== today.toDateString()) {
                newErrors.lastAdministered = 'Date cannot be in the future';
            }
        }
        
        if (data.nextDue && data.lastAdministered) {
            const nextDueDate = new Date(data.nextDue);
            const adminDate = new Date(data.lastAdministered);
            if (nextDueDate <= adminDate) {
                newErrors.nextDue = 'Next due date must be after last administered date';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        const updater = isEditing ? setSelectedImmunization : setFormData;
        updater(prev => ({ ...prev, [field]: value }));
        
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            if (isEditing) {
                setImmunizations(immunizations.map(item => 
                    item.id === selectedImmunization.id ? selectedImmunization : item
                ));
            } else {
                setImmunizations([{ ...formData, id: Date.now() }, ...immunizations]);
            }
            
            setIsAddModalOpen(false);
            setIsViewEditModalOpen(false);
            setIsEditing(false);
            setSelectedImmunization(null);
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

    const handleOpenViewModal = (item) => {
        setSelectedImmunization(item);
        setIsEditing(false);
        setIsViewEditModalOpen(true);
    };
    
    const handleOpenEditModal = (e, item) => {
        e.stopPropagation();
        setSelectedImmunization({ ...item });
        setIsEditing(true);
        setErrors({});
        setIsViewEditModalOpen(true);
    };

    const handleOpenArchiveModal = (e, item) => {
        e.stopPropagation();
        setSelectedImmunization(item);
        setIsArchiveModalOpen(true);
    };

    const handleArchive = () => {
        setImmunizations(immunizations.filter(item => item.id !== selectedImmunization.id));
        setIsArchiveModalOpen(false);
        setSelectedImmunization(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    };

    // --- Reusable Form ---
    const ImmunizationFormFields = ({ data, onInputChange }) => (
        <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
                <Field>
                    <FieldLabel>Vaccine Type *</FieldLabel>
                    <FieldContent>
                        <Input placeholder="COVID - 19 (PFIZER)" value={data.vaccineType} onChange={(e) => onInputChange('vaccineType', e.target.value)} className={errors.vaccineType ? 'border-red-500' : ''} />
                        {errors.vaccineType && <p className="text-red-500 text-sm mt-1">{errors.vaccineType}</p>}
                    </FieldContent>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel>Last Administered *</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input type="date" value={data.lastAdministered} onChange={(e) => onInputChange('lastAdministered', e.target.value)} className={errors.lastAdministered ? 'border-red-500' : ''} />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.lastAdministered && <p className="text-red-500 text-sm mt-1">{errors.lastAdministered}</p>}
                        </FieldContent>
                    </Field>
                    <Field>
                        <FieldLabel>Next Due (if applicable)</FieldLabel>
                        <FieldContent>
                            <div className="relative">
                                <Input type="date" value={data.nextDue} onChange={(e) => onInputChange('nextDue', e.target.value)} className={errors.nextDue ? 'border-red-500' : ''} />
                                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.nextDue && <p className="text-red-500 text-sm mt-1">{errors.nextDue}</p>}
                        </FieldContent>
                    </Field>
                </div>
                <Field>
                    <FieldLabel>Compliance Status</FieldLabel>
                    <FieldContent>
                        <Select value={data.complianceStatus} onValueChange={(value) => onInputChange('complianceStatus', value)}>
                            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="up-to-date">Up-to-date</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="missed">Missed</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldContent>
                </Field>
            </CardContent>
        </Card>
    );

    // --- Status Styling Helper ---
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
            case 'up-to-date':
                return 'text-green-600';
            case 'overdue':
                return 'text-orange-600';
            case 'missed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };
    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    // --- Reusable View ---
    const ImmunizationView = ({ item }) => (
        <Card>
            <CardHeader>
                <CardTitle>{item.vaccineType}</CardTitle>
                <CardDescription className={`font-medium ${getStatusClass(item.complianceStatus)}`}>
                    Status: {formatStatus(item.complianceStatus)}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Last Administered</p>
                    <p className="font-semibold">{formatDate(item.lastAdministered)}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Next Due Date</p>
                    <p className="font-semibold">{formatDate(item.nextDue)}</p>
                </div>
            </CardContent>
        </Card>
    );

    // --- Record Item Component ---
    const ImmunizationRecord = ({ item }) => (
        <div 
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors"
            onClick={() => handleOpenViewModal(item)}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.vaccineType}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                        <span>Last Administered: {formatDate(item.lastAdministered)}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className={`font-medium ${getStatusClass(item.complianceStatus)}`}>
                            Status: {formatStatus(item.complianceStatus)}
                        </span>
                    </div>
                    {item.nextDue && (item.complianceStatus === 'overdue' || item.complianceStatus === 'missed') && (
                        <div className="mt-1 text-sm text-red-600">
                            Due Next: {formatDate(item.nextDue)} {item.complianceStatus === 'missed' ? '(Missed)' : ''}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                    <button 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => handleOpenEditModal(e, item)}
                        title="Edit Record"
                    >
                        <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={(e) => handleOpenArchiveModal(e, item)}
                        title="Archive Record"
                    >
                        <Archive className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2">
                <p className="text-xl font-bold">Immunization Records</p> 

                <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="modify" onClick={handleOpenAddModal}>
                            + Add Immunization
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>Add Immunization</DialogTitle></DialogHeader>
                        <ImmunizationFormFields data={formData} onInputChange={handleInputChange} />
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>Add</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Immunization Records */}
            <div className="space-y-4 mt-6">
                {immunizations.length > 0 ? (
                    immunizations.map(item => <ImmunizationRecord key={item.id} item={item} />)
                ) : (
                    <p className="text-gray-500 text-center">No immunization records found.</p>
                )}
            </div>

            {/* --- VIEW/EDIT MODAL --- */}
            <Dialog open={isViewEditModalOpen} onOpenChange={setIsViewEditModalOpen}>
                <DialogContent className="sm:max-w-md max-w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? 'Edit Immunization' : 'View Immunization'}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedImmunization && (
                        isEditing ? (
                            <ImmunizationFormFields data={selectedImmunization} onInputChange={handleInputChange} />
                        ) : (
                            <ImmunizationView item={selectedImmunization} />
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
                            Archive Record
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to archive the record for <strong>{selectedImmunization?.vaccineType}</strong>?
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

export default Immunization;